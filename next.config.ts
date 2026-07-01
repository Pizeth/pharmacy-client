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
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
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
        // hostname: "uiverse.io",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        port: "", // Leave empty if no specific port
        pathname: "/**", // Allow all paths under this hostname
        search: "",
      },
    ],
  },
  transpilePackages: [
    "@refinedev/core",
    "@refinedev/nextjs-router",
    "@refinedev/nestjsx-crud",
  ],
  async rewrites() {
    return [
      // Proxy API calls to your NestJS backend during development
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL!}*`,
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

// module.exports = nextConfig;

export default nextConfig;
