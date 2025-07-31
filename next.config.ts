import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  // Ensure proper URL handling in production
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://after-dark-website.vercel.app' : '',
  basePath: '',
  // Enable trailing slashes for better URL handling
  trailingSlash: false,
  // Ensure proper redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
