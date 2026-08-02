<script lang="ts">
  import { page } from '$app/stores'
  import { onMount, onDestroy } from 'svelte'
  import {
    loadAggregate,
    mcBars,
    confidenceBars,
    rowsForQuestion,
    questionResponses,
    type AggregateRow,
  } from '$lib/aggregate'
  import { loadQuestionSet, type StudentQuestion } from '$lib/questionSession'
  import BarRow from '$lib/components/BarRow.svelte'

  // Contract with Prepare:
  //   /embed/XXXX-0000?q=0&k=B
  //   q — question index, always present
  //   k — correct option label. ABSENT means "don't highlight", and the route
  //       does not ask why. Prepare withholds it for four different reasons
  //       (text, confidence, unresolved answer, drifted deck) and they are all
  //       the same to the display.
  //
  // `correct` is NEVER read from the database. get_session_questions projects it
  // out, and the highlight comes from the URL alone. Fetching it here would
  // reopen the leak the two-projection design closes.

  const POLL_MS = 2000

  let code = $state('')
  let questionIdx = $state(0)
  let correctLabel: string | undefined = $state(undefined)

  let question: StudentQuestion | null = $state(null)
  let rows: AggregateRow[] = $state([])
  let failed = $state(false)
  let ready = $state(false)

  let timer: ReturnType<typeof setInterval> | undefined

  const responses = $derived(questionResponses(rows))

  onMount(async () => {
    code = $page.params.code ?? ''
    const params = new URLSearchParams(window.location.search)
    questionIdx = Number(params.get('q') ?? 0)
    correctLabel = params.get('k') ?? undefined

    try {
      const set = await loadQuestionSet(code)
      question = set?.questions.find((q) => q.idx === questionIdx) ?? null
    } catch (e) {
      console.error(e)
    }

    await refresh()
    ready = true

    // Prepare only sets the iframe's src when the slide is active, so this polls
    // for exactly as long as the question is on screen.
    timer = setInterval(refresh, POLL_MS)
  })

  onDestroy(() => {
    if (timer) clearInterval(timer)
  })

  async function refresh() {
    try {
      rows = rowsForQuestion(await loadAggregate(code, questionIdx), questionIdx)
      failed = false
    } catch (e) {
      failed = true
      console.error(e)
    }
  }
</script>

<svelte:head>
  <title>Live results</title>
</svelte:head>

<!-- Sized in em throughout so the whole thing scales with whatever font-size the
     frame inherits. Row height, not row count, is the lever when a confidence
     question has five criteria and the slide has no room. -->
<div class="min-h-screen bg-surface px-[0.9em] py-[0.7em] text-[clamp(12px,2.8vw,19px)] font-sans">

  {#if !ready}
    <div class="text-muted text-[0.75em]">Waiting for responses…</div>

  {:else if !question}
    <div class="text-muted text-[0.75em]">
      No question {questionIdx + 1} in this session.
    </div>

  {:else}
    <div class="flex items-baseline justify-between mb-[0.5em]">
      {#if question.type === 'confidence'}
        <!-- No question-level count here. Each criterion carries its own
             denominator on its own row — get_session_aggregate returns
             responses per (question_idx, sub_idx), and they legitimately
             differ when a student has signalled two of three. A single figure
             above them is the max across criteria, so it disagrees with most
             of the rows it sits over. -->
        <span></span>
      {:else}
        <span class="font-mono text-[0.6em] font-medium tracking-[0.08em] uppercase text-muted">
          {responses} response{responses === 1 ? '' : 's'}
        </span>
      {/if}
      {#if failed}
        <span class="text-[0.6em] text-muted">reconnecting…</span>
      {/if}
    </div>

    {#if question.type === 'mc'}
      {@const row = rows[0] ?? { questionIdx, subIdx: 0, type: 'mc' as const, responses: 0, counts: {} }}
      <BarRow
        label=""
        bars={mcBars(row, question.options ?? [], correctLabel)}
        {responses}
        dense
      />

    {:else if question.type === 'confidence'}
      <!-- One stacked bar per criterion, not three tracks. A traffic light is a
           single scale, not three competing choices, and five criteria as tracks
           is twenty rows — which no slide fits.

           Labelled even though the fence lists the criteria directly above:
           {{signal:N}} can place this embed on a slide with no list, where bare
           bars would be meaningless. Prepare hides the fence's own list when an
           embed is present, so these labels carry the text. -->
      {#each question.criteria ?? [] as criterion, i}
        {@const row = rows.find((r) => r.subIdx === i)
          ?? { questionIdx, subIdx: i, type: 'confidence' as const, responses: 0, counts: {} }}
        <BarRow
          label={criterion}
          bars={confidenceBars(row)}
          responses={row.responses}
          shape="stacked"
          dense
        />
      {/each}

    {:else}
      <!-- Count only. Unfiltered student writing on a projector is an
           unmoderated open mic, and Signal has no moderation by design. The
           responses themselves are on the teacher's dashboard. -->
      <div class="flex flex-col items-center justify-center py-[1.2em]">
        <div class="text-[2em] font-semibold tabular-nums text-interactive leading-none">
          {responses}
        </div>
        <div class="text-[0.65em] text-muted mt-[0.4em]">
          response{responses === 1 ? '' : 's'} so far
        </div>
      </div>
    {/if}
  {/if}

</div>