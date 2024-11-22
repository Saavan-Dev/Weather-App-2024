/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.weatherapi.com",
        port: "", // Leave empty if not using a specific port
        pathname: "/**", // Match all paths under this domain
      },
    ],
  },
};

export default nextConfig;
