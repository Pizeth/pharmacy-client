import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "local-store.razeth.com",
    "*.local-store.razeth.com",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https", // Or 'http' if applicable
        hostname: "placehold.co",
        port: "", // Leave empty if no specific port
        pathname: "/**", // Allow all paths under this hostname
      },
    ],
  },
};

export default nextConfig;
