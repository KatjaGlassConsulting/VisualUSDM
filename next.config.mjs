/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  compiler: {
    // Enable SWC minification for faster builds
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Configure static file serving
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  trailingSlash: false,
}

export default nextConfig
