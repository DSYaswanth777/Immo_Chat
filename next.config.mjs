/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,          // Helps catch React issues early
  swcMinify: true,                // Faster minification
  output: 'standalone',           // Makes Next.js output a standalone server build
  compiler: {
    // Optional: styled-components or emotion if used
    styledComponents: true,
  },
  images: {
    domains: ['https://immochat.it/'], // Add external domains if you use next/image
  },
  experimental: {
    appDir: true,                // If you use the /app directory
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' }, // Prevent old pages being cached
        ],
      },
    ];
  },
};

export default nextConfig;
