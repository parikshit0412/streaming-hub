//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/watchlist',
  images: { unoptimized: true }
};

module.exports = nextConfig;
