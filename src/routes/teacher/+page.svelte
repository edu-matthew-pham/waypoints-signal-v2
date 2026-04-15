<script lang="ts">
  import { onMount } from 'svelte'
  import { db } from '$lib/supabase'
  import GenerateTab from '$lib/components/GenerateTab.svelte'
  import ResultsTab from '$lib/components/ResultsTab.svelte'

  let authState: 'loading' | 'gate' | 'sent' | 'app' = $state('loading')
  let email = $state('')
  let sentEmail = $state('')
  let authError = $state('')
  let sending = $state(false)
  let userEmail = $state('')
  let userId = $state('')
  let activeTab: 'generate' | 'results' = $state('generate')

  onMount(async () => {
    const { data: { session } } = await db.auth.getSession()
    if (session) {
      userEmail = session.user.email ?? ''
      userId = session.user.id
      authState = 'app'
    } else {
      authState = 'gate'
    }

    db.auth.onAuthStateChange((_event, session) => {
      if (session) {
        userEmail = session.user.email ?? ''
        userId = session.user.id
        authState = 'app'
      }
    })
  })

  async function sendMagicLink() {
    if (!email.trim()) { authError = 'Enter your email.'; return }
    sending = true
    authError = ''

    const { error } = await db.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.href }
    })

    if (error) {
      authError = error.message
      sending = false
    } else {
      sentEmail = email.trim()
      authState = 'sent'
    }
  }

  async function signOut() {
    await db.auth.signOut()
    userEmail = ''
    userId = ''
    email = ''
    authState = 'gate'
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') sendMagicLink()
  }
</script>

<svelte:head>
  <title>Teacher Dashboard — Waypoints Signal</title>
</svelte:head>

<nav class="px-8 py-[14px] flex items-center justify-between border-b border-border">
  <span class="font-mono text-[12px] font-medium text-[#1a1917]">Waypoints Signal</span>
  <a href="/" class="text-[12px] text-muted no-underline hover:text-[#1a1917]">← Back</a>
</nav>

{#if authState === 'loading'}
  <div class="max-w-[600px] mx-auto px-4 pt-16 text-center text-[14px] text-muted">
    Loading…
  </div>

{:else if authState === 'gate'}
  <div class="max-w-[400px] mx-auto mt-20 px-6 text-center">
    <h2 class="text-[20px] font-semibold mb-2">Teacher sign in</h2>
    <p class="text-[14px] text-muted mb-6 leading-[1.5]">
      Enter your email — we'll send you a sign-in link.
    </p>
    <div class="flex gap-2 justify-center mb-2">
      <input
        type="email"
        placeholder="you@school.edu.au"
        bind:value={email}
        onkeydown={onKeydown}
        class="text-[15px] px-4 py-3 border-2 border-border rounded-xl bg-surface outline-none focus:border-[#1a1917] transition-colors w-[260px] font-sans"
      />
      <button
        onclick={sendMagicLink}
        disabled={sending}
        class="px-5 py-3 bg-[#1a1917] text-white text-[14px] font-semibold rounded-xl cursor-pointer hover:opacity-85 disabled:opacity-40 transition-opacity"
      >
        {sending ? 'Sending…' : 'Send link'}
      </button>
    </div>
    {#if authError}
      <p class="text-[13px] text-red mt-2">{authError}</p>
    {/if}
    <p class="text-[12px] text-muted mt-3 leading-[1.5]">
      Check your email for a sign-in link. Works from any device.
    </p>
  </div>

{:else if authState === 'sent'}
  <div class="max-w-[400px] mx-auto mt-20 px-6 text-center">
    <div class="text-[40px] mb-4">✉️</div>
    <h2 class="text-[20px] font-semibold mb-2">Check your email</h2>
    <p class="text-[14px] text-muted leading-[1.6]">
      We sent a sign-in link to <strong class="text-[#1a1917]">{sentEmail}</strong>.<br />
      Click it to open the teacher dashboard.
    </p>
  </div>

{:else if authState === 'app'}
  <div class="max-w-[600px] mx-auto px-4 py-6">

    <div class="mb-6">
      <div class="font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-muted mb-1.5">
        Waypoints Signal
      </div>
      <h1 class="text-[22px] font-semibold">Teacher Dashboard</h1>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 border-b border-border mb-6">
      <button
        onclick={() => activeTab = 'generate'}
        class="px-4 py-2 text-[13px] rounded-t-lg border border-transparent border-b-0 transition-all cursor-pointer
          {activeTab === 'generate'
            ? 'bg-bg border-border text-[#1a1917] font-semibold -mb-px'
            : 'text-muted hover:text-[#1a1917] bg-transparent'}"
      >
        Generate session
      </button>
      <button
        onclick={() => activeTab = 'results'}
        class="px-4 py-2 text-[13px] rounded-t-lg border border-transparent border-b-0 transition-all cursor-pointer
          {activeTab === 'results'
            ? 'bg-bg border-border text-[#1a1917] font-semibold -mb-px'
            : 'text-muted hover:text-[#1a1917] bg-transparent'}"
      >
        View results
      </button>
    </div>

    {#if activeTab === 'generate'}
      <GenerateTab {userId} />
    {:else}
      <ResultsTab {userId} />
    {/if}

    <div class="mt-8 pt-5 border-t border-border flex items-center justify-between">
      <span class="text-[12px] text-muted">{userEmail}</span>
      <button
        onclick={signOut}
        class="px-4 py-2 bg-border text-[#1a1917] text-[13px] font-semibold rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
      >
        Sign out
      </button>
    </div>

  </div>
{/if}