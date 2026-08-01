<script lang="ts">
  import { goto } from '$app/navigation'

  let code = $state('')
  let error = $state('')

  function formatCode(e: Event) {
    const input = e.target as HTMLInputElement
    let val = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (val.length > 4) val = val.slice(0, 4) + '-' + val.slice(4, 8)
    code = val
    error = ''
  }

  function submit() {
    const clean = code.replace('-', '')
    if (clean.length !== 8 || !/^[A-Z]{4}\d{4}$/.test(clean)) {
      error = 'Enter a valid code — e.g. XKQT-4821'
      return
    }
    const formatted = clean.slice(0, 4) + '-' + clean.slice(4)
    goto(`/student/${formatted}`)
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') submit()
  }
</script>

<svelte:head>
  <title>Enter session code — Waypoints Signal</title>
</svelte:head>

<nav class="px-8 py-5 flex items-center justify-between border-b border-border">
  <a href="/" class="font-mono text-[13px] font-medium tracking-[0.04em] text-bg-dark no-underline">
    Waypoints Signal
  </a>
  <a href="/" class="text-[12px] text-muted no-underline hover:text-bg-dark">
    ← Back
  </a>
</nav>

<div class="max-w-100 mx-auto mt-20 px-6 text-center">
  <h2 class="text-[20px] font-semibold mb-2">Enter session code</h2>
  <p class="text-[14px] text-muted mb-6 leading-normal">
    Your teacher will give you a code that looks like<br />
    <strong class="font-mono text-bg-dark">XKQT-4821</strong>
  </p>

  <div class="flex gap-2 justify-center mb-2">
    <input
      type="text"
      maxlength={9}
      placeholder="XXXX-0000"
      value={code}
      oninput={formatCode}
      onkeydown={onKeydown}
      class="font-mono text-[20px] font-medium tracking-[0.15em] text-center uppercase w-42.5 px-3 py-3 border-2 border-border rounded-xl bg-surface outline-none focus:border-bg-dark transition-colors"
    />
    <button
      onclick={submit}
      class="px-5 py-3 bg-bg-dark text-white text-[14px] font-semibold rounded-xl cursor-pointer hover:opacity-85 transition-opacity"
    >
      Go
    </button>
  </div>

  {#if error}
    <p class="text-[13px] text-red mt-2">{error}</p>
  {/if}
</div>