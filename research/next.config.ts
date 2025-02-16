/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.csc.ncsu.edu",
        pathname: "/directories/photos/**",
      },
    ],
  },
};

module.exports = nextConfig;
