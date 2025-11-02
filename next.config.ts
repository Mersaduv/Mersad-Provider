import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: true, // For uploaded images
  },
  serverExternalPackages: ['@prisma/client'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client');
    }
    return config;
  },
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  // Optimize bundle
  swcMinify: true,
  // Enable compression
  compress: true,
};

export default nextConfig;
