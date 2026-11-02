/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@portallink/core',
    '@portallink/crypto',
    '@portallink/discovery',
    '@portallink/pairing',
    '@portallink/protocol',
    '@portallink/transfer',
    '@portallink/transport',
    '@portallink/ui',
  ],
};

export default nextConfig;
