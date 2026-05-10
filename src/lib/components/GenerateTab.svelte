<script lang="ts">
  import { db } from '$lib/supabase'
  import { loadNodeFile, groupCriteria } from '$lib/data'
  import { generateSessionCode } from '$lib/session'
  import { SUBJECTS, codeFromNodeFile, nodeFilesForYear } from '$lib/config/subjects'

  // Props
  let { userId }: { userId: string } = $props()

  // Step 1 — Subject
  let selectedSubjectId = $state('')
  const selectedSubject = $derived(SUBJECTS.find(s => s.id === selectedSubjectId) ?? null)

  // Step 2 — Year
  let selectedYear = $state('')
  const yearNodeFiles = $derived(
    selectedSubject && selectedYear
      ? nodeFilesForYear(selectedSubject, selectedYear)
      : []
  )

  // Step 3 — Standard (titles loaded when year selected)
  let standards: { code: string; title: string }[] = $state([])
  let loadingStandards = $state(false)
  let standardsError = $state('')
  let selectedCode = $state('')

  // Step 4 — Waypoint
  let selectedNodeId = $state('')
  let progressionEndpoint = $state('')
  let nodes: { id: number; label: string; hinge: boolean }[] = $state([])
  let criteriaPreview: string[] = $state([])
  let loadingNodes = $state(false)

  // Session generation
  let generating = $state(false)
  let genError = $state('')
  let generatedCode = $state('')
  let copiedUrl = $state(false)
  let copiedCode = $state(false)

  const studentBaseUrl = $derived(
    typeof window !== 'undefined'
      ? `${window.location.origin}/student/`
      : '/student/'
  )

  // Reset year + downstream when subject changes
  $effect(() => {
    selectedSubject // track
    selectedYear = ''
    selectedCode = ''
    selectedNodeId = ''
    standards = []
    progressionEndpoint = ''
    nodes = []
    criteriaPreview = []
    generatedCode = ''
    genError = ''
    standardsError = ''
  })

  // Load titles when year changes
  $effect(() => {
    const files = yearNodeFiles
    selectedCode = ''
    selectedNodeId = ''
    standards = []
    progressionEndpoint = ''
    nodes = []
    criteriaPreview = []
    generatedCode = ''
    genError = ''
    standardsError = ''

    if (!files.length) return

    loadingStandards = true
    Promise.all(
      files.map(async (path) => {
        const code = codeFromNodeFile(path)
        const res = await fetch(`/data/${path}`)
        if (!res.ok) return { code, title: code }
        const nf = await res.json()
        return { code, title: nf.standard?.title ?? code }
      })
    )
      .then((results) => { standards = results })
      .catch(() => { standardsError = 'Could not load standards.' })
      .finally(() => { loadingStandards = false })
  })

  // Load waypoints when standard selected
  async function selectStandard(code: string) {
    selectedCode = code
    selectedNodeId = ''
    progressionEndpoint = ''
    nodes = []
    criteriaPreview = []
    generatedCode = ''
    genError = ''

    if (!selectedSubject) return

    loadingNodes = true
    try {
      const nodeFile = await loadNodeFile(selectedSubject, code)
      progressionEndpoint = nodeFile.standard.progression_endpoint
      nodes = nodeFile.standard.nodes.map(n => ({
        id: n.id,
        label: n.label,
        hinge: n.hinge,
      }))
    } catch (e) {
      genError = 'Could not load standard data.'
      console.error(e)
    } finally {
      loadingNodes = false
    }
  }

  // Load criteria preview when waypoint selected
  async function selectNode(nodeId: string) {
    selectedNodeId = nodeId
    criteriaPreview = []
    generatedCode = ''
    genError = ''

    if (!selectedCode || !selectedSubject) return

    try {
      const nodeFile = await loadNodeFile(selectedSubject, selectedCode)
      const groups = groupCriteria(nodeFile, nodeId)
      criteriaPreview = groups.flatMap(g => g.criteria)
    } catch (e) {
      console.error(e)
    }
  }

  async function generate() {
    if (!selectedCode || !selectedNodeId || !selectedSubject) return
    generating = true
    genError = ''
    generatedCode = ''

    try {
      const nodeFile = await loadNodeFile(selectedSubject, selectedCode)
      const node = selectedNodeId === 'all'
        ? null
        : nodeFile.standard.nodes.find(n => n.id === parseInt(selectedNodeId))

      const nodeLabel = selectedNodeId === 'all' ? 'All waypoints' : (node?.label ?? '')
      const code = generateSessionCode()

      const { error } = await db.from('sessions').insert({
        session_code: code,
        standard: selectedCode,
        node_id: selectedNodeId,
        node_label: nodeLabel,
        y_goal: progressionEndpoint,
        label: `${selectedCode} · ${nodeLabel}`,
        user_id: userId,
      })

      if (error) throw error
      generatedCode = code

    } catch (e) {
      genError = 'Could not generate session — try again.'
      console.error(e)
    } finally {
      generating = false
    }
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(`${studentBaseUrl}${generatedCode}`)
    copiedUrl = true
    setTimeout(() => copiedUrl = false, 2000)
  }

  async function copyCode() {
    await navigator.clipboard.writeText(generatedCode)
    copiedCode = true
    setTimeout(() => copiedCode = false, 2000)
  }

  function yearLabel(year: string): string {
    return year === 'F' ? 'Foundation' : `Year ${year}`
  }
</script>

<div class="space-y-6">

  <!-- Step 1 — Subject -->
  <div>
    <span class="block text-sm font-medium mb-2">Subject</span>
    <div class="flex flex-wrap gap-2">
      {#each SUBJECTS as s}
        {@const selected = selectedSubjectId === s.id}
        <button
          onclick={() => { selectedSubjectId = s.id }}
          class="rounded-lg border px-4 py-2 text-sm transition-colors {selected
            ? 'border-interactive bg-interactive/5 font-medium text-interactive'
            : 'border-border bg-surface text-muted hover:border-muted'}"
        >
          {s.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- Step 2 — Year -->
  {#if selectedSubject}
    <div>
      <span class="block text-sm font-medium mb-2">Year level</span>
      <div class="flex flex-wrap gap-2">
        {#each selectedSubject.authoredYears as year}
          {@const selected = selectedYear === year}
          <button
            onclick={() => { selectedYear = year }}
            class="rounded-lg border px-3 py-1.5 text-sm transition-colors {selected
              ? 'border-interactive bg-interactive/5 font-medium text-interactive'
              : 'border-border bg-surface text-muted hover:border-muted'}"
          >
            {yearLabel(year)}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Step 3 — Standard -->
  {#if selectedYear}
    <div>
      <span class="block text-sm font-medium mb-2">Standard</span>
      {#if loadingStandards}
        <p class="text-sm text-muted">Loading standards…</p>
      {:else if standardsError}
        <p class="text-sm text-red">{standardsError}</p>
      {:else}
        <div class="space-y-1.5">
          {#each standards as s}
            {@const selected = selectedCode === s.code}
            <button
              onclick={() => selectStandard(s.code)}
              class="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors {selected
                ? 'border-interactive bg-interactive/5'
                : 'border-border bg-surface hover:border-muted'}"
            >
              <span
                class="flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs {selected
                  ? 'border-interactive bg-interactive text-white'
                  : 'border-border'}"
              >
                {#if selected}✓{/if}
              </span>
              <span>
                <span class="font-mono text-xs text-muted">{s.code}</span>
                <span class="ml-2">{s.title}</span>
              </span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Progression endpoint -->
  {#if progressionEndpoint}
    <div class="px-3 py-2.5 bg-bg border border-border rounded-lg text-sm text-muted leading-normal">
      <span class="font-mono text-[10px] font-medium tracking-[0.08em] uppercase block mb-1">Unit goal</span>
      {progressionEndpoint}
    </div>
  {/if}

  <!-- Step 4 — Waypoint -->
  {#if selectedCode}
    <div>
      <span class="block text-sm font-medium mb-2">Waypoint</span>
      {#if loadingNodes}
        <p class="text-sm text-muted">Loading waypoints…</p>
      {:else}
        <div class="space-y-1.5">
          {#each nodes as node}
            {@const selected = selectedNodeId === String(node.id)}
            <button
              onclick={() => selectNode(String(node.id))}
              class="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors {selected
                ? 'border-interactive bg-interactive/5'
                : 'border-border bg-surface hover:border-muted'}"
            >
              <span
                class="flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs {selected
                  ? 'border-interactive bg-interactive text-white'
                  : 'border-border'}"
              >
                {#if selected}✓{/if}
              </span>
              <span>
                <span class="font-mono text-xs text-muted">{node.id}.</span>
                <span class="ml-1">{node.label}</span>
                {#if node.hinge}
                  <span class="ml-1.5 text-xs text-yellow">⚑ hinge</span>
                {/if}
              </span>
            </button>
          {/each}
          {#if nodes.length > 0}
            {@const selected = selectedNodeId === 'all'}
            <button
              onclick={() => selectNode('all')}
              class="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors {selected
                ? 'border-interactive bg-interactive/5'
                : 'border-border bg-surface hover:border-muted'}"
            >
              <span
                class="flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs {selected
                  ? 'border-interactive bg-interactive text-white'
                  : 'border-border'}"
              >
                {#if selected}✓{/if}
              </span>
              <span class="text-muted">All waypoints</span>
            </button>
          {/if}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Criteria preview -->
  {#if criteriaPreview.length > 0}
    <div>
      <span class="block text-sm font-medium mb-2">Success criteria</span>
      <div class="space-y-1.5">
        {#each criteriaPreview as criterion}
          <div class="px-3 py-2 bg-[#eef1ff] border border-interactive rounded-lg text-sm text-bg-dark leading-normal">
            {criterion}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Generate button -->
  {#if selectedNodeId}
    <button
      onclick={generate}
      disabled={generating}
      class="w-full py-3.5 bg-bg-dark text-white text-[15px] font-semibold rounded-xl cursor-pointer hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
    >
      {generating ? 'Generating…' : 'Generate session code'}
    </button>
  {/if}

  {#if genError}
    <p class="text-sm text-red text-center">{genError}</p>
  {/if}

  <!-- Generated code result -->
  {#if generatedCode}
    <div>
      <div class="bg-[#eef1ff] border border-interactive rounded-xl p-5 text-center mb-3">
        <div class="font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-interactive mb-2">
          Session code — share with students
        </div>
        <div class="font-mono text-[32px] font-medium text-interactive tracking-[0.15em]">
          {generatedCode}
        </div>
      </div>

      <div class="font-mono text-[11px] font-medium tracking-[0.05em] uppercase text-muted mb-1.5">
        Student link
      </div>
      <div class="px-3 py-2.5 bg-bg border border-border rounded-lg font-mono text-[11px] text-muted break-all leading-normal mb-3">
        {studentBaseUrl}{generatedCode}
      </div>

      <div class="flex gap-2">
        <button
          onclick={copyUrl}
          class="flex-1 py-2.5 bg-bg-dark text-white text-[13px] font-semibold rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
        >
          {copiedUrl ? 'Copied!' : 'Copy link'}
        </button>
        <button
          onclick={copyCode}
          class="flex-1 py-2.5 bg-border text-bg-dark text-[13px] font-semibold rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
        >
          {copiedCode ? 'Copied!' : 'Copy code only'}
        </button>
      </div>
    </div>
  {/if}

</div>