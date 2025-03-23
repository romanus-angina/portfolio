const nextConfig = {
  reactStrictMode: true,
  // Change this from conditional to always use same path structure
  basePath: '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  output: 'export',
  // Add assetPrefix to ensure CSS loads correctly on GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
};

export default nextConfig;