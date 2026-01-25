<script lang="ts">
    const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
    <div class="footer-container">
        <div class="footer-content">
            <span class="copyright">© {currentYear}</span>
            <span class="signature"> Romanus Ang'ina</span>
        </div> 
    </div>
</footer>

<style>
    .footer {
        padding: var(--space-md);
    }

    .footer-container {
        max-width: 42rem;
        margin: 0 auto;
        padding: 0 var(--space-md);
    }
    .footer-content {
        border-top: 1px solid var(--color-text-muted);
        max-width: 42rem;
        margin: 0 auto;
        padding: 0 var(--space-md);
        display: flex;
        justify-content: space-between;
    }

    .signature {
        font-style: italic;
        font-weight: 600;
        font-size: 1.1rem;
        color: var(--color-link-underline);
    }

    .copyright {
        color: var(--color-text-muted);
        font-size: 1.1rem;
    }
</style>