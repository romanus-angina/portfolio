# [romanusangina.com](https://romanusangina.com)

My personal portfolio website built with SvelteKit and hosted on Vercel.

## Forking this repo (please read!)

Yes, you can fork this repo. Please give me proper credit by linking back to [romanusangina.com](https://romanusangina.com). Thanks!

I value keeping my site open source, but plagiarism is bad. It's always disheartening whenever I find that someone has copied my site without giving me credit. I spent a non-trivial amount of effort building and designing this website, and I am proud of it! All I ask is that you don't claim this effort as your own.

Please also note that I did not build this site with the intention of it being a starter theme, so if you have questions about implementation, please refer to the [SvelteKit docs](https://svelte.dev/docs/kit/introduction).

## About the Image Masking Technique

This site uses a CSS masking trick to display images with theme-aware coloring. Instead of serving full-color images, I use dithered, transparent PNGs as mask images. The actual color comes from CSS custom properties, which means images automatically adapt to the current theme without needing multiple image variants.

```css
.image {
    background-color: var(--color-image);
    -webkit-mask-image: url('/path/to/dithered-image.png');
    mask-image: url('/path/to/dithered-image.png');
    mask-size: cover;
}
```

This approach keeps the site lightweight since dithered images with transparency compress well, and the color palette can be controlled entirely through CSS.

### If you want to use your own images

The process is manual but straightforward:

1. **Resize your images**
   - Hover images: 600 x 600 pixels
   - Footer images: 1344 x 400 pixels
   - Tool: [imageresizer.com](https://imageresizer.com/)

1. **Remove the background** (optional)
   - Tool: [Pixelcut AI Background Remover](https://www.pixelcut.ai/ai-image-editor?tool=removeBackground)
   - Note: AI background removal can sometimes remove parts of the image you want to keep. You may need to manually mask certain areas. This step is completely optional if you want full-sized images to show up.

1. **Dither the image**
   - Tool: [Dither Me This](https://doodad.dev/dither-me-this/)
   - Use `#000000` (black) as one of the colors in your palette
   - The other color can be whatever you want (I used `#ffffff` white)

1. **Remove one color to create transparency**
   - Tool: [Remove Color from Image](https://imgonline.tools/remove-color)
   - Remove the black (`#000000`) to create the transparent mask

I wanted this site to be lightweight, which is why I chose Svelte and accepted the manual image processing workflow. The performance gains are worth the extra effort. I'll likely build an in-project dithering tool in the future to streamline this.

## Installation and Setup

1. Clone the repository

```bash
git clone https://github.com/romanus-angina/portfolio.git
cd portfolio
```

1. Install dependencies

```bash
npm install
```

1. Start the development server

```bash
npm run dev
```

## Building for Production

1. Generate a production build

```bash
npm run build
```

1. Preview the production build locally

```bash
npm run preview
```

## Deployment

This site is configured for deployment on Vercel. Push to your main branch and Vercel will handle the rest, or run:

```bash
vercel
```

## Color Reference

| Color | Light Theme | Dark Theme |
| ----- | ----------- | ---------- |
| Background | `#ffffff` | `#0a0a0a` |
| Text | `#1a1a1a` | `#f0f0f0` |
| Text Muted | `#555555` | `#999999` |
| Accent | `#84161f` | `#22B464` |
| Image Tint | `#991925` | `#6ae4a3` |
