<script lang="ts">
    const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
    <div class="footer-inner">
        <div class="footer-container">
            <div 
                class="footer-painting" 
                role="img" 
                aria-label="Decorative footer artwork"
            ></div>
            <div class="footer-content">
                <span class="copyright">{currentYear}</span>
                <span class="signature">Romanus Ang'ina</span>
            </div> 
        </div>
    </div>
    
</footer>

<style>
    .footer {
        padding: var(--space-md);
    }

    .footer-inner {
        max-width: 42rem;
        margin: 0 auto;
        padding: 0 var(--space-md);
    }
    .footer-container {
        padding: 0 var(--space-lg);
        border-top: 1px solid var(--color-text-muted);
    }

    .footer-painting {
        width: 100%;
        aspect-ratio: 1344 / 400;
        background-color: var(--color-image);
        -webkit-mask-image: url('/images/footer/cisori_ecco_homo_dithered.png');
        mask-image: url('/images/footer/cisori_ecco_homo_dithered.png');
        -webkit-mask-size: cover;
        mask-size: cover;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-position: center;
        mask-position: center;
    }

    .footer-content {
        padding-top: var(--space-sm);
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

    @media (max-width: 480px) {
        .footer-painting {
            height: 80px;
        }
    }
</style>