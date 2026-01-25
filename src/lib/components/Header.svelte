<script lang="ts">
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import { page } from '$app/stores';

    $: isHome = $page.url.pathname === '/';
    $: aboutHref = isHome ? '#about' : '/';
</script>

<header class="header">
    <nav class="nav">
        <ul class="nav-links">
            <li>
                <a href={aboutHref}>About</a>
            </li>
            <li>
                <a href="/writing">Writing</a>
            </li>
            <li>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
            </li>
        </ul>

        <ThemeToggle />
    </nav>
</header>

<style>
.header{
    padding: var(--space-md) 0;
}

.nav {
    max-width: 42rem;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
}


.nav-links{
    display: flex;
    gap: var(--space-lg);
    list-style: none;
}
</style>