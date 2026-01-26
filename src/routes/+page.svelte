<script lang="ts">
  import LinkWithHover from "$lib/components/LinkWithHover.svelte";
</script>

<svelte:head>
    <title>Romanus Ang'ina | Home</title>
    <meta name="description" content="Applied ML Engineer at Rice University focused on building systems that bridge machine learning and real-world applications. Experienced in full-stack AI systems, RAG pipelines, and ML infrastructure." />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://romanusangina.com/" />
    <meta property="og:title" content="Romanus Ang'ina | Home" />
    <meta property="og:description" content="Applied ML Engineer at Rice University focused on building systems that bridge machine learning and real-world applications." />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://romanusangina.com/" />
    <meta property="twitter:title" content="Romanus Ang'ina | Home" />
    <meta property="twitter:description" content="Applied ML Engineer at Rice University focused on building systems that bridge machine learning and real-world applications." />
    <meta name="twitter:creator" content="@rxmxnvs" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://romanusangina.com/" />
    
    <!-- Structured Data -->
    {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Romanus Ang'ina",
      "url": "https://romanusangina.com",
      "jobTitle": "Applied ML Engineer",
      "worksFor": {
        "@type": "EducationalOrganization",
        "name": "Rice University"
      },
      "sameAs": [
        "https://twitter.com/rxmxnvs",
        "https://github.com/romanus-angina",
        "https://www.linkedin.com/in/romanus-angina/"
      ],
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "Rice University"
      }
    }
    <\/script>`}
</svelte:head>

<section id="about" class="about">
  <div class="intro">
    <div class="intro-header">
        <h1> Hey, I'm Romanus</h1>
    </div>
    <div class="intro-text">

      <p>
        Currently, I'm a junior studying Electrical & Computer Engineering at Rice University, 
        where I research ML applications in wireless systems with <LinkWithHover href="https://doost.rice.edu/" hoverSrc="/images/hover/vermeer_astronomer_dithered.webp" external={true}>Dr. Rahman Doost-Mohammady</LinkWithHover> 
        under <LinkWithHover href="https://renew.rice.edu/" hoverSrc="/images/hover/luycks_still_life_with_globe_dithered.webp" hoverPosition="left" external={true}>Rice's RENEW project</LinkWithHover>. I've also worked on glucose prediction models for diabetes patients with 
        <LinkWithHover href="https://simar.rice.edu/" hoverSrc="/images/hover/vermeer_the_geographer_dithered.webp" hoverPosition="left" external={true}>Dr. Ray Simar</LinkWithHover> and worked on FinFET efficiency improvements at <LinkWithHover href="https://wide.rice.edu/" hoverSrc="/images/hover/wright_of_derby_the_alchemist_dithered.webp" hoverPosition="right" external={true}>Rice's WIDE Lab</LinkWithHover>.
      </p>

      <p>
        Previously, I built full-stack AI systems at a stealth health-tech startup (production RAG pipelines, ML infrastructure) and 
        AI implementations for businesses in Houston at <LinkWithHover href="https://www.linkedin.com/company/agentic-ai-services" hoverSrc="/images/hover/clausen_our_blacksmith_dithered.webp" external={true}>Agentic AI Services</LinkWithHover>.
      </p>

      <p>
        Originally from Nairobi. I run 5Ks, have somehow met two of Kenya's presidents, and play guitar, bass, and drums (not simultaneously, unfortunately).
      </p>

      <p>
        If you're building something interesting or just want to chat, <LinkWithHover href="https://mail.google.com/mail/?view=cm&fs=1&to=sra12@rice.edu" hoverSrc="/images/hover/schneider_hypnosis_dithered.webp" hoverPosition="right" external={true}>reach out.</LinkWithHover>
      </p>
    </div>
  </div>
</section>

<section class="contact">
  <ul class="contact-links">
    <li><LinkWithHover href="https://twitter.com/rxmxnvs" hoverSrc="/images/hover/barraband_petit_dithered.webp" hoverPosition="below" offsetDistance="1rem" alwaysShowOnMobile={true} external={true}>Twitter</LinkWithHover></li>
    <li><LinkWithHover href="https://github.com/romanus-angina" hoverSrc="/images/hover/bevzenko_young_workers_dithered.webp" hoverPosition="below" offsetDistance="1rem" alwaysShowOnMobile={true} external={true}>GitHub</LinkWithHover></li>
    <li><LinkWithHover href="https://www.linkedin.com/in/romanus-angina/" hoverSrc="/images/hover/anschutz_iron_workers_noontime_dithered.webp" hoverPosition="below" offsetDistance="1rem" alwaysShowOnMobile={true} external={true}>LinkedIn</LinkWithHover></li>
  </ul>
</section>

<style>
  
  
  .intro-text {
    flex: 1;
    border-top: 1px solid var(--color-text-muted);
    padding: var(--space-md);
  }

  .intro-header h1 {
    font-size: 2.4rem;
    margin-bottom: var(--space-sm);
  }
  .contact-links {
    display: flex;
    gap: var(--space-xl);
    list-style: none;
    justify-content: space-evenly;
  }

  .contact{
    padding: 0 var(--space-md);
  }

  @media(hover: hover) {
    .contact {
      padding-bottom: 8rem;
    }
  }
</style>