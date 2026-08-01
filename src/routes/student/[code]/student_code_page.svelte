<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { db } from '$lib/supabase'
  import { loadNodeFileByCode, groupCriteria, type CriteriaGroup } from '$lib/data'
  import {
    loadQuestionSet,
    loadMyAnswers,
    toSlots,
    slotKey,
    getOrCreateStudentId,
    submitAnswer,
    SIGNALS,
    type AnswerSlot,
    type Signal,
  } from '$lib/questionSession'

  // Which kind of session this code belongs to. Codes look identical for both,
  // so the page asks for a question set first and falls back to the node-driven
  // check-in when there isn't one. An empty result is a routing answer, not a
  // failure.
  let mode: 'loading' | 'error' | 'checkin' | 'questions' = $state('loading')

  let sessionCode = $derived($page.params.code ?? '')
  let error = $state('')

  // ── question-set state ──────────────────────────────────────────────────────

  let slots: AnswerSlot[] = $state([])
  let sessionTitle = $state('')
  let answers = $state<Record<string, string>>({})
  let saveState = $state<Record<string, 'saving' | 'saved' | 'failed'>>({})
  let studentId = $state('')
  let finished = $state(false)

  const answeredCount = $derived(Object.keys(answers).filter((k) => answers[k]).length)
  const allAnswered = $derived(slots.length > 0 && answeredCount === slots.length)
  const anyFailed = $derived(Object.values(saveState).includes('failed'))

  // ── check-in state (unchanged) ──────────────────────────────────────────────

  let submitted = $state(false)
  let submitting = $state(false)
  let submitError = $state('')
  let nodeLabel = $state('')
  let standard = $state('')
  let progressionEndpoint = $state('')
  let nodeId = $state('')
  let criteriaGroups = $state<CriteriaGroup[]>([])
  let criteriaSignals = $state<Record<number, Signal | null>>({})
  let yGoalSignal = $state<Signal | null>(null)

  let totalCriteria = $derived(
    criteriaGroups.reduce((sum, g) => sum + g.criteria.length, 0)
  )

  let allSignalled = $derived(
    totalCriteria > 0 &&
    Object.values(criteriaSignals).filter(Boolean).length === totalCriteria &&
    yGoalSignal !== null
  )

  // ── load ────────────────────────────────────────────────────────────────────

  onMount(async () => {
    // Codes look identical for both session types, so ask for a question set
    // first and fall back to the node-driven check-in when there isn't one.
    //
    // Only "no rows" routes onward. A thrown error is a real failure and must
    // surface as itself — reporting it as "session code not found" sends the
    // student to re-check a code that was correct, and cost an afternoon of
    // diagnosis when the module simply hadn't loaded.
    let set
    try {
      set = await loadQuestionSet(sessionCode)
    } catch (e) {
      console.error('question set lookup failed', e)
      error = 'Could not load session — check your connection.'
      mode = 'error'
      return
    }

    if (set) {
      sessionTitle = set.title
      slots = toSlots(set.questions)
      studentId = getOrCreateStudentId()
      mode = 'questions'
      // Restore anything this student already answered. Not blocking: the form
      // is usable before this returns, and a failure here leaves it blank
      // rather than broken.
      answers = await loadMyAnswers(sessionCode, studentId)
      return
    }

    await loadCheckin()
  })

  async function loadCheckin() {
    try {
      const { data: session, error: sessionErr } = await db
        .from('sessions')
        .select('*')
        .eq('session_code', sessionCode)
        .single()

      if (sessionErr || !session) {
        error = 'Session code not found. Check the code and try again.'
        mode = 'error'
        return
      }

      nodeLabel = session.node_label ?? ''
      standard = session.standard ?? ''
      progressionEndpoint = session.y_goal ?? ''
      nodeId = session.node_id ?? ''

      const nodeFile = await loadNodeFileByCode(session.standard ?? '')
      criteriaGroups = groupCriteria(nodeFile, session.node_id ?? '')

      let idx = 0
      const signals: Record<number, Signal | null> = {}
      for (const group of criteriaGroups) {
        for (const _ of group.criteria) {
          signals[idx++] = null
        }
      }
      criteriaSignals = signals
      mode = 'checkin'

    } catch (e) {
      error = 'Could not load session — check your connection.'
      mode = 'error'
      console.error(e)
    }
  }

  // ── question-set answering ──────────────────────────────────────────────────

  // Each answer is written as it happens. There is no terminal submit: with one,
  // a student who stalls partway contributes nothing and the teacher watches an
  // empty board.
  async function answer(slot: AnswerSlot, value: string) {
    const key = slotKey(slot)
    if (!value) return

    answers[key] = value
    saveState[key] = 'saving'

    try {
      await submitAnswer(sessionCode, studentId, slot, value)
      saveState[key] = 'saved'
    } catch (e) {
      saveState[key] = 'failed'
      console.error(e)
    }
  }

  // Text answers save on blur rather than per keystroke — one write per thought,
  // not one per character.
  function answerText(slot: AnswerSlot, e: Event) {
    const value = (e.target as HTMLTextAreaElement).value.trim()
    if (!value) return
    answer(slot, value)
  }

  function retry(slot: AnswerSlot) {
    const key = slotKey(slot)
    const value = answers[key]
    if (value) answer(slot, value)
  }

  // ── check-in submit (unchanged) ─────────────────────────────────────────────

  function getOrCreateCheckinId(): string {
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

    const sid = getOrCreateCheckinId()

    try {
      const { data: sub, error: subErr } = await db
        .from('submissions')
        .insert({
          session_code: sessionCode,
          student_id: sid,
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

  function signalClasses(active: boolean, value: string): string {
    if (!active) return 'bg-bg border-border text-muted'
    if (value === 'green')  return 'bg-[#edf7f2] border-green text-green'
    if (value === 'yellow') return 'bg-[#fdf6e3] border-yellow text-yellow'
    return 'bg-[#fdf0f0] border-red text-red'
  }

  function dotClasses(value: string): string {
    if (value === 'green')  return 'bg-green'
    if (value === 'yellow') return 'bg-yellow'
    return 'bg-red'
  }
</script>

<svelte:head>
  <title>Check in — Waypoints Signal</title>
</svelte:head>

<nav class="px-8 py-3.5 flex items-center justify-between border-b border-border">
  <span class="font-mono text-[12px] font-medium text-bg-dark">Waypoints Signal</span>
  <a href="/student" class="text-[12px] text-muted no-underline hover:text-bg-dark">← Back</a>
</nav>

<div class="max-w-140 mx-auto px-4 py-6">

  {#if mode === 'loading'}
    <div class="pt-10 text-center text-[14px] text-muted">
      Loading session…
    </div>

  {:else if mode === 'error'}
    <div class="pt-10 text-center">
      <p class="text-[14px] text-red mb-4">{error}</p>
      <a href="/student" class="text-[13px] text-muted underline">Try a different code</a>
    </div>

  <!-- ── question set ──────────────────────────────────────────────────────── -->
  {:else if mode === 'questions'}

    {#if finished}
      <div class="pt-14 text-center">
        <div class="text-[48px] mb-4">✓</div>
        <h2 class="text-[20px] font-semibold mb-2">All done</h2>
        <p class="text-[14px] text-muted leading-[1.6] mb-4">
          Thanks. Your teacher can see the class results.
        </p>
        <button
          onclick={() => finished = false}
          class="text-[13px] text-muted underline cursor-pointer"
        >
          Go back and change an answer
        </button>
      </div>

    {:else}
      <div class="mb-6">
        <div class="font-mono text-[11px] font-medium tracking-widest uppercase text-muted mb-1.5">
          Your answers
        </div>
        <h1 class="text-[20px] font-semibold leading-[1.3]">{sessionTitle || 'Questions'}</h1>
        <p class="text-[12px] text-muted mt-1">
          {answeredCount} of {slots.length} answered — saved as you go.
        </p>
      </div>

      {#each slots as slot, i}
        {@const key = slotKey(slot)}
        {@const state = saveState[key]}

        {#if slot.first && slot.type === 'confidence'}
          <div class="{i > 0 ? 'mt-5' : ''} mb-2">
            <div class="font-mono text-[10px] font-semibold tracking-[0.06em] uppercase text-muted pb-1 border-b border-border">
              {slot.stem}
            </div>
          </div>
        {/if}

        <div class="bg-surface border border-border rounded-xl p-4 mb-2.5">

          {#if slot.type === 'confidence'}
            <p class="text-[14px] leading-[1.55] mb-3 m-0">{slot.criterion}</p>
            <div class="flex gap-2">
              {#each SIGNALS as s}
                <button
                  onclick={() => answer(slot, s.value)}
                  class="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg border-2 text-[13px] font-medium cursor-pointer transition-all duration-150
                    {signalClasses(answers[key] === s.value, s.value)}"
                >
                  <span class="w-2.5 h-2.5 rounded-full shrink-0 {dotClasses(s.value)}"></span>
                  {s.label}
                </button>
              {/each}
            </div>

          {:else}
            <p class="text-[15px] font-medium leading-[1.5] mb-3 m-0">
              <span class="font-mono text-[12px] text-muted mr-1.5">{slot.questionIdx + 1}.</span>{slot.stem}
            </p>

            {#if slot.type === 'mc'}
              <div class="space-y-2">
                {#each slot.options ?? [] as option}
                  {@const selected = answers[key] === option.label}
                  <button
                    onclick={() => answer(slot, option.label)}
                    class="flex w-full items-start gap-3 rounded-lg border-2 px-4 py-3 text-left text-[14px] leading-[1.45] transition-colors cursor-pointer {selected
                      ? 'border-interactive bg-interactive/5'
                      : 'border-border bg-bg hover:border-muted'}"
                  >
                    <span
                      class="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-semibold {selected
                        ? 'border-interactive bg-interactive text-white'
                        : 'border-border text-muted'}"
                    >
                      {option.label}
                    </span>
                    <span>{option.text}</span>
                  </button>
                {/each}
              </div>

            {:else}
              <textarea
                rows="3"
                placeholder="Type your answer…"
                value={answers[key] ?? ''}
                onblur={(e) => answerText(slot, e)}
                class="w-full text-[14px] leading-[1.5] px-3 py-2.5 border-2 border-border rounded-lg bg-bg outline-none focus:border-interactive transition-colors resize-y font-sans"
              ></textarea>
            {/if}
          {/if}

          {#if state === 'failed'}
            <p class="text-[12px] text-red mt-2">
              Didn't save.
              <button onclick={() => retry(slot)} class="underline cursor-pointer">Try again</button>
            </p>
          {:else if state === 'saving'}
            <p class="text-[11px] text-muted mt-2">Saving…</p>
          {/if}

        </div>
      {/each}

      {#if anyFailed}
        <p class="text-[13px] text-red text-center mb-3">
          Some answers didn't save. Check your connection and tap "Try again" above.
        </p>
      {/if}

      <button
        onclick={() => finished = true}
        disabled={answeredCount === 0}
        class="w-full py-4 mt-2 bg-bg-dark text-white text-[15px] font-semibold rounded-xl cursor-pointer transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {allAnswered ? 'Done' : `Done — ${slots.length - answeredCount} left unanswered`}
      </button>
    {/if}

  <!-- ── confidence check-in (unchanged) ───────────────────────────────────── -->
  {:else if submitted}
    <div class="pt-14 text-center">
      <div class="text-[48px] mb-4">✓</div>
      <h2 class="text-[20px] font-semibold mb-2">Submitted</h2>
      <p class="text-[14px] text-muted leading-[1.6]">
        Thanks. Your teacher can now see the class results.
      </p>
    </div>

  {:else}
    <div class="mb-7">
      <div class="font-mono text-[11px] font-medium tracking-widest uppercase text-muted mb-1.5">
        Waypoint check-in
      </div>
      <h1 class="text-[20px] font-semibold leading-[1.3] mb-1">{nodeLabel}</h1>
      <div class="font-mono text-[12px] text-muted">{standard}</div>
    </div>

    <div class="font-mono text-[10px] font-medium tracking-widest uppercase text-muted mb-2.5">
      Success criteria — how confident are you?
    </div>

    {#each criteriaGroups as group, gi}
      {#if criteriaGroups.length > 1}
        <div class="{gi > 0 ? 'mt-5' : ''} mb-2">
          <div class="font-mono text-[10px] font-semibold tracking-[0.06em] uppercase text-muted pb-1 border-b border-border mb-1.5">
            Waypoint {group.nodeId} — {group.nodeLabel}{group.hinge ? ' ⚑' : ''}
          </div>
          {#if group.progressionCheckpoint}
            <div class="text-[12px] text-muted italic leading-normal">
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
                  {signalClasses(criteriaSignals[idx] === s.value, s.value)}"
              >
                <span class="w-2.5 h-2.5 rounded-full shrink-0 {dotClasses(s.value)}"></span>
                {s.label}
              </button>
            {/each}
          </div>
        </div>
      {/each}
    {/each}

    <hr class="border-none border-t border-border my-5" />

    <div class="bg-surface border border-border rounded-xl p-4 mb-6">
      <div class="font-mono text-[10px] font-medium tracking-widest uppercase text-muted mb-1.5">
        Big picture — by the end of this unit
      </div>
      <p class="text-[14px] leading-[1.55] font-medium mb-3 m-0">{progressionEndpoint}</p>
      <div class="flex gap-2">
        {#each SIGNALS as s}
          <button
            onclick={() => yGoalSignal = s.value}
            class="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg border-2 text-[13px] font-medium cursor-pointer transition-all duration-150
              {signalClasses(yGoalSignal === s.value, s.value)}"
          >
            <span class="w-2.5 h-2.5 rounded-full shrink-0 {dotClasses(s.value)}"></span>
            {s.label}
          </button>
        {/each}
      </div>
    </div>

    <button
      onclick={submit}
      disabled={!allSignalled || submitting}
      class="w-full py-4 bg-bg-dark text-white text-[15px] font-semibold rounded-xl cursor-pointer transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {submitting ? 'Submitting…' : 'Submit'}
    </button>

    {#if submitError}
      <p class="text-[13px] text-red text-center mt-2.5">{submitError}</p>
    {/if}

  {/if}

</div>