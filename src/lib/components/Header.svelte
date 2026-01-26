<script lang="ts">
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import HoverLink from '$lib/components/HoverLink.svelte';
    import { page } from '$app/stores';

    $: isHome = $page.url.pathname === '/';
    $: aboutHref = isHome ? '#about' : '/';
</script>

<header class="header">
    <nav class="nav">
        <ul class="nav-links">
            <li>
                <HoverLink 
                    href={aboutHref} 
                    hoverSrc="/images/hover/klever_christ_walkin_on_the_waters_dithered.webp"
                    hoverPosition="left"
                >
                    About
                </HoverLink>
            </li>
            <li>
                <HoverLink 
                    href="/writing" 
                    hoverSrc="/images/hover/caravaggio_saint_jerome_writing_dithered.webp"
                    hoverPosition="left"
                >
                    Writing
                </HoverLink>
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
    padding: 0 var(--space-md);
}


.nav-links{
    display: flex;
    gap: var(--space-lg);
    list-style: none;
}
</style>