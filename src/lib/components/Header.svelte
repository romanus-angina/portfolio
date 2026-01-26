<script lang="ts">
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import LinkWithHover from '$lib/components/LinkWithHover.svelte';
    import { page } from '$app/stores';

    $: isHome = $page.url.pathname === '/';
    $: aboutHref = isHome ? '#about' : '/';
</script>

<header class="header">
    <nav class="nav">
        <ul class="nav-links">
            <li>
                <LinkWithHover 
                    href={aboutHref} 
                    hoverSrc="/images/hover/klever_christ_walkin_on_the_waters_dithered.png"
                    hoverPosition="left"
                >
                    About
                </LinkWithHover>
            </li>
            <li>
                <LinkWithHover 
                    href="/writing" 
                    hoverSrc="/images/hover/caravaggio_saint_jerome_writing_dithered.png"
                    hoverPosition="left"
                >
                    Writing
                </LinkWithHover>
            </li>
        </ul>

        <ThemeToggle />
    </nav>
</header>

<style>
.header{
    padding: var(--space-md);
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