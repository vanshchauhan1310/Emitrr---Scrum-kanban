import type { NextConfig } from 'next';
import { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  webpack: (
    config: Configuration, 
    { isServer }: { isServer: boolean }
  ): Configuration => {
    // Fix Clerk's SWR import issues by aliasing to correct paths
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Point to the actual SWR distribution files
      'swr$': require.resolve('swr'),
      'swr/infinite$': require.resolve('swr/infinite'),
    };

    // Additional fallbacks for problematic imports
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'swr/dist/umd': require.resolve('swr'),
      'swr/dist/cjs': require.resolve('swr'),
      'swr/infinite/dist/umd': require.resolve('swr/infinite'),
      'swr/infinite/dist/cjs': require.resolve('swr/infinite'),
    };

    return config;
  },
  experimental: {
    esmExternals: 'loose' as const // Helps with Clerk's ESM/CJS interop
  },
  typescript: {
    ignoreBuildErrors: false // Re-enable type checking once fixed
  }
};

export default nextConfig;