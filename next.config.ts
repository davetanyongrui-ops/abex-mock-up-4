import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.cranepumps.com',
      },
      {
        protocol: 'https',
        hostname: 'paragonpump.com',
      },
      {
        protocol: 'https',
        hostname: 'www.paragonpumpasia.com',
      },
      {
        protocol: 'https',
        hostname: 'pumpagents.com',
      },
      {
        protocol: 'https',
        hostname: 'abex-with-cart.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'jkdxmcjtvzvqeeywfpul.supabase.co',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
