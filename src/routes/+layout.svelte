<script lang="ts">
	import '../app.css';

  import Footer from '$lib/components/Footer.svelte'
	import Header from '$lib/components/Header.svelte'
    import { onMount } from 'svelte';
    import { theme } from '$lib/stores/themes';
    onMount(() => {
        const unsubscribe = theme.subscribe((value) => {
            document.documentElement.setAttribute('data-theme', value);
        });
        return unsubscribe;
    });

	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<Header />
<main class="main">
  {@render children()}
</main>

<Footer />

<style>
  .main {
    max-width: 42rem;
    margin: 0 auto;
    padding: 0 var(--space-md);
    min-height: calc(100vh - 200px);
  }
</style>