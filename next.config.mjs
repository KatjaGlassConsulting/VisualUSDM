/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  compiler: {
    // Enable SWC minification for faster builds
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // GitHub Pages configuration
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Configure base path for GitHub Pages (will be set automatically by actions/configure-pages)
  assetPrefix:
    process.env.NODE_ENV === 'production'
      ? process.env.GITHUB_PAGES_BASE_PATH || ''
      : '',
  basePath:
    process.env.NODE_ENV === 'production'
      ? process.env.GITHUB_PAGES_BASE_PATH || ''
      : '',
};

export default nextConfig;
