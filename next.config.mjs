/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  compiler: {
    // Enable SWC minification for faster builds
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // GitHub Pages configuration - always export as static
  output: 'export',
  basePath: '/katjaglassconsulting.github.io',
  assetPrefix: '/katjaglassconsulting.github.io/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Only set basePath if explicitly provided by GitHub Actions
  ...(process.env.GITHUB_PAGES_BASE_PATH && {
    basePath: process.env.GITHUB_PAGES_BASE_PATH,
    assetPrefix: process.env.GITHUB_PAGES_BASE_PATH,
  }),
};

export default nextConfig;
