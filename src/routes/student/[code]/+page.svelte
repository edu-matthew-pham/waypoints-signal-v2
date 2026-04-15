<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { db } from '$lib/supabase'
  import { loadNodeFile, groupCriteria, type CriteriaGroup } from '$lib/data'

  type Signal = 'green' | 'yellow' | 'red'

  const SIGNALS: { value: Signal; label: string }[] = [
    { value: 'green',  label: 'Got it' },
    { value: 'yellow', label: 'Getting there' },
    { value: 'red',    label: 'Not yet' },
  ]

  // State
  let sessionCode = $derived($page.params.code ?? '')
  let loading = $state(true)
  let error = $state('')
  let submitted = $state(false)
  let submitting = $state(false)
  let submitError = $state('')

  // Session data
  let nodeLabel = $state('')
  let standard = $state('')
  let progressionEndpoint = $state('')
  let nodeId = $state('')
  let criteriaGroups = $state<CriteriaGroup[]>([])

  // Signals state — keyed by flat criterion index
  let criteriaSignals = $state<Record<number, Signal | null>>({})
  let yGoalSignal = $state<Signal | null>(null)

  // Flat criteria count for submit guard
  let totalCriteria = $derived(
    criteriaGroups.reduce((sum, g) => sum + g.criteria.length, 0)
  )

  let allSignalled = $derived(
    totalCriteria > 0 &&
    Object.values(criteriaSignals).filter(Boolean).length === totalCriteria &&
    yGoalSignal !== null
  )

  onMount(async () => {
    await loadSession()
  })

  async function loadSession() {
    loading = true
    error = ''

    try {
      const { data: session, error: sessionErr } = await db
        .from('sessions')
        .select('*')
        .eq('session_code', sessionCode)
        .single()

      if (sessionErr || !session) {
        error = 'Session code not found. Check the code and try again.'
        return
      }

      nodeLabel = session.node_label ?? ''
      standard = session.standard ?? ''
      progressionEndpoint = session.y_goal ?? ''
      nodeId = session.node_id ?? ''

      const nodeFile = await loadNodeFile(session.standard ?? '')
      criteriaGroups = groupCriteria(nodeFile, session.node_id ?? '')

      let idx = 0
      const signals: Record<number, Signal | null> = {}
      for (const group of criteriaGroups) {
        for (const _ of group.criteria) {
          signals[idx++] = null
        }
      }
      criteriaSignals = signals

    } catch (e) {
      error = 'Could not load session — check your connection.'
      console.error(e)
    } finally {
      loading = false
    }
  }

  function getOrCreateStudentId(): string {
    let id = sessionStorage.getItem('wp_student_id')
    if (!id) {
      id = 'anon_' + Math.random().toString(36).slice(2, 10)
      sessionStorage.setItem('wp_student_id', id)
    }
    return id
  }

  async function submit() {
    if (!allSignalled || submitting) return
    submitting = true
    submitError = ''

    const studentId = getOrCreateStudentId()

    try {
      const { data: sub, error: subErr } = await db
        .from('submissions')
        .insert({
          session_code: sessionCode,
          student_id: studentId,
          standard,
          node_id: nodeId,
          node_label: nodeLabel,
          y_goal_signal: yGoalSignal,
        })
        .select('id')
        .single()

      if (subErr) throw subErr

      const rows: { submission_id: number; criterion_idx: number; criterion_txt: string; signal: string }[] = []
      let idx = 0
      for (const group of criteriaGroups) {
        for (const text of group.criteria) {
          rows.push({
            submission_id: sub.id,
            criterion_idx: idx,
            criterion_txt: text,
            signal: criteriaSignals[idx] as string,
          })
          idx++
        }
      }

      const { error: sigErr } = await db.from('criterion_signals').insert(rows)
      if (sigErr) throw sigErr

      submitted = true

    } catch (e) {
      submitError = 'Could not submit — check your connection and try again.'
      console.error(e)
    } finally {
      submitting = false
    }
  }
</script>

<svelte:head>
  <title>Check in — Waypoints Signal</title>
</svelte:head>

<nav class="px-8 py-[14px] flex items-center justify-between border-b border-border">
  <span class="font-mono text-[12px] font-medium text-[#1a1917]">Waypoints Signal</span>
  <a href="/student" class="text-[12px] text-muted no-underline hover:text-[#1a1917]">← Back</a>
</nav>

<div class="max-w-[560px] mx-auto px-4 py-6">

  {#if loading}
    <div class="pt-10 text-center text-[14px] text-muted">
      Loading session…
    </div>

  {:else if error}
    <div class="pt-10 text-center">
      <p class="text-[14px] text-red mb-4">{error}</p>
      <a href="/student" class="text-[13px] text-muted underline">Try a different code</a>
    </div>

  {:else if submitted}
    <div class="pt-14 text-center">
      <div class="text-[48px] mb-4">✓</div>
      <h2 class="text-[20px] font-semibold mb-2">Submitted</h2>
      <p class="text-[14px] text-muted leading-[1.6]">
        Thanks. Your teacher can now see the class results.
      </p>
    </div>

  {:else}
    <!-- Header -->
    <div class="mb-7">
      <div class="font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-muted mb-1.5">
        Waypoint check-in
      </div>
      <h1 class="text-[20px] font-semibold leading-[1.3] mb-1">{nodeLabel}</h1>
      <div class="font-mono text-[12px] text-muted">{standard}</div>
    </div>

    <!-- Criteria -->
    <div class="font-mono text-[10px] font-medium tracking-[0.1em] uppercase text-muted mb-2.5">
      Success criteria — how confident are you?
    </div>

    {#each criteriaGroups as group, gi}
      {#if criteriaGroups.length > 1}
        <div class="{gi > 0 ? 'mt-5' : ''} mb-2">
          <div class="font-mono text-[10px] font-semibold tracking-[0.06em] uppercase text-muted pb-1 border-b border-border mb-1.5">
            Waypoint {group.nodeId} — {group.nodeLabel}{group.hinge ? ' ⚑' : ''}
          </div>
          {#if group.progressionCheckpoint}
            <div class="text-[12px] text-muted italic leading-[1.5]">
              {group.progressionCheckpoint}
            </div>
          {/if}
        </div>
      {/if}

      {#each group.criteria as criterion, ci}
        {@const idx = criteriaGroups.slice(0, gi).reduce((s, g) => s + g.criteria.length, 0) + ci}
        <div class="bg-surface border border-border rounded-xl p-4 mb-2.5">
          <p class="text-[14px] leading-[1.55] mb-3 m-0">{criterion}</p>
          <div class="flex gap-2">
            {#each SIGNALS as s}
              <button
                onclick={() => criteriaSignals[idx] = s.value}
                class="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg border-2 text-[13px] font-medium cursor-pointer transition-all duration-150
                  {criteriaSignals[idx] === s.value
                    ? s.value === 'green'  ? 'bg-[#edf7f2] border-green text-green'
                    : s.value === 'yellow' ? 'bg-[#fdf6e3] border-yellow text-yellow'
                    : 'bg-[#fdf0f0] border-red text-red'
                    : 'bg-bg border-border text-muted'
                  }"
              >
                <span class="w-2.5 h-2.5 rounded-full shrink-0
                  {s.value === 'green' ? 'bg-green' : s.value === 'yellow' ? 'bg-yellow' : 'bg-red'}
                "></span>
                {s.label}
              </button>
            {/each}
          </div>
        </div>
      {/each}
    {/each}

    <hr class="border-none border-t border-border my-5" />

    <!-- Progression endpoint -->
    <div class="bg-surface border border-border rounded-xl p-4 mb-6">
      <div class="font-mono text-[10px] font-medium tracking-[0.1em] uppercase text-muted mb-1.5">
        Big picture — by the end of this unit
      </div>
      <p class="text-[14px] leading-[1.55] font-medium mb-3 m-0">{progressionEndpoint}</p>
      <div class="flex gap-2">
        {#each SIGNALS as s}
          <button
            onclick={() => yGoalSignal = s.value}
            class="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg border-2 text-[13px] font-medium cursor-pointer transition-all duration-150
              {yGoalSignal === s.value
                ? s.value === 'green'  ? 'bg-[#edf7f2] border-green text-green'
                : s.value === 'yellow' ? 'bg-[#fdf6e3] border-yellow text-yellow'
                : 'bg-[#fdf0f0] border-red text-red'
                : 'bg-bg border-border text-muted'
              }"
          >
            <span class="w-2.5 h-2.5 rounded-full shrink-0
              {s.value === 'green' ? 'bg-green' : s.value === 'yellow' ? 'bg-yellow' : 'bg-red'}
            "></span>
            {s.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- Submit -->
    <button
      onclick={submit}
      disabled={!allSignalled || submitting}
      class="w-full py-4 bg-[#1a1917] text-white text-[15px] font-semibold rounded-xl cursor-pointer transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {submitting ? 'Submitting…' : 'Submit'}
    </button>

    {#if submitError}
      <p class="text-[13px] text-red text-center mt-2.5">{submitError}</p>
    {/if}

  {/if}

</div>