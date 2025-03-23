/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Configure for GitHub Pages
    basePath: '',
    trailingSlash: true,
    images: {
      unoptimized: true, // Required for static export
    },
    // For GitHub Pages deployment
    output: 'export',
  };
  
  export default nextConfig;