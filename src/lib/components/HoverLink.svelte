<script lang="ts">
    import DitheredImage from "./DitheredImage.svelte";
    
    interface Props {
        href: string;
        hoverSrc: string;
        hoverAlt?: string;
        external?: boolean;
        hoverPosition?: 'left' | 'right' | 'below';
        offsetDistance?: string;
        children: any;
    }

    let { 
        href, 
        hoverSrc, 
        hoverAlt = '', 
        external = false,
        hoverPosition = 'right',
        offsetDistance = '0rem',
        children 
    }: Props = $props();

    let isHovered = $state(false);
    let linkElement: HTMLSpanElement;
    let hoverX = $state(0);
    let hoverY = $state(0);

    function updatePosition() {
        if (linkElement) {
            const rect = linkElement.getBoundingClientRect();
            const mainElement = document.querySelector('.main');
            
            if (mainElement) {
                const mainRect = mainElement.getBoundingClientRect();
                
                if (hoverPosition === 'below') {
                    hoverX = rect.left + rect.width / 2;
                    hoverY = rect.bottom;
                } else {
                    hoverY = rect.top + rect.height / 2;
                    
                    if (hoverPosition === 'right') {
                        hoverX = mainRect.right;
                    } else {
                        hoverX = mainRect.left;
                    }
                }
            }
        }
    }

    function handleMouseEnter() {
        isHovered = true;
        updatePosition();
    }

    function handleMouseLeave() {
        isHovered = false;
    }
</script>

<span class="link-wrapper" role="presentation" bind:this={linkElement} onmouseenter={handleMouseEnter} onmouseleave={handleMouseLeave}>
    {#if external}
        <a href={href} target="_blank" rel="noopener noreferrer">
            {@render children()}
        </a>
    {:else}
        <a href={href}>
            {@render children()}
        </a>
    {/if}
    <span 
        class="hover-preview" 
        class:visible={isHovered}
        class:below={hoverPosition === 'below'}
        style:top={hoverPosition === 'below' ? `calc(${hoverY}px + ${offsetDistance})` : `${hoverY}px`}
        style:left={hoverPosition === 'below' ? `${hoverX}px` : hoverPosition === 'right' ? `calc(${hoverX}px + ${offsetDistance})` : 'auto'}
        style:right={hoverPosition === 'left' ? `calc(100vw - ${hoverX}px + ${offsetDistance})` : 'auto'}
    >
        <DitheredImage src={hoverSrc} alt={hoverAlt}/>
    </span>
</span>

<style>
    .link-wrapper {
        position: relative;
        display: inline;
    }

    .hover-preview {
        position: fixed;
        transform: translateY(-50%);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        z-index: 100;
    }

    .hover-preview.below {
        transform: translateX(-50%);
    }

    .hover-preview.visible {
        opacity: 1;
    }

    @media(hover: none) {
        .hover-preview {
            display: none;
        }
    }
</style>
