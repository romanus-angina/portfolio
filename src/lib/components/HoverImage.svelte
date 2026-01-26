<script lang="ts">
    interface Props {
    src: string;
    alt?: string;
    width?: string;
    height?: string;
}

let { 
    src, 
    alt = '', 
    width = '128', 
    height = '128' 
}: Props = $props();
</script>

<div class="hover-image" style:width="{width}px" style:height="{height}px" style:--mask-image="url('{src}')" role="img" aria-label="{alt}">
</div>

<style>
    .hover-image{
        background-color: var(--color-image);
        -webkit-mask-image: var(--mask-image);
        mask-image: var(--mask-image);
        -webkit-mask-size: cover;
        mask-size: cover;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        /*clip-path: polygon(0 50%, 100% 0, 100% 100%);*/
    }
</style>