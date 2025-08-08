/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint during build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TypeScript errors during build for deployment
  },
  serverExternalPackages: ['mongoose'],
  images: {
    domains: [],
  },
};

export default nextConfig;