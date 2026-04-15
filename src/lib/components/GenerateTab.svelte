<script lang="ts">
  import { db } from '$lib/supabase'
  import { loadNodeFile, groupCriteria } from '$lib/data'
  import { generateSessionCode } from '$lib/session'

  // Props
  let { userId }: { userId: string } = $props()

  // Standards list — hardcoded for Y7 Science PoC
  const STANDARDS = [
    { code: 'AC9S7U01', title: 'Classification and Biodiversity' },
    { code: 'AC9S7U02', title: 'Food Webs and Ecosystems' },
    { code: 'AC9S7U03', title: 'Earth-Sun-Moon System' },
    { code: 'AC9S7U04', title: 'Forces and Motion' },
    { code: 'AC9S7U05', title: 'Particle Theory and Properties' },
    { code: 'AC9S7U06', title: 'Pure Substances and Mixtures' },
  ]

  // State
  let selectedCode = $state('')
  let selectedNodeId = $state('')
  let progressionEndpoint = $state('')
  let nodes: { id: number; label: string; hinge: boolean }[] = $state([])
  let criteriaPreview: string[] = $state([])
  let loadingNodes = $state(false)
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

  // Load node file when standard changes
  async function onStandardChange() {
    selectedNodeId = ''
    progressionEndpoint = ''
    nodes = []
    criteriaPreview = []
    generatedCode = ''
    genError = ''

    if (!selectedCode) return

    loadingNodes = true
    try {
      const nodeFile = await loadNodeFile(selectedCode)
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

  // Update criteria preview when node changes
  async function onNodeChange() {
    criteriaPreview = []
    generatedCode = ''
    genError = ''

    if (!selectedCode || !selectedNodeId) return

    try {
      const nodeFile = await loadNodeFile(selectedCode)
      const groups = groupCriteria(nodeFile, selectedNodeId)
      criteriaPreview = groups.flatMap(g => g.criteria)
    } catch (e) {
      console.error(e)
    }
  }

  async function generate() {
    if (!selectedCode || !selectedNodeId) return
    generating = true
    genError = ''
    generatedCode = ''

    try {
      const nodeFile = await loadNodeFile(selectedCode)
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
</script>

<div class="space-y-4">

  <!-- Standard select -->
  <div>
    <label for="sel-standard" class="block font-mono text-[11px] font-medium tracking-[0.05em] uppercase text-muted mb-1.5">
      Standard
    </label>
    <select
      bind:value={selectedCode}
      onchange={onStandardChange}
      class="w-full px-3 py-2.5 border border-border rounded-lg bg-surface text-[14px] text-[#1a1917] outline-none focus:border-[#1a1917] transition-colors appearance-none cursor-pointer"
    >
      <option value="">— select —</option>
      {#each STANDARDS as s}
        <option value={s.code}>{s.code} — {s.title}</option>
      {/each}
    </select>
  </div>

  <!-- Progression endpoint -->
  {#if progressionEndpoint}
    <div class="px-3 py-2.5 bg-bg border border-border rounded-lg text-[13px] text-muted leading-[1.55]">
      <span class="font-mono text-[10px] font-medium tracking-[0.08em] uppercase block mb-1">Unit goal</span>
      {progressionEndpoint}
    </div>
  {/if}

  <!-- Node select -->
  <div>
    <label for="sel-standard" class="block font-mono text-[11px] font-medium tracking-[0.05em] uppercase text-muted mb-1.5">
      Waypoint
    </label>
    <select
      bind:value={selectedNodeId}
      onchange={onNodeChange}
      disabled={!selectedCode || loadingNodes}
      class="w-full px-3 py-2.5 border border-border rounded-lg bg-surface text-[14px] text-[#1a1917] outline-none focus:border-[#1a1917] transition-colors appearance-none cursor-pointer disabled:opacity-50"
    >
      <option value="">
        {loadingNodes ? 'Loading…' : '— select waypoint —'}
      </option>
      {#each nodes as node}
        <option value={String(node.id)}>
          {node.id}. {node.label}{node.hinge ? ' ⚑' : ''}
        </option>
      {/each}
      {#if nodes.length > 0}
        <option value="all">— All waypoints —</option>
      {/if}
    </select>
  </div>

  <!-- Criteria preview -->
  {#if criteriaPreview.length > 0}
    <div>
      <div class="font-mono text-[11px] font-medium tracking-[0.05em] uppercase text-muted mb-2">
        Success criteria
      </div>
      <div class="space-y-1.5">
        {#each criteriaPreview as criterion}
          <div class="px-3 py-2 bg-[#eef1ff] border border-interactive rounded-lg text-[13px] text-[#1a1917] leading-[1.5]">
            {criterion}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Generate button -->
  <button
    onclick={generate}
    disabled={!selectedCode || !selectedNodeId || generating}
    class="w-full py-3.5 bg-[#1a1917] text-white text-[15px] font-semibold rounded-xl cursor-pointer hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity mt-2"
  >
    {generating ? 'Generating…' : 'Generate session code'}
  </button>

  {#if genError}
    <p class="text-[13px] text-red text-center">{genError}</p>
  {/if}

  <!-- Generated code result -->
  {#if generatedCode}
    <div class="mt-2">
      <!-- Code display -->
      <div class="bg-[#eef1ff] border border-interactive rounded-xl p-5 text-center mb-3">
        <div class="font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-interactive mb-2">
          Session code — share with students
        </div>
        <div class="font-mono text-[32px] font-medium text-interactive tracking-[0.15em]">
          {generatedCode}
        </div>
      </div>

      <!-- Student URL -->
      <div class="font-mono text-[11px] font-medium tracking-[0.05em] uppercase text-muted mb-1.5">
        Student link
      </div>
      <div class="px-3 py-2.5 bg-bg border border-border rounded-lg font-mono text-[11px] text-muted break-all leading-[1.5] mb-3">
        {studentBaseUrl}{generatedCode}
      </div>

      <!-- Copy buttons -->
      <div class="flex gap-2">
        <button
          onclick={copyUrl}
          class="flex-1 py-2.5 bg-[#1a1917] text-white text-[13px] font-semibold rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
        >
          {copiedUrl ? 'Copied!' : 'Copy link'}
        </button>
        <button
          onclick={copyCode}
          class="flex-1 py-2.5 bg-border text-[#1a1917] text-[13px] font-semibold rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
        >
          {copiedCode ? 'Copied!' : 'Copy code only'}
        </button>
      </div>
    </div>
  {/if}

</div>