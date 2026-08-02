<script lang="ts">
  import { db } from '$lib/supabase'
  import {
    parsePayload,
    summarise,
    frontmatterBlock,
    type SessionPayload,
    type PayloadSummary,
  } from '$lib/sessionPayload'

  // Not read today — creation is scoped by auth.uid() inside the RPC, not by a
  // client-supplied id. Kept on the props so the tab matches its siblings and
  // so a future "my sessions" filter has it.
  let { userId }: { userId: string } = $props()

  // Paste + parse
  let raw = $state('')
  let payload: SessionPayload | null = $state(null)
  let summary: PayloadSummary | null = $state(null)
  let parseError = $state('')

  // Optional class label
  let classLabel = $state('')

  // Creation
  let creating = $state(false)
  let createError = $state('')
  let createdCode = $state('')
  let createdFingerprint = $state('')
  let createdControlToken = $state('')

  let copied = $state<'frontmatter' | 'link' | 'code' | null>(null)

  const studentBaseUrl = $derived(
    typeof window !== 'undefined' ? `${window.location.origin}/student/` : '/student/'
  )

  const frontmatter = $derived(
    createdCode ? frontmatterBlock(createdCode, createdFingerprint, createdControlToken) : ''
  )

  // Re-parse whenever the paste changes, so the preview and the button state
  // can never disagree with what is in the box.
  $effect(() => {
    const text = raw
    createdCode = ''
    createdFingerprint = ''
    createdControlToken = ''
    createError = ''

    if (!text.trim()) {
      payload = null
      summary = null
      parseError = ''
      return
    }

    const result = parsePayload(text)
    if (result.ok) {
      payload = result.payload
      summary = summarise(result.payload)
      parseError = ''
    } else {
      payload = null
      summary = null
      parseError = result.error
    }
  })

  async function create() {
    if (!payload || creating) return
    creating = true
    createError = ''

    try {
      const { data, error } = await db.rpc('create_question_session', {
        payload: payload as never,
        class_label: classLabel.trim() || undefined,
      })

      if (error) throw error

      // The function returns a table, so the client gets an array of one.
      const row = Array.isArray(data) ? data[0] : data
      if (!row?.code) throw new Error('No session code returned')

      createdCode = row.code
      createdFingerprint = row.fingerprint
      // Returned once, at creation, and never readable again by this path. A
      // teacher who loses it drives the session from the dashboard instead.
      createdControlToken = row.control_token
    } catch (e) {
      createError = 'Could not create the session — try again.'
      console.error(e)
    } finally {
      creating = false
    }
  }

  async function copy(what: 'frontmatter' | 'link' | 'code', value: string) {
    await navigator.clipboard.writeText(value)
    copied = what
    setTimeout(() => { copied = null }, 2000)
  }

  function clear() {
    raw = ''
    classLabel = ''
  }
</script>

<div class="space-y-6">

  <!-- Step 1 — paste -->
  <div>
    <span class="block text-sm font-medium mb-2">Question set</span>
    <p class="text-xs text-muted mb-2 leading-normal">
      In Prepare, choose <strong class="text-bg-dark">Export questions</strong> and paste the result here.
    </p>
    <textarea
      bind:value={raw}
      rows="6"
      placeholder={'{ "version": 1, "title": … }'}
      class="w-full font-mono text-xs leading-relaxed px-3 py-2.5 border border-border rounded-lg bg-surface outline-none focus:border-bg-dark transition-colors resize-y"
    ></textarea>

    {#if parseError}
      <p class="text-sm text-red mt-2">{parseError}</p>
    {/if}
  </div>

  <!-- Step 2 — what was read -->
  {#if summary}
    <div class="px-4 py-3.5 bg-bg border border-border rounded-lg">
      <div class="font-mono text-[10px] font-medium tracking-[0.08em] uppercase text-muted mb-1.5">
        Ready to create
      </div>
      <div class="text-sm font-medium mb-1">{summary.title}</div>
      <div class="text-xs text-muted leading-normal">
        {summary.total} question{summary.total === 1 ? '' : 's'}
        {#if summary.mc}<span> · {summary.mc} multiple choice</span>{/if}
        {#if summary.text}<span> · {summary.text} short response</span>{/if}
        {#if summary.confidence}<span> · {summary.confidence} confidence</span>{/if}
      </div>

      {#if summary.missingAnswers.length}
        <p class="text-xs text-yellow mt-2 leading-normal">
          No correct answer recorded for question{summary.missingAnswers.length === 1 ? '' : 's'}
          {summary.missingAnswers.map((i) => i + 1).join(', ')}.
          The session still works — those questions just won't highlight an answer on the slide.
        </p>
      {/if}
    </div>

    <!-- Step 3 — optional class -->
    <div>
      <span class="block text-sm font-medium mb-2">
        Class <span class="font-normal text-muted">— optional</span>
      </span>
      <input
        type="text"
        placeholder="7B"
        bind:value={classLabel}
        maxlength={40}
        class="text-sm px-3 py-2.5 border border-border rounded-lg bg-surface outline-none focus:border-bg-dark transition-colors w-40 font-sans"
      />
      <p class="text-xs text-muted mt-1.5 leading-normal">
        Shown in your sessions list, so you can tell them apart later.
      </p>
    </div>

    <!-- Step 4 — create -->
    {#if !createdCode}
      <button
        onclick={create}
        disabled={creating}
        class="w-full py-3.5 bg-bg-dark text-white text-[15px] font-semibold rounded-xl cursor-pointer hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        {creating ? 'Creating…' : 'Create session'}
      </button>
    {/if}

    {#if createError}
      <p class="text-sm text-red text-center">{createError}</p>
    {/if}
  {/if}

  <!-- Result -->
  {#if createdCode}
    <div>
      <div class="bg-[#eef1ff] border border-interactive rounded-xl p-5 text-center mb-3">
        <div class="font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-interactive mb-2">
          Session code — share with students
        </div>
        <div class="font-mono text-[32px] font-medium text-interactive tracking-[0.15em]">
          {createdCode}
        </div>
      </div>

      <!-- Frontmatter — the important one -->
      <div class="font-mono text-[11px] font-medium tracking-[0.05em] uppercase text-muted mb-1.5">
        Paste into your deck's frontmatter
      </div>
      <pre class="px-3 py-2.5 bg-bg border border-border rounded-lg font-mono text-[11px] text-bg-dark leading-relaxed mb-2 overflow-x-auto">{frontmatter}</pre>
      <p class="text-xs text-muted mb-3 leading-normal">
        All three lines. The second lets Prepare notice if the deck changes after
        this session was created. The third lets you control what students see
        while you present — Prepare strips it out of the student link.
      </p>

      <div class="font-mono text-[11px] font-medium tracking-[0.05em] uppercase text-muted mb-1.5">
        Student link
      </div>
      <div class="px-3 py-2.5 bg-bg border border-border rounded-lg font-mono text-[11px] text-muted break-all leading-normal mb-3">
        {studentBaseUrl}{createdCode}
      </div>

      <div class="flex gap-2">
        <button
          onclick={() => copy('frontmatter', frontmatter)}
          class="flex-1 py-2.5 bg-bg-dark text-white text-sm font-semibold rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
        >
          {copied === 'frontmatter' ? 'Copied!' : 'Copy frontmatter'}
        </button>
        <button
          onclick={() => copy('link', `${studentBaseUrl}${createdCode}`)}
          class="flex-1 py-2.5 bg-border text-bg-dark text-sm font-semibold rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
        >
          {copied === 'link' ? 'Copied!' : 'Copy link'}
        </button>
        <button
          onclick={() => copy('code', createdCode)}
          class="flex-1 py-2.5 bg-border text-bg-dark text-sm font-semibold rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
        >
          {copied === 'code' ? 'Copied!' : 'Copy code'}
        </button>
      </div>

      <button
        onclick={clear}
        class="mt-4 text-xs text-muted hover:text-bg-dark transition-colors cursor-pointer"
      >
        Create another session
      </button>
    </div>
  {/if}

</div>