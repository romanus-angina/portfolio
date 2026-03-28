<script lang="ts">
    import { posts } from '$lib/data/posts';
</script>

<svelte:head>
    <title>Romanus Ang'ina | Writing</title>
    <meta name="description" content="Essays and thoughts on ML, engineering, and building things." />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://romanusangina.com/writing" />
    <meta property="og:title" content="Romanus Ang'ina | Writing" />
    <meta property="og:description" content="Essays and thoughts on ML, engineering, and building things." />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary" />
    <meta property="twitter:url" content="https://romanusangina.com/writing" />
    <meta property="twitter:title" content="Romanus Ang'ina | Writing" />
    <meta property="twitter:description" content="Essays and thoughts on ML, engineering, and building things." />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://romanusangina.com/writing" />
</svelte:head>

<section class="writing">
    <h1>Writing</h1>
    <div class="post-list">
        {#each posts as post}
            <div class="post-item">
                <span class="post-date">{post.date}</span>
                <a href="/writing/{post.slug}" class="post-title">{post.title}</a>
            </div>
        {/each}
    </div>
</section>

<style>
    .writing h1 {
        font-size: 2.4rem;
        margin-bottom: var(--space-sm);
    }

    .post-list {
        border-top: 1px solid var(--color-text-muted);
        padding-top: var(--space-md);
    }

    .post-item {
    display: flex;
    align-items: baseline;
    gap: var(--space-md);
    padding: var(--space-sm) 0;
}

.post-title {
    font-size: 1.1rem;
    font-weight: 500;
}

    .post-date {
        font-size: 0.8rem;
        color: var(--color-text-muted);
        white-space: nowrap;
        flex-shrink: 0;
    }

    .post-title {
        font-size: 1.1rem;
        font-weight: 500;
    }

    @media (max-width: 480px) {
        .post-item {
            flex-direction: column;
            gap: var(--space-xs);
        }
    }
</style>