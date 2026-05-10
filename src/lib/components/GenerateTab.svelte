<script lang="ts">
  import { db } from '$lib/supabase'
  import { loadNodeFile, loadProgressionMap, getStandardsForYear, groupCriteria, type AvailableStandard } from '$lib/data'
  import { generateSessionCode } from '$lib/session'
  import { SUBJECTS, type SubjectConfig } from '$lib/config/subjects'

  let { userId }: { userId: string } = $props()

  // Step 1 — Subject
  let selectedSubjectId = $state('')
  const selectedSubject = $derived(SUBJECTS.find(s => s.id === selectedSubjectId) ?? null)

  // Step 2 — Year
  let selectedYear = $state('')

  // Step 3 — Topic (History/Geography Y7-10 only)
  let selectedTopicKey = $state('')
  const availableTopics = $derived.by(() => {
    if (!selectedSubject?.topics || !selectedYear) return []
    return selectedSubject.topics[selectedYear] ?? []
  })
  const needsTopic = $derived(availableTopics.length > 0)

  // Step 3 — Standard (from progression map)
  let standards: AvailableStandard[] = $state([])
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
    typeof window !== 'undefined' ? `${window.location.origin}/student/` : '/student/'
  )

  // Reset year + downstream when subject changes
  $effect(() => {
    selectedSubject
    selectedYear = ''
    selectedTopicKey = ''
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

  $effect(() => {
    const s = selectedSubject
    const y = selectedYear
    selectedTopicKey = ''
    selectedCode = ''
    selectedNodeId = ''
    standards = []
    progressionEndpoint = ''
    nodes = []
    criteriaPreview = []
    generatedCode = ''
    genError = ''
    standardsError = ''

    if (!s || !y) return
    // If this subject/year needs a topic, wait for topic selection
    if (s.topics?.[y]?.length) return

    loadingStandards = true
    loadProgressionMap(s)
      .then((map) => { standards = getStandardsForYear(map, s, y) })
      .catch(() => { standardsError = 'Could not load standards.' })
      .finally(() => { loadingStandards = false })
  })

  // Load standards when topic selected
  $effect(() => {
    const s = selectedSubject
    const y = selectedYear
    const t = selectedTopicKey
    selectedCode = ''
    selectedNodeId = ''
    standards = []
    progressionEndpoint = ''
    nodes = []
    criteriaPreview = []
    generatedCode = ''
    genError = ''
    standardsError = ''

    if (!s || !y || !t) return

    loadingStandards = true
    loadProgressionMap(s)
      .then((map) => { standards = getStandardsForYear(map, s, y, t) })
      .catch(() => { standardsError = 'Could not load standards.' })
      .finally(() => { loadingStandards = false })
  })

  // Group standards by strand
  const standardsByStrand = $derived.by(() => {
    const groups = new Map<string, AvailableStandard[]>()
    for (const std of standards) {
      const key = std.strand ?? 'other'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(std)
    }
    return groups
  })

  const strandLabel = (key: string) => ({
    biological: 'Biological Sciences',
    earth_space: 'Earth and Space Sciences',
    chemical: 'Chemical Sciences',
    physical: 'Physical Sciences',
    number: 'Number',
    algebra: 'Algebra',
    measurement: 'Measurement',
    space: 'Space',
    statistics: 'Statistics',
    probability: 'Probability',
    language: 'Language',
    literature: 'Literature',
    literacy: 'Literacy',
    history: 'History',
    geography: 'Geography',
    civics: 'Civics & Citizenship',
    economics: 'Economics & Business',
    design: 'Design Technologies',
    digital: 'Digital Technologies',
    understanding: 'Understanding',
    inquiry: 'Science Inquiry Skills',
    other: 'Other',
  }[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))

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
      nodes = nodeFile.standard.nodes.map(n => ({ id: n.id, label: n.label, hinge: n.hinge }))
    } catch (e) {
      genError = 'Could not load standard data.'
      console.error(e)
    } finally {
      loadingNodes = false
    }
  }

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

  <!-- Step 3 — Topic (History/Geography Y7-10 only) -->
  {#if selectedYear && needsTopic}
    <div>
      <span class="block text-sm font-medium mb-2">Topic</span>
      <div class="flex flex-wrap gap-2">
        {#each availableTopics as topic}
          {@const selected = selectedTopicKey === topic.key}
          <button
            onclick={() => { selectedTopicKey = topic.key }}
            class="rounded-lg border px-3 py-1.5 text-sm transition-colors {selected
              ? 'border-interactive bg-interactive/5 font-medium text-interactive'
              : 'border-border bg-surface text-muted hover:border-muted'}"
          >
            {topic.label}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Step 4 — Standard -->
  {#if selectedYear && (!needsTopic || selectedTopicKey)}
    <div>
      <span class="block text-sm font-medium mb-2">Standard</span>
      {#if loadingStandards}
        <p class="text-sm text-muted">Loading standards…</p>
      {:else if standardsError}
        <p class="text-sm text-red">{standardsError}</p>
      {:else if standards.length === 0}
        <p class="text-sm text-muted">No authored standards for this year.</p>
      {:else}
        <div class="space-y-4">
          {#each [...standardsByStrand.entries()] as [strand, strandStandards]}
            <div>
              {#if standardsByStrand.size > 1}
                <p class="text-xs font-medium text-muted uppercase tracking-wide mb-1.5">{strandLabel(strand)}</p>
              {/if}
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                {#each strandStandards as s}
                  {@const selected = selectedCode === s.code}
                  <button
                    onclick={() => selectStandard(s.code)}
                    class="flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors {selected
                      ? 'border-interactive bg-interactive/5'
                      : 'border-border bg-surface hover:border-muted'}"
                  >
                    <span
                      class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-xs {selected
                        ? 'border-interactive bg-interactive text-white'
                        : 'border-border'}"
                    >
                      {#if selected}✓{/if}
                    </span>
                    <span>
                      <span class="font-mono text-xs text-muted block">{s.code}</span>
                      <span class="text-sm leading-snug">{s.title}</span>
                    </span>
                  </button>
                {/each}
              </div>
            </div>
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
          class="flex-1 py-2.5 bg-bg-dark text-white text-sm font-semibold rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
        >
          {copiedUrl ? 'Copied!' : 'Copy link'}
        </button>
        <button
          onclick={copyCode}
          class="flex-1 py-2.5 bg-border text-bg-dark text-sm font-semibold rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
        >
          {copiedCode ? 'Copied!' : 'Copy code only'}
        </button>
      </div>
    </div>
  {/if}

</div>