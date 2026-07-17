import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      {
        pathname: "/case-studies-content/**",
      },
      {
        pathname: "/company-logos/**",
        search: "",
      },
      {
        pathname: "/about/**",
        search: "",
      },
    ],
    minimumCacheTTL: 60,
    qualities: [75, 90],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
