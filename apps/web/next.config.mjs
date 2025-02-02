/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.AWS_S3_HOSTNAME_NAME || 'rtchat-web-bucket.s3.ap-south-1.amazonaws.com',
        pathname: "/*",
      },
    ],
  },
};

export default nextConfig;
