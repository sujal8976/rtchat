/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },
};

export default nextConfig;
