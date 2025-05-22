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
};

export default nextConfig;
