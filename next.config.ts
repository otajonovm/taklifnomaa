import type {NextConfig} from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['motion', '@splinetool/react-spline', '@splinetool/runtime'],
  // ESM-only package: webpack needs an explicit file path (no "require"/"default" export)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@splinetool/react-spline': path.resolve(
        process.cwd(),
        'node_modules/@splinetool/react-spline/dist/react-spline.js'
      ),
    };
    return config;
  },
};

export default nextConfig;
