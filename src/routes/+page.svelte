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

<div class="spacer"></div>

<section id="about">
  <h2>About Section</h2>
  <p>If clicking "About" in the header brought you here smoothly, it works.</p>
  <p>
    <a href="#">Click here</a> and then click "About" in the nav to test again.
  </p>
</section>

<style>
  section {
    margin-bottom: 3rem;
    padding: 1rem;
    border: 1px dashed #ccc;
  }

  .spacer {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #ccc;
  }
  
  .spacer::before {
    content: 'Scroll down or click About in nav';
    color: var(--color-text-muted);
  }
</style>