/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    BACKEND_URL: 'https://memomeet-be.onrender.com/api',
    WEBSOCKET_URL: 'https://memomeet-be.onrender.com',
  },
};

export default nextConfig;
