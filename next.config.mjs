/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.weatherapi.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    // Ignore system files that cause EINVAL errors
    config.watchOptions = {
      ignored: [
        'C:/DumpStack.log.tmp',
        'C:/hiberfil.sys',
        'C:/pagefile.sys',
        'C:/swapfile.sys'
      ]
    };
    return config;
  },
};

export default nextConfig;
