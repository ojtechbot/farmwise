/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // enables static export
  images: { unoptimized: true }, // because Next.js image optimization doesn’t work with static export
};
module.exports = nextConfig;
