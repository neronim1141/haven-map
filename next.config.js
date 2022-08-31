/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  publicRuntimeConfig: {
    APP_URL: process.env.NEXT_PUBLIC_PREFIX,
  },
};

module.exports = nextConfig;
