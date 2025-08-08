/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Allow ESLint but don't fail build on warnings
    ignoreDuringBuilds: false, // Keep linting enabled
  },
  typescript: {
    // ✅ Keep TypeScript checking enabled
    ignoreBuildErrors: false,
  },
  // ✅ Other recommended settings
  experimental: {
    // Enable if using app directory features
    serverComponentsExternalPackages: ['mongoose'],
  },
  // ✅ Image optimization
  images: {
    domains: [], // Add your image domains here
  },
};

export default nextConfig;