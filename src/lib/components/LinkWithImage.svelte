<script lang="ts">
    import DitheredImage from "./DitheredImage.svelte";
    
    interface Props {
        href: string;
        imageSrc: string;
        imageAlt?: string;
        external?: boolean;
        imagePosition?: 'inline' | 'below';
        offsetDistance?: string;
        width?: string;
        height?: string;
        children: any;
    }

    let { 
        href, 
        imageSrc, 
        imageAlt = '', 
        external = false,
        imagePosition = 'below',
        offsetDistance = '0.5rem',
        width = '64',
        height = '64',
        children 
    }: Props = $props();
</script>

<span class="link-with-image" class:inline={imagePosition === 'inline'} class:below={imagePosition === 'below'}>
    {#if external}
        <a href={href} target="_blank" rel="noopener noreferrer" class="link-text">
            {@render children()}
        </a>
    {:else}
        <a href={href} class="link-text">
            {@render children()}
        </a>
    {/if}
    
    <span 
        class="image-wrapper" 
        style:margin-top={imagePosition === 'below' ? offsetDistance : '0'}
        style:margin-left={imagePosition === 'inline' ? offsetDistance : '0'}
    >
        {#if external}
            <a href={href} target="_blank" rel="noopener noreferrer">
                <DitheredImage src={imageSrc} alt={imageAlt} width={width} height={height}/>
            </a>
        {:else}
            <a href={href}>
                <DitheredImage src={imageSrc} alt={imageAlt} width={width} height={height}/>
            </a>
        {/if}
    </span>
</span>

<style>
    .link-with-image {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }

    .link-with-image.below {
        display: inline-block;
    }
    
    .link-with-image.below .image-wrapper {
        display: block;
        margin-top: 0.5rem;
    }

    .link-text {
        display: inline;
    }

    .image-wrapper {
        display: inline-block;
    }
</style>
