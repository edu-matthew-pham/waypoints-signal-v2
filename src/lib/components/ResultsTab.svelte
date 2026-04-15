<script lang="ts">
  import { onMount } from 'svelte'
  import { db } from '$lib/supabase'
  import { loadNodeFile } from '$lib/data'

  let { userId }: { userId: string } = $props()

  type Signal = 'green' | 'yellow' | 'red'

  interface AggRow {
    index: number
    text: string
    green: number
    yellow: number
    red: number
  }

  interface ResultsData {
    studentCount: number
    nodeLabel: string
    progressionEndpoint: string
    aggregate: AggRow[]
    yGoalAggregate: { green: number; yellow: number; red: number }
    criteriaGroups: { nodeId: number; nodeLabel: string; hinge: boolean; startIdx: number; count: number }[] | null
  }

  let sessions: { session_code: string; label: string | null; created_at: string | null }[] = $state([])
  let loadingSessions = $state(false)
  let resCode = $state('')
  let loadingResults = $state(false)
  let results: ResultsData | null = $state(null)
  let resultsError = $state('')
  let showDetail = $state(false)

  onMount(loadRecentSessions)

  async function loadRecentSessions() {
    loadingSessions = true
    try {
      const { data, error } = await db
        .from('sessions')
        .select('session_code, label, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)
      if (error) throw error
      sessions = data ?? []
    } catch (e) {
      console.error(e)
    } finally {
      loadingSessions = false
    }
  }

  function selectSession(code: string) {
    resCode = code
    fetchResults()
  }

  async function fetchResults() {
    const code = resCode.trim().toUpperCase()
    if (!code) return
    loadingResults = true
    resultsError = ''
    results = null
    showDetail = false

    try {
      const { data: session, error: sessionErr } = await db
        .from('sessions')
        .select('*')
        .eq('session_code', code)
        .single()

      if (sessionErr || !session) { resultsError = 'Session not found.'; return }

      let criteriaGroups: ResultsData['criteriaGroups'] = null
      if (session.node_id === 'all' && session.standard) {
        try {
          const nodeFile = await loadNodeFile(session.standard)
          let idx = 0
          criteriaGroups = []
          for (const n of nodeFile.standard.nodes) {
            const count = (n.success_criteria ?? []).length
            if (count > 0) {
              criteriaGroups.push({ nodeId: n.id, nodeLabel: n.label, hinge: n.hinge, startIdx: idx, count })
              idx += count
            }
          }
        } catch { criteriaGroups = null }
      }

      const { data: subs, error: subsErr } = await db
        .from('submissions')
        .select('id, student_id, y_goal_signal, criterion_signals(criterion_idx, criterion_txt, signal)')
        .eq('session_code', code)

      if (subsErr) throw subsErr
      if (!subs || subs.length === 0) { resultsError = 'No responses yet for this session.'; return }

      const studentIds = new Set(subs.map(s => s.student_id))
      const aggregate: Record<string, AggRow> = {}
      const yGoalAgg = { green: 0, yellow: 0, red: 0 }

      for (const sub of subs) {
        const sig = sub.y_goal_signal as Signal
        if (sig in yGoalAgg) yGoalAgg[sig]++
        for (const cs of (sub.criterion_signals ?? []) as { criterion_idx: number; criterion_txt: string; signal: Signal }[]) {
          const key = `${cs.criterion_idx}|${cs.criterion_txt}`
          if (!aggregate[key]) aggregate[key] = { index: cs.criterion_idx, text: cs.criterion_txt, green: 0, yellow: 0, red: 0 }
          if (cs.signal in aggregate[key]) aggregate[key][cs.signal as Signal]++
        }
      }

      results = {
        studentCount: studentIds.size,
        nodeLabel: session.node_label ?? '',
        progressionEndpoint: session.y_goal ?? '',
        aggregate: Object.values(aggregate).sort((a, b) => a.index - b.index),
        yGoalAggregate: yGoalAgg,
        criteriaGroups,
      }
    } catch (e) {
      resultsError = 'Could not load results — check your connection.'
      console.error(e)
    } finally {
      loadingResults = false
    }
  }

  function pct(n: number, total: number) {
    return total === 0 ? 0 : Math.round(n / total * 100)
  }

  function pctColor(greenPct: number, redPct: number) {
    if (greenPct >= 70) return 'text-green'
    if (redPct >= 40) return 'text-red'
    return 'text-yellow'
  }

  function groupHeaderFor(i: number) {
    return results?.criteriaGroups?.find(g => g.startIdx === i) ?? null
  }

  function exportCSV() {
    if (!results) return
    const code = resCode.trim().toUpperCase()
    const rows = [['Session Code', 'Criterion', 'Criterion Text', 'Got it', 'Getting there', 'Not yet', 'Total', '% Got it']]
    for (const [i, row] of results.aggregate.entries()) {
      const total = row.green + row.yellow + row.red || 1
      rows.push([code, `SC${i + 1}`, row.text, String(row.green), String(row.yellow), String(row.red), String(total), `${pct(row.green, total)}%`])
    }
    const yg = results.yGoalAggregate
    const ygTotal = yg.green + yg.yellow + yg.red || 1
    rows.push([code, 'Unit goal', results.progressionEndpoint, String(yg.green), String(yg.yellow), String(yg.red), String(ygTotal), `${pct(yg.green, ygTotal)}%`])
    const csv = rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `waypoints-${code}.csv`
    a.click()
  }
</script>

<div class="space-y-5">

  <!-- Recent sessions -->
  <div>
    <div class="font-mono text-[11px] font-medium tracking-[0.05em] uppercase text-muted mb-2">Recent sessions</div>
    {#if loadingSessions}
      <p class="text-[13px] text-muted">Loading…</p>
    {:else if sessions.length === 0}
      <p class="text-[13px] text-muted">No sessions yet.</p>
    {:else}
      <div class="space-y-1.5">
        {#each sessions as s}
          <button
            onclick={() => selectSession(s.session_code)}
            class="w-full flex items-center justify-between bg-surface border border-border rounded-lg px-3.5 py-2.5 cursor-pointer hover:border-interactive transition-colors text-left"
          >
            <div>
              <div class="text-[13px] font-medium text-[#1a1917]">{s.label ?? s.session_code}</div>
              <div class="font-mono text-[11px] text-muted mt-0.5">
                {s.created_at ? new Date(s.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
              </div>
            </div>
            <div class="font-mono text-[13px] font-semibold text-interactive ml-3 shrink-0">{s.session_code}</div>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Manual code entry -->
  <div>
    <div class="font-mono text-[11px] font-medium tracking-[0.05em] uppercase text-muted mb-1.5">Or enter session code</div>
    <div class="flex gap-2">
      <input
        type="text"
        placeholder="XKQT-4821"
        bind:value={resCode}
        onkeydown={(e) => e.key === 'Enter' && fetchResults()}
        class="font-mono text-[14px] tracking-[0.08em] uppercase w-[160px] px-3 py-2.5 border border-border rounded-lg bg-surface outline-none focus:border-[#1a1917] transition-colors"
      />
      <button
        onclick={fetchResults}
        class="px-4 py-2.5 bg-[#1a1917] text-white text-[13px] font-semibold rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
      >
        Load
      </button>
    </div>
  </div>

  <!-- Results area -->
  {#if loadingResults}
    <p class="text-[13px] text-muted">Loading results…</p>

  {:else if resultsError}
    <p class="text-[13px] text-red">{resultsError}</p>

  {:else if results}
    <div>
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <div class="font-mono text-[11px] font-medium tracking-[0.05em] uppercase text-muted">
          Results — {results.studentCount} student{results.studentCount !== 1 ? 's' : ''}
        </div>
        <button
          onclick={exportCSV}
          class="px-3 py-1.5 bg-border text-[#1a1917] text-[12px] font-semibold rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
        >
          Export CSV
        </button>
      </div>

      {#if results.nodeLabel}
        <div class="text-[13px] font-semibold mb-1">{results.nodeLabel}</div>
      {/if}
      {#if results.progressionEndpoint}
        <div class="text-[12px] text-muted italic mb-4 leading-[1.5]">{results.progressionEndpoint}</div>
      {/if}

      <!-- Compact summary bars -->
      <div class="space-y-2 mb-3">
        {#each results.aggregate as row, i}
          {@const total = row.green + row.yellow + row.red || 1}
          {@const gPct = pct(row.green, total)}
          {@const yPct = pct(row.yellow, total)}
          {@const rPct = pct(row.red, total)}
          {@const header = groupHeaderFor(i)}
          {#if header}
            <div class="{i > 0 ? 'mt-4' : ''} mb-1">
              <div class="font-mono text-[10px] font-semibold tracking-[0.06em] uppercase text-muted pb-1 border-b border-border">
                {header.nodeLabel}{header.hinge ? ' ⚑' : ''}
              </div>
            </div>
          {/if}
          <div class="flex items-center gap-3">
            <div class="text-[12px] text-[#1a1917] flex-1 leading-[1.4] line-clamp-2">{row.text}</div>
            <div class="flex items-center gap-2 flex-1">
              <div class="flex flex-1 h-5 rounded overflow-hidden gap-px">
                {#if gPct > 0}<div class="bg-green" style="flex:{row.green}"></div>{/if}
                {#if yPct > 0}<div class="bg-yellow" style="flex:{row.yellow}"></div>{/if}
                {#if rPct > 0}<div class="bg-red" style="flex:{row.red}"></div>{/if}
              </div>
              <span class="font-mono text-[11px] font-semibold w-9 text-right shrink-0 {pctColor(gPct, rPct)}">
                {gPct}%
              </span>
            </div>
          </div>
        {/each}

        <!-- Y-goal summary row -->
        <div class="flex items-center gap-3 pt-2 border-t border-border mt-2">
          <div class="text-[12px] text-muted flex-1 leading-[1.4]">Unit goal confidence</div>
          <div class="flex items-center gap-2 flex-1">
            <div class="flex flex-1 h-5 rounded overflow-hidden gap-px">
              {#if results.yGoalAggregate.green  > 0}<div class="bg-green"  style="flex:{results.yGoalAggregate.green}"></div>{/if}
              {#if results.yGoalAggregate.yellow > 0}<div class="bg-yellow" style="flex:{results.yGoalAggregate.yellow}"></div>{/if}
              {#if results.yGoalAggregate.red    > 0}<div class="bg-red"    style="flex:{results.yGoalAggregate.red}"></div>{/if}
            </div>
            <span class="font-mono text-[11px] font-semibold w-9 text-right shrink-0 {pctColor(pct(results.yGoalAggregate.green, results.yGoalAggregate.green + results.yGoalAggregate.yellow + results.yGoalAggregate.red || 1), pct(results.yGoalAggregate.red, results.yGoalAggregate.green + results.yGoalAggregate.yellow + results.yGoalAggregate.red || 1))}">
              {pct(results.yGoalAggregate.green, results.yGoalAggregate.green + results.yGoalAggregate.yellow + results.yGoalAggregate.red || 1)}%
            </span>
          </div>
        </div>
      </div>

      <!-- Detail toggle -->
      <button
        onclick={() => showDetail = !showDetail}
        class="text-[12px] text-muted cursor-pointer hover:text-[#1a1917] transition-colors mb-3"
      >
        {showDetail ? 'Hide criterion detail ▴' : 'Show criterion detail ▾'}
      </button>

      <!-- Criterion detail -->
      {#if showDetail}
        <div class="space-y-2">
          {#each results.aggregate as row, i}
            {@const total = row.green + row.yellow + row.red || 1}
            {@const header = groupHeaderFor(i)}
            {#if header}
              <div class="{i > 0 ? 'mt-4' : ''} mb-1">
                <div class="font-mono text-[10px] font-semibold tracking-[0.06em] uppercase text-muted pb-1 border-b border-border">
                  {header.nodeLabel}{header.hinge ? ' ⚑' : ''}
                </div>
              </div>
            {/if}
            <div class="bg-surface border border-border rounded-xl p-3.5">
              <div class="text-[13px] leading-[1.5] mb-2.5"><strong>SC{i + 1}</strong> — {row.text}</div>
              <div class="flex gap-1 h-7 rounded overflow-hidden">
                {#if row.green  > 0}<div class="bg-green  flex items-center justify-center text-white font-mono text-[11px] font-semibold" style="flex:{row.green}">{row.green}</div>{/if}
                {#if row.yellow > 0}<div class="bg-yellow flex items-center justify-center text-white font-mono text-[11px] font-semibold" style="flex:{row.yellow}">{row.yellow}</div>{/if}
                {#if row.red    > 0}<div class="bg-red    flex items-center justify-center text-white font-mono text-[11px] font-semibold" style="flex:{row.red}">{row.red}</div>{/if}
              </div>
              <div class="flex gap-4 mt-1.5">
                <span class="text-[11px] text-muted flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green inline-block"></span>{pct(row.green, total)}% got it</span>
                <span class="text-[11px] text-muted flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-yellow inline-block"></span>{pct(row.yellow, total)}% getting there</span>
                <span class="text-[11px] text-muted flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red inline-block"></span>{pct(row.red, total)}% not yet</span>
              </div>
            </div>
          {/each}

          <!-- Y-goal detail -->
          <div class="bg-surface border-2 border-border rounded-xl p-3.5 mt-2">
            <div class="font-mono text-[10px] font-medium tracking-[0.08em] uppercase text-muted mb-2">Unit goal confidence</div>
            <div class="flex gap-1 h-7 rounded overflow-hidden">
              {#if results.yGoalAggregate.green  > 0}<div class="bg-green  flex items-center justify-center text-white font-mono text-[11px] font-semibold" style="flex:{results.yGoalAggregate.green}">{results.yGoalAggregate.green}</div>{/if}
              {#if results.yGoalAggregate.yellow > 0}<div class="bg-yellow flex items-center justify-center text-white font-mono text-[11px] font-semibold" style="flex:{results.yGoalAggregate.yellow}">{results.yGoalAggregate.yellow}</div>{/if}
              {#if results.yGoalAggregate.red    > 0}<div class="bg-red    flex items-center justify-center text-white font-mono text-[11px] font-semibold" style="flex:{results.yGoalAggregate.red}">{results.yGoalAggregate.red}</div>{/if}
            </div>
            <div class="flex gap-4 mt-1.5">
              <span class="text-[11px] text-muted flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green inline-block"></span>{pct(results.yGoalAggregate.green, results.yGoalAggregate.green + results.yGoalAggregate.yellow + results.yGoalAggregate.red || 1)}% got it</span>
              <span class="text-[11px] text-muted flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-yellow inline-block"></span>{pct(results.yGoalAggregate.yellow, results.yGoalAggregate.green + results.yGoalAggregate.yellow + results.yGoalAggregate.red || 1)}% getting there</span>
              <span class="text-[11px] text-muted flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red inline-block"></span>{pct(results.yGoalAggregate.red, results.yGoalAggregate.green + results.yGoalAggregate.yellow + results.yGoalAggregate.red || 1)}% not yet</span>
            </div>
          </div>
        </div>
      {/if}

    </div>
  {/if}

</div>