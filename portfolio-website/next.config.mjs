/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Configure for GitHub Pages
    basePath: process.env.NODE_ENV === 'production' ? '/portfolio-website' : '',
    trailingSlash: true,
    images: {
      unoptimized: true, // Required for static export
    },
    // For GitHub Pages deployment
    output: 'export',
  };
  
  export default nextConfig;