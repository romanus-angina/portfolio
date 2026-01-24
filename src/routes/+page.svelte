<script lang="ts">
    import ThemeToggle from '$lib/components/ThemeToggle.svelte'
</script>

<h1> Component Testing </h1>

<section> 
    <h2>Theme Toggle</h2>
    <ThemeToggle />
</section>

<section>
    <h2>Theme Toggle</h2>
    <p>
        Here is a <a href="#">sample link</a> to see the underline.
    </p>
    <p>
        Another <a href="https://example.com">external link</a> for testing.
    </p>
</section>

<style>
  section {
    margin-bottom: 3rem;
    padding: 1rem;
    border: 1px dashed #ccc;
  }
</style>