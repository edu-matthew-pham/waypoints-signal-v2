<script lang="ts">
  import { onMount } from 'svelte'
  import { db } from '$lib/supabase'
  import GenerateTab from '$lib/components/GenerateTab.svelte'
  import QuestionSetTab from '$lib/components/QuestionSetTab.svelte'
  import ResultsTab from '$lib/components/ResultsTab.svelte'

  let authState: 'loading' | 'gate' | 'sent' | 'app' = $state('loading')
  let email = $state('')
  let sentEmail = $state('')
  let authError = $state('')
  let sending = $state(false)
  let userEmail = $state('')
  let userId = $state('')
  let activeTab: 'generate' | 'questions' | 'results' = $state('generate')

  const TABS = [
    { id: 'generate',  label: 'Check-in' },
    { id: 'questions', label: 'Question set' },
    { id: 'results',   label: 'Results' },
  ] as const

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

<nav class="px-8 py-3.5 flex items-center justify-between border-b border-border">
  <span class="font-mono text-xs font-medium text-bg-dark">Waypoints Signal</span>
  <a href="/" class="text-xs text-muted no-underline hover:text-bg-dark">← Back</a>
</nav>

{#if authState === 'loading'}
  <div class="max-w-xl mx-auto px-4 pt-16 text-center text-sm text-muted">
    Loading…
  </div>

{:else if authState === 'gate'}
  <div class="max-w-sm mx-auto mt-20 px-6 text-center">
    <h2 class="text-xl font-semibold mb-2">Teacher sign in</h2>
    <p class="text-sm text-muted mb-6 leading-normal">
      Enter your email — we'll send you a sign-in link.
    </p>
    <div class="flex gap-2 justify-center mb-2">
      <input
        type="email"
        placeholder="you@school.edu.au"
        bind:value={email}
        onkeydown={onKeydown}
        class="text-[15px] px-4 py-3 border-2 border-border rounded-xl bg-surface outline-none focus:border-bg-dark transition-colors w-65 font-sans"
      />
      <button
        onclick={sendMagicLink}
        disabled={sending}
        class="px-5 py-3 bg-bg-dark text-white text-sm font-semibold rounded-xl cursor-pointer hover:opacity-85 disabled:opacity-40 transition-opacity"
      >
        {sending ? 'Sending…' : 'Send link'}
      </button>
    </div>
    {#if authError}
      <p class="text-sm text-red mt-2">{authError}</p>
    {/if}
    <p class="text-xs text-muted mt-3 leading-normal">
      Check your email for a sign-in link. Works from any device.
    </p>
  </div>

{:else if authState === 'sent'}
  <div class="max-w-sm mx-auto mt-20 px-6 text-center">
    <div class="text-[40px] mb-4">✉️</div>
    <h2 class="text-xl font-semibold mb-2">Check your email</h2>
    <p class="text-sm text-muted leading-relaxed">
      We sent a sign-in link to <strong class="text-bg-dark">{sentEmail}</strong>.<br />
      Click it to open the teacher dashboard.
    </p>
  </div>

{:else if authState === 'app'}
  <div class="max-w-5xl mx-auto px-4 py-6">

    <div class="mb-6">
      <div class="font-mono text-[11px] font-medium tracking-widest uppercase text-muted mb-1.5">
        Waypoints Signal
      </div>
      <h1 class="text-[22px] font-semibold">Teacher Dashboard</h1>
    </div>

    <!-- Tabs — named by session type, not by verb: with a third creation
         surface, Generate/Results stops being a coherent axis. -->
    <div role="tablist" class="flex gap-1 border-b border-border mb-6">
      {#each TABS as tab}
        {@const active = activeTab === tab.id}
        <button
          role="tab"
          aria-selected={active}
          aria-controls="panel-{tab.id}"
          onclick={() => activeTab = tab.id}
          class="px-4 py-2 text-sm rounded-t-lg border border-transparent border-b-0 transition-all cursor-pointer
            {active
              ? 'bg-bg border-border text-bg-dark font-semibold -mb-px'
              : 'text-muted hover:text-bg-dark bg-transparent'}"
        >
          {tab.label}
        </button>
      {/each}
    </div>

    <div id="panel-generate" role="tabpanel" hidden={activeTab !== 'generate'}>
      <GenerateTab {userId} />
    </div>
    <div id="panel-questions" role="tabpanel" hidden={activeTab !== 'questions'}>
      <QuestionSetTab {userId} />
    </div>
    <div id="panel-results" role="tabpanel" hidden={activeTab !== 'results'}>
      <ResultsTab {userId} />
    </div>

    <div class="mt-8 pt-5 border-t border-border flex items-center justify-between">
      <span class="text-xs text-muted">{userEmail}</span>
      <button
        onclick={signOut}
        class="px-4 py-2 bg-border text-bg-dark text-sm font-semibold rounded-lg cursor-pointer hover:opacity-85 transition-opacity"
      >
        Sign out
      </button>
    </div>

  </div>
{/if}