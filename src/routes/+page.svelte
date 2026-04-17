<script lang="ts">
  // Landing page — Waypoints Signal
</script>

<svelte:head>
  <title>Waypoints Signal</title>
  <meta name="description" content="30-second classroom confidence check-in. No accounts, no setup." />
</svelte:head>

<!-- Nav -->
<nav class="px-8 py-5 flex items-center gap-2 border-b border-border text-[12px] text-muted">
  <a href="https://learningwaypoints.com" class="underline decoration-border underline-offset-[3px] transition-colors hover:text-[#1a1917] hover:decoration-muted">
    Learning Waypoints
  </a>
  <a href="/" class="font-mono text-[13px] font-medium tracking-[0.04em] text-[#1a1917] no-underline">
    Waypoints Signal
  </a>
</nav>

<!-- Hero -->
<section class="max-w-[640px] mx-auto px-8 pt-20 pb-16 text-center">
  <div class="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-[0.1em] uppercase text-muted border border-border rounded-full px-3 py-1 mb-7">
    <span class="w-1.5 h-1.5 rounded-full bg-green"></span>
    Beta · Free to use
  </div>

  <h1 class="text-[clamp(36px,6vw,56px)] font-semibold leading-[1.1] tracking-[-0.02em] mb-5">
    30-second<br />class check-in
  </h1>

  <p class="text-base leading-[1.7] text-muted mb-12">
    Students signal their confidence at each waypoint. You see where the class
    stands in real time — no accounts, no setup, just a tap.
  </p>

  <!-- CTA cards -->
  <div class="grid grid-cols-2 gap-3 max-w-[520px] mx-auto mb-16">
    <a href="/teacher" class="flex flex-col items-start gap-2.5 p-6 bg-surface border border-border rounded-xl no-underline text-inherit text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1a1917] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] group">
      <span class="text-[22px] leading-none">🎓</span>
      <span class="font-mono text-[10px] font-medium tracking-[0.08em] uppercase text-muted">For teachers</span>
      <span class="text-[15px] font-semibold leading-[1.3]">Set up a session</span>
      <p class="text-[12px] leading-[1.55] text-muted flex-1 m-0">Generate a session code, share the link with your class, and see live results.</p>
      <span class="text-[13px] text-muted mt-1 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-[#1a1917]">→</span>
    </a>
    <a href="/student" class="flex flex-col items-start gap-2.5 p-6 bg-surface border border-border rounded-xl no-underline text-inherit text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1a1917] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] group">
      <span class="text-[22px] leading-none">✏️</span>
      <span class="font-mono text-[10px] font-medium tracking-[0.08em] uppercase text-muted">For students</span>
      <span class="text-[15px] font-semibold leading-[1.3]">Enter session code</span>
      <p class="text-[12px] leading-[1.55] text-muted flex-1 m-0">Your teacher gives you a code. Open this page, tap your signals, done.</p>
      <span class="text-[13px] text-muted mt-1 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-[#1a1917]">→</span>
    </a>
  </div>
</section>

<!-- Demo -->
<section class="max-w-[480px] mx-auto px-8 mb-16">
  <div class="bg-surface border border-border rounded-xl p-5">
    <div class="font-mono text-[10px] font-medium tracking-[0.08em] uppercase text-muted mb-2.5">
      Example check-in
    </div>
    <div class="text-[13px] leading-[1.5] mb-3">
      Constructs a key that correctly classifies all organisms in a given set
    </div>
    <div class="flex gap-1.5">
      <div class="flex-1 px-1.5 py-2 rounded-lg border-2 border-green bg-[#edf7f2] text-[12px] font-medium text-center text-green">Got it</div>
      <div class="flex-1 px-1.5 py-2 rounded-lg border-2 border-border bg-bg text-[12px] font-medium text-center text-muted">Getting there</div>
      <div class="flex-1 px-1.5 py-2 rounded-lg border-2 border-border bg-bg text-[12px] font-medium text-center text-muted">Not yet</div>
    </div>
    <div class="font-mono text-[11px] text-muted text-center mt-2.5 tracking-[0.04em]">
      One tap per criterion · Under 30 seconds
    </div>
  </div>
</section>

<!-- How it works -->
<section class="max-w-[640px] mx-auto px-8 pb-20">
  <div class="font-mono text-[10px] font-medium tracking-[0.1em] uppercase text-muted text-center mb-7">
    How it works
  </div>
  <div class="flex flex-col relative">
    <div class="absolute left-[19px] top-6 bottom-6 w-px bg-border"></div>

    {#each [
      { n: '1', title: 'Teacher generates a session', desc: 'Select a standard and waypoint. Success criteria load automatically. You get a short code and shareable link.' },
      { n: '2', title: 'Students tap their signals', desc: 'Open the link or enter the code. Tap Got it, Getting there or Not yet for each criterion. No login needed.' },
      { n: '3', title: 'Teacher sees live results', desc: 'Compact bar chart per criterion, colour-coded by confidence. Export to CSV. Results persist across sessions for the whole unit.' },
    ] as step}
      <div class="flex gap-4 items-start py-4">
        <div class="w-[38px] h-[38px] rounded-full bg-surface border border-border flex items-center justify-center font-mono text-[12px] font-medium text-muted shrink-0 relative z-10">
          {step.n}
        </div>
        <div class="pt-2">
          <div class="text-[14px] font-semibold mb-0.5">{step.title}</div>
          <p class="text-[13px] leading-[1.55] text-muted m-0">{step.desc}</p>
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- Footer -->
<footer class="border-t border-border px-8 py-5 flex items-center justify-between">
  <p class="text-[12px] text-muted m-0">
    Waypoints Signal · Part of <a href="https://learningwaypoints.com" class="text-muted no-underline hover:text-[#1a1917]">Learning Waypoints</a>
  </p>
  <a href="/teacher" class="text-[12px] text-muted no-underline hover:text-[#1a1917]">Teacher sign in →</a>
</footer>