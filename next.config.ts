import "./src/configs/envConfig";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   appDir: true,
  // },
  env: {
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  },
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
        hostname: "uiverse.io",
        port: "", // Leave empty if no specific port
        pathname: "/**", // Allow all paths under this hostname
        search: "",
      },
    ],
  },
  async rewrites() {
    return [
      // Proxy API calls to your NestJS backend during development
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/v1/:path*`,
      },
    ];
  },
};

// module.exports = {
//   allowedDevOrigins: [
//     "local-origin.dev",
//     "*.local-origin.dev",
//     "local-store.razeth.com",
//     "*.local-store.razeth.com",
//   ],
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https", // Or 'http' if applicable
//         hostname: "placehold.co",
//         port: "", // Leave empty if no specific port
//         pathname: "/**", // Allow all paths under this hostname
//       },
//     ],
//   },
// };

module.exports = nextConfig;

export default nextConfig;
