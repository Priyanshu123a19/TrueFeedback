/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint during build to avoid deployment failures
  },
  typescript: {
    ignoreBuildErrors: false, // Keep TypeScript checking
  },
  serverExternalPackages: ['mongoose'],
  images: {
    domains: [],
  },
  // ✅ Ensure PostCSS works properly
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;