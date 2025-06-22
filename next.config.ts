import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false
  },
  webpack: (config, { isServer }) => {
    // Handle lightningcss native binary issue
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    // Handle the lightningcss.linux-x64-gnu.node issue
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'lightningcss': false,
      };
    }

    return config;
  },
  experimental: {
    esmExternals: 'loose'
  }
};

export default nextConfig;