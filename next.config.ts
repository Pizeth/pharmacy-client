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
        // hostname: "uiverse.io",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
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

  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
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
