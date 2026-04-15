<script lang="ts">
  import './layout.css'

  let { children } = $props()
</script>

<svelte:head>
  <meta name="theme-color" content="#f5f4f0" />
</svelte:head>

<div class="min-h-screen bg-bg text-[#1a1917] font-sans">
  {@render children()}
</div>