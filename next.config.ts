import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent @supabase/ssr from being bundled — avoids module resolution issues on Vercel
  serverExternalPackages: ['@supabase/ssr'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
