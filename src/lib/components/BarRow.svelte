<script lang="ts">
  import type { Bar } from '$lib/aggregate'

  // One labelled distribution. Used at two sizes: compact inside the slide
  // embed, comfortable in the dashboard. `dense` is the only difference —
  // everything else is shared so the two can't drift apart.
  let {
    label,
    bars,
    responses,
    dense = false,
  }: {
    label: string
    bars: Bar[]
    responses: number
    dense?: boolean
  } = $props()

  // Traffic-light values keep their meaning; option labels don't have one, so
  // the correct bar is the only one that gets colour.
  function fill(bar: Bar): string {
    if (bar.value === 'green') return 'bg-green'
    if (bar.value === 'yellow') return 'bg-yellow'
    if (bar.value === 'red') return 'bg-red'
    return bar.correct ? 'bg-green' : 'bg-interactive'
  }
</script>

<div class={dense ? 'mb-1.5' : 'mb-3'}>
  {#if label}
    <div
      class="text-muted truncate {dense ? 'text-[0.7em] mb-0.5' : 'text-xs mb-1'}"
      title={label}
    >
      {label}
    </div>
  {/if}

  <div class="space-y-1">
    {#each bars as bar}
      <div class="flex items-center gap-2">
        <span
          class="shrink-0 text-right text-muted tabular-nums {dense ? 'text-[0.62em] w-[4.5em]' : 'text-[11px] w-24'} truncate"
          title={bar.label}
        >
          {bar.label}
        </span>

        <!-- The track is always drawn, so an unanswered question shows the shape
             it will fill rather than an empty space. -->
        <div class="flex-1 rounded-sm bg-border/60 overflow-hidden {dense ? 'h-[0.72em]' : 'h-4'}">
          <div
            class="h-full rounded-sm transition-[width] duration-500 {fill(bar)}"
            style="width: {bar.pct}%"
          ></div>
        </div>

        <span
          class="shrink-0 text-right tabular-nums {dense ? 'text-[0.62em] w-[2.4em]' : 'text-[11px] w-9'}
            {bar.correct ? 'text-green font-semibold' : 'text-muted'}"
        >
          {responses === 0 ? '' : `${bar.pct}%`}
        </span>
      </div>
    {/each}
  </div>
</div>
