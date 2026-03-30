<script lang="ts">
    import HoverLink from "$lib/components/HoverLink.svelte";
    import LinkWithImage from "$lib/components/LinkWithImage.svelte";
    const title = "mailto: and the Problem with Silent Failure";
    const description =
        "About a 32-year-old URI scheme, and why good engineering entails selecting how things break.";
    const date = "March 2026";
    const url = "https://romanusangina.com/writing/mailto";
</script>

<svelte:head>
    <title> Romanus Ang'ina | {title} </title>
    <meta name="description" content={description} />

    <!-- Open Graph -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="mailto: is confirmed MID" />
    <meta property="og:description" content="The mailto: URI scheme silently fails for most users. A decision tree of dead ends." />
    <meta property="og:image" content="https://romanusangina.com/og/mailto.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="https://romanusangina.com/writing/mailto" />

    <!-- Twitter/X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="mailto: is confirmed MID" />
    <meta name="twitter:description" content="The mailto: URI scheme silently fails for most users. A decision tree of dead ends." />
    <meta name="twitter:image" content="https://romanusangina.com/og/mailto.png" />

    <!-- Canonical URL -->
    <link rel="canonical" href={url} />

    <!-- Structured Data -->
    {@html `<script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${title}",
        "description": "${description}",
        "datePublished": "2026-03-01",
        "author": {
            "@type": "Person",
            "name": "Romanus Ang'ina",
            "url": "https://romanusangina.com"
        },
        "publisher": {
            "@type": "Person",
            "name": "Romanus Ang'ina"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${url}"
        }
    }
    <\/script>`}
</svelte:head>

<article class="article">
    <div class="article-date">{date}</div>

    <h1 class="article-title">{title}</h1>

    <div class="article-subtitle">
        {description}
    </div>

    <p>
        In systems engineering, there is a principle that is often overlooked: when something fails, it should be evident. 
        A request that simply vanishes is worse than a 500 error. Undefined behavior is worse than a compile error.
        A timeout is better than a hang. It's much more difficult to determine what's wrong when you can't see it, 
        but you can fix what you can see. ( Kinda why a lot of vibe coded apps fail )
    </p>

    <p>
        <code>mailto:</code> is a case study in such behavior. A case study of this kind of behavior is mailto. 
        It has been in HTML since 1994, is technically 'fine', passes all linters, but for a significant 
        portion of users, nothing happens and there is no sign that something went wrong when it is referenced by the browser.
    </p>

    <p>
        I want to discuss why that occurs, why AI continues to produce it, 
        and what the alternative looks like when you reason from what Aristotle called archai, first principles. <a href="#fn1" class="footnote-ref" aria-label="Footnote 1">1</a>
    </p>

    <h2>What mailto: Actually Is</h2>

    <p>
        <code>mailto:</code> is not an HTML tag. It is an IETF-defined URI scheme, similar to
        <code>https:</code> or <code>ftp:</code>. It was formalized in
        <a href="https://datatracker.ietf.org/doc/html/rfc1738" target="_blank" rel="noopener noreferrer">RFC 1738</a>
        in December 1994, expanded in
        <a href="https://datatracker.ietf.org/doc/html/rfc2368" target="_blank" rel="noopener noreferrer">RFC 2368</a>
        (July 1998), and received its final revision in
        <a href="https://datatracker.ietf.org/doc/html/rfc6068" target="_blank" rel="noopener noreferrer">RFC 6068</a>
        (October 2010).<a href="#fn2" class="footnote-ref" aria-label="Footnote 2">2</a>
    </p>

    <p>
        Most people are unaware of how much the scheme can do. The subject, body, CC, and BCC can all be pre-filled and encoded into the URL:
    </p>

    <div class="code-block"><span class="tag">&lt;a</span> <span class="attr">href</span>=<span class="string">"mailto:you@example.com?subject=Quick%20Question&amp;body=Hey%2C%20I%20saw%20your%20site..."</span><span class="tag">&gt;</span>
        Email us
        <span class="tag">&lt;/a&gt;</span>
    </div>

    <p>
        An anchor tag can contain basically an entire email draft.
    </p>

    <h2>Opaque Delegation</h2>

    <p>
        A browser does not process the request itself when it comes across <code>mailto:</code>.
        It transfers control to the operating system, which searches for the program that has been designated as the
        <code>mailto:</code> protocol's default handler. Said program opens if it is installed and set up but 
        if not, the url header is displayed on a blank page and no redirect occurs.
    </p>

    <p>
        Using this scheme opens up a black box that the developer has no access to.
        In this black box are a series of systems such as the OS default app settings, the protocol handler registry in the browser, and 
        the status of any installed email client. Has the email client opened? Was the message sent by the user? Did they come to a standstill?
        You have no idea. 
    </p>

    <div class="diagram-container" role="img" aria-label="Decision tree showing how mailto links can fail silently at multiple points">
        <img src="../../images/writing/mailto/mailto_decision_tree.png" alt="" loading="lazy" />
    </div>

    <p>
        However, in 1994, this transfer of control was pretty sure fire since most people had
        a pre-configured email client. But about a decade later, Gmail launched in 2004, and 
        with it emails moved into the browser. But browsers cannot handle <code>mailto:</code> innately since it relies
        on OS-level protocol registrations. If the user does all their email in a
        Chrome tab and never configured a handler, clicking <code>mailto:</code>
        either opens an Apple Mail setup wizard, triggers a Windows Store prompt, or
        does nothing.
    </p>

    <p>
        Even on macOS, where Apple Mail ships pre-installed, the UX is pretty bad when it comes to changing the default mail handler.
        To change the default mail handler, you have to open Mail, go to Settings, and
        pick a different app from the dropdown. Except the Settings menu is greyed
        out unless you have already configured an email account in Mail. To tell
        macOS you do not want to use Apple Mail, you first have to set up Apple
        Mail.<a href="#fn3" class="footnote-ref" aria-label="Footnote 3">3</a> The
        terminal workaround that power users relied on
        (<code>LSSetDefaultHandlerForURLScheme</code>) was deprecated in macOS 14.2.
        This has not changed through Sequoia or Tahoe. 
        In addition to this, Chrome can be set as the default mail handler, and it cannot handle <code>mailto:</code> links.
        Apple apparently considers this acceptable.
    </p>

    <p>
        There is no <code>onerror</code> callback for a <code>mailto:</code> click
        so there is no programmatic way to determine whether it succeeded.
        In any other context we would call this an unobservable failure mode and
        treat it as a bug.
    </p>

    <h2>Exposed by Design</h2>

    <p>
        Another problem with <code>mailto:</code> links is that they publish your email
        address in the DOM in a format specifically designed to be machine-readable.
        The href says <code>mailto:you@example.com</code>. Bots have been harvesting
        these with trivial regex(es?i?) since the late '90s.
    </p>

    <p>
        In its security considerations, <a href="https://datatracker.ietf.org/doc/html/rfc6068#page-12" target="_blank" rel="noopener noreferrer">RFC 6068</a> 
        recognizes the fact that mailto
        constructs can be located within HTML pages by automated means (even bcc'ed ones) and that
        addresses harvested this way are likely to end up on spam lists. The spec even acknowledges 
        that sophisticated bots can get around obfuscation, which is a mentioned defence.<a href="#fn4" class="footnote-ref" aria-label="Footnote 4">4</a>
        An RFC hedging against a flaw in its pretty noteworthy.
    </p>

    <p>
        You can do a bit of obfuscation by encoding characters as HTML entities, reconstructing
        the address in JavaScript at runtime, and splitting it across data attributes. Some
        of these reduce harvest rates but they are workarounds for a property of the
        scheme itself. It was built to be machine-readable. That is
        a feature for email clients and a vulnerability for developers.
    </p>

    <h2>Why AI Keeps Generating It</h2>

    <p>
        Ask a language model to build a contact page and there is a strong chance you
        get <code>mailto:</code>.
    </p>

    <p>
        LLMs learn to write code by reading code, and <code>mailto:</code>  is heavily present within
        the training corpus. It appears in every introductory HTML tutorial, in MDN
        docs, in Stack Overflow answers, in W3Schools, in the source of millions of
        archived websites. If you estimated the probability distribution over HTML
        patterns following the phrase "contact us," <code>mailto:</code> is extremely likely to follow.
        It has been the canonical answer to that question for 30 years. And this is one of the instances where
        the most probable solution doesn't make the cut and LLM's will fall short.
    </p>

    <p>
        There is also a bias toward 'simpler' solutions such as
        <code>mailto:</code>  which is  a singular line of code. A language model gravitating toward the simplest
        complete answer will pick the <code>mailto:</code> token whenever it pops up. And the output is technically
        correct as it is valid HTML and by all formal metrics available in the training data, it is good code.
        This is not unique to <code>mailto:</code>. You see the same dynamic in
        AI-generated code that reaches for deprecated APIs or patterns that were best
        practice five years ago
    </p>

    <h2>Choosing How Things Break</h2>

    <p>
        There is no single HTML construct that opens an email compose window in every user's
        preferred client. Every approach to contact on the web
        makes an assumption about the user's environment. The engineering question is
        not which assumption is universally right, but what happens when the
        assumption is wrong.
    </p>

    <p>
        <code>mailto:</code> has no ways to poll for the outcome. A direct compose link, like Gmail's
        <code>mail.google.com/mail/?view=cm&fs=1&to=you@example.com</code>, is a
        standard <code>https://</code> URL which will mostly load and if not, it will show an error.
        It assumes the user has Gmail, which initially appears to be a very broad (but pretty probable)assumption. 
        But at least when that assumption is wrong, the user
        lands on a login page and they see what happened. They can go back, or log in,
        or try something else. The failure is explicit.
    </p>

    <p>
        A plain-text email address on a webpage makes no assumptions. The user has the ability to view, copy, and paste 
        it into any application. It is incredibly portable but the user bears the expense of doing the work themselves.
    </p>
    

    <p>
        On this very site, I link the words "reach out" to a Gmail compose URL and
        display my email address as visible, copyable text. The
        link cannot silently fail. And anyone who does not use Gmail can see the
        address and handle it however they prefer. Every instance mailto: fumbles is covered by these two HTML tags.
    </p>

    <div class="pullquote">
        <HoverLink href="https://mail.google.com/mail/?view=cm&fs=1&to=sra12@rice.edu" hoverSrc="/images/hover/schneider_hypnosis_dithered.webp" hoverPosition="right" external={true}>reach out</HoverLink> <span class="email-aside">(<span class="email-addr">sra12@rice.edu</span>)</span>
    </div>

    <p>
        This is not a solution that works every time. Rather, it is a conscious decision about which assumption to make and how to respond when that assumption is violated.
        And that is what engineering actually is: not only building things that never fail, but
        building things that fail in ways you can see, reason about, and overcome.
    </p>

    <p>
        <code>mailto:</code> fails in ways you cannot see which is why I do not use
        it, and why it is the first thing I check when an AI builds a contact page.
    </p>

    <p>
            Feel free to "reach out" with any thoughts or questions about this essay, they will be very appreciated <span class="email-aside">!</span>
    </p>

    <div class="footnotes">
    <p id="fn1">
            <span class="fn-num">1.</span>
            Aristotle, <em>Physics</em> I.1 (184a10): "We do not think that we know a thing
            until we are acquainted with its primary conditions or first principles, and
            have carried our analysis as far as its simplest elements." The term
            <em>archai</em> recurs throughout the <em>Metaphysics</em> (981b28) as the
            starting points from which all other knowledge is derived.
        </p>
        <p id="fn2">
            <span class="fn-num">2.</span>
            RFC 1738 defined the basic <code>mailto:</code> syntax. RFC 2368 added
            query parameters for subject, body, CC, and BCC. RFC 6068, the current
            standard, added internationalization and IRI compatibility. Jamie Zawinski
            is a named author on both RFC 2368 and RFC 6068.
        </p>
        <p id="fn3">
            <span class="fn-num">3.</span>
            <code>LSSetDefaultHandlerForURLScheme</code> in Apple's LaunchServices
            framework was deprecated in macOS 14.2.1 (Sonoma). As of Tahoe 26.0, the
            only supported method is Mail.app's Settings panel, which requires an
            active account configured in Mail. This Catch-22 has persisted unchanged
            since at least macOS Ventura.
        </p>
        <p id="fn4">
            <span class="fn-num">4.</span>
            See Section 7 ("Security Considerations") of
            <a href="https://datatracker.ietf.org/doc/html/rfc6068#section-8" target="_blank" rel="noopener noreferrer">RFC 6068</a>.
        </p>
        
        
    </div>
</article>

<style>
    /* -- Article layout -- */
    .article {
        padding: var(--space-xl) 0;
    }

    .article-date {
        font-size: 0.8rem;
        color: var(--color-text-muted);
        letter-spacing: 0.03em;
        margin-bottom: var(--space-lg);
    }

    .article-title {
        font-size: 2.4rem;
        font-weight: 600;
        line-height: 1.15;
        letter-spacing: -0.02em;
        margin-bottom: var(--space-md);
    }

    .article-subtitle {
        font-size: 1.15rem;
        font-style: italic;
        color: var(--color-text-muted);
        line-height: 1.5;
        margin-bottom: var(--space-xl);
    }

    .article-subtitle::after {
        content: '';
        display: block;
        width: 40px;
        height: 1px;
        background: var(--color-text-muted);
        margin-top: var(--space-lg);
    }

    /* -- Prose -- */
    .article p {
        margin-bottom: var(--space-lg);
        line-height: 1.75;
    }

    .article h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-top: var(--space-xl);
        margin-bottom: var(--space-md);
        letter-spacing: -0.01em;
        line-height: 1.3;
    }

    .article :global(a) {
        color: var(--color-text);
        text-decoration: solid underline var(--color-link-underline) 2px;
        text-underline-offset: 3px;
        transition: all var(--transition-speed) ease;
    }

    .article :global(a:hover) {
        color: var(--color-link-underline);
        opacity: 0.8;
    }

    /* -- Code -- */
    .article :global(code) {
        font-family: var(--font-mono);
        font-size: 0.85em;
        background: color-mix(in srgb, var(--color-text-muted) 15%, transparent);
        padding: 2px 6px;
        border-radius: 3px;
        color: var(--color-link-underline);
    }

    .code-block {
        background: #1a1a1a;
        color: #d4d4d4;
        font-family: var(--font-mono);
        font-size: 0.85rem;
        line-height: 1.65;
        padding: var(--space-lg);
        border-radius: 6px;
        margin: var(--space-lg) 0;
        overflow-x: auto;
        white-space: pre;
    }

    .code-block :global(code) {
        background: none;
        padding: 0;
        border-radius: 0;
        color: inherit;
        font-size: inherit;
    }

    .code-block .tag { color: #569cd6; }
    .code-block .attr { color: #9cdcfe; }
    .code-block .string { color: #ce9178; }

    /* -- Pullquote -- */
    .pullquote {
        border-left: 3px solid var(--color-link-underline);
        padding: var(--space-xs) 0 var(--space-xs) var(--space-lg);
        margin: var(--space-lg) 0;
        font-style: italic;
        color: var(--color-text-muted);
        font-size: 1rem;
        line-height: 1.65;
    }

    /* -- Diagram -- */
    .diagram-container {
        background: var(--color-bg);
        border-radius: 6px;
        margin: var(--space-lg) 0;
        text-align: center;
    }

    .diagram-container img {
        max-width: 100%;
        height: auto;
    }

    /* -- Footnotes -- */
    .footnotes {
        margin-top: var(--space-xl);
        padding-top: var(--space-lg);
        border-top: 1px solid var(--color-text-muted);
        font-size: 0.9rem;
        color: var(--color-text-muted);
        line-height: 1.65;
    }

    .footnotes p {
        margin-bottom: var(--space-sm);
    }

    .fn-num {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--color-text-muted);
        margin-right: 6px;
    }

    .footnote-ref {
        font-size: 0.75em;
        vertical-align: super;
        color: var(--color-text-muted);
        text-decoration: none;
        margin-left: 1px;
    }

    .footnote-ref:hover {
        color: var(--color-link-underline);
        background-color: transparent;
        padding: 0;
        margin-left: 1px;
        border-radius: 0;
    }

    /* -- Responsive -- */
    @media (max-width: 480px) {
        .article-title { font-size: 1.8rem; }
        .code-block { font-size: 0.75rem; padding: var(--space-md); }
        .diagram { font-size: 0.65rem; padding: var(--space-md); }
        .comparison { grid-template-columns: 1fr; }
    }
</style>