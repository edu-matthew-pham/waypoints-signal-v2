<script lang="ts">
  import type { Bar } from '$lib/aggregate'

  // One labelled distribution, in two shapes.
  //
  // `tracks` — one bar per value, each with its own track. Correct for multiple
  // choice, where every option is a distinct answer and one of them may be
  // highlighted as correct.
  //
  // `stacked` — one bar, segmented by proportion. Correct for a traffic light,
  // which is a single scale rather than three competing choices. Five criteria
  // as tracks is twenty rows and does not fit a slide; as stacked bars it is
  // five. This is the shape ResultsTab's compact summary already uses.
  //
  // Used at two sizes: `dense` inside the slide embed, comfortable in the
  // dashboard. Everything else is shared so the two cannot drift apart.
  let {
    label,
    bars,
    responses,
    shape = 'tracks',
    dense = false,
  }: {
    label: string
    bars: Bar[]
    responses: number
    shape?: 'tracks' | 'stacked'
    dense?: boolean
  } = $props()

  // Traffic-light values keep their meaning; option labels have none, so the
  // correct bar is the only one that earns colour.
  function fill(bar: Bar): string {
    if (bar.value === 'green') return 'bg-green'
    if (bar.value === 'yellow') return 'bg-yellow'
    if (bar.value === 'red') return 'bg-red'
    return bar.correct ? 'bg-green' : 'bg-interactive'
  }

  const filled = $derived(bars.filter((b) => b.count > 0))
</script>

<div class={dense ? 'mb-1.5' : 'mb-3'}>

  {#if shape === 'stacked'}
    <!-- Label and bar on one line: the row count is the constraint here, so the
         label cannot afford its own line. -->
    <div class="flex items-center gap-2">
      <!-- Proportional, not a fixed em box. Criterion text is usually a full
           sentence, so a fixed label column truncates it hard while the bar
           keeps width it does not need. min-w-0 is what lets a flex child
           actually shrink — without it the text forces the row wider. -->
      <span
        class="min-w-0 basis-[45%] truncate {dense ? 'text-[0.78em]' : 'text-[13px]'} text-bg-dark"
        title={label}
      >
        {label}
      </span>

      <div class="flex min-w-0 flex-1 overflow-hidden rounded-sm bg-border/60 {dense ? 'h-[0.85em]' : 'h-5'}">
        {#each filled as bar}
          <div
            class="transition-[flex-grow] duration-500 {fill(bar)}"
            style="flex: {bar.count} 1 0%"
            title="{bar.label}: {bar.count}"
          ></div>
        {/each}
      </div>

      <!-- The row's own response count, NOT a percentage.
           A stacked bar is a distribution and has no single number, so this slot
           used to render bars[0].pct — the green share — while the bar showed
           everything. Two students both answering "getting there" gave a full
           yellow bar labelled 0%, which reads as no responses at all.
           The bar already carries the green share, proportionally and in colour.
           The denominator is the one fact it cannot carry, and the base
           migration is explicit that the count is not decoration: it is what
           stops a distribution being read as the class verdict.
           `n=` because MC rows render a percentage in this same position, and a
           bare number would be read as one. Zero shows rather than blanking, for
           the same reason the track is always drawn. -->
      <span class="shrink-0 text-right tabular-nums text-muted {dense ? 'text-[0.66em] w-[2.6em]' : 'text-[11px] w-9'}">
        {`n=${responses}`}
      </span>
    </div>

  {:else}
    {#if label}
      <div
        class="truncate text-muted {dense ? 'text-[0.7em] mb-0.5' : 'text-xs mb-1'}"
        title={label}
      >
        {label}
      </div>
    {/if}

    <div class="space-y-1">
      {#each bars as bar}
        <div class="flex items-center gap-2">
          <span
            class="min-w-0 basis-[35%] truncate text-right {dense ? 'text-[0.78em]' : 'text-[13px]'} text-bg-dark"
            title={bar.label}
          >
            {bar.label}
          </span>

          <!-- The track is always drawn, so an unanswered question shows the
               shape it will fill rather than an empty space. -->
          <div class="min-w-0 flex-1 overflow-hidden rounded-sm bg-border/60 {dense ? 'h-[0.72em]' : 'h-4'}">
            <div
              class="h-full rounded-sm transition-[width] duration-500 {fill(bar)}"
              style="width: {bar.pct}%"
            ></div>
          </div>

          <span
            class="shrink-0 text-right tabular-nums {dense ? 'text-[0.66em] w-[2.6em]' : 'text-[11px] w-9'}
              {bar.correct ? 'text-green font-semibold' : 'text-muted'}"
          >
            {responses === 0 ? '' : `${bar.pct}%`}
          </span>
        </div>
      {/each}
    </div>
  {/if}

</div>