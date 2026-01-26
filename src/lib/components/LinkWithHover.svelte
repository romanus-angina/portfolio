<script lang="ts">
    import HoverImage from "./HoverImage.svelte";
    import { onMount } from 'svelte';
    
    interface Props {
        href: string;
        hoverSrc: string;
        hoverAlt?: string;
        external?: boolean;
        hoverPosition?: 'left' | 'right' | 'below';
        offsetDistance?: string;
        alwaysShowOnMobile?: boolean;
        mobileWidth?: string;
        mobileHeight?: string;
        children: any;
    }

    let { 
        href, 
        hoverSrc, 
        hoverAlt = '', 
        external = false,
        hoverPosition = 'right',
        offsetDistance = '0rem',
        alwaysShowOnMobile = false,
        mobileWidth = '64',
        mobileHeight = '64',
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
                    // X position: center of the link itself
                    hoverX = rect.left + rect.width / 2;
                    // Y position: bottom of the link
                    hoverY = rect.bottom;
                } else {
                    // Y position: center of the link
                    hoverY = rect.top + rect.height / 2;
                    
                    // X position: edge of content container
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

    onMount(() => {
        if (alwaysShowOnMobile) {
            updatePosition();
        }
    });
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
        class:always-show-mobile={alwaysShowOnMobile}
        style:top={hoverPosition === 'below' ? `calc(${hoverY}px + ${offsetDistance})` : `${hoverY}px`}
        style:left={hoverPosition === 'below' ? `${hoverX}px` : hoverPosition === 'right' ? `calc(${hoverX}px + ${offsetDistance})` : 'auto'}
        style:right={hoverPosition === 'left' ? `calc(100vw - ${hoverX}px + ${offsetDistance})` : 'auto'}
    >
        <span class="desktop-image">
            <HoverImage src={hoverSrc} alt={hoverAlt}/>
        </span>
        <span class="mobile-image">
            {#if external}
                <a href={href} target="_blank" rel="noopener noreferrer">
                    <HoverImage src={hoverSrc} alt={hoverAlt} width={mobileWidth} height={mobileHeight}/>
                </a>
            {:else}
                <a href={href}>
                    <HoverImage src={hoverSrc} alt={hoverAlt} width={mobileWidth} height={mobileHeight}/>
                </a>
            {/if}
        </span>
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
        /*border: 1px solid var(--color-image);*/
    }

    .hover-preview.below {
        transform: translateX(-50%);
    }

    .hover-preview.visible {
        opacity: 1;
    }

    .desktop-image,
    .mobile-image {
        display: inline-block;
    }

    .mobile-image {
        display: none;
    }

    @media(hover: none) {
        .hover-preview {
            display: none;
        }

        .hover-preview.always-show-mobile {
            display: block;
            opacity: 1;
            position: static;
            transform: none;
            pointer-events: auto;
        }

        .hover-preview.always-show-mobile .desktop-image {
            display: none;
        }

        .hover-preview.always-show-mobile .mobile-image {
            display: block;
        }

        .hover-preview.always-show-mobile .mobile-image a {
            display: inline-block;
            line-height: 0;
        }
    }

</style>
