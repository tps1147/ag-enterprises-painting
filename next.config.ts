import type { NextConfig } from "next";

const isIndexable =
  process.env.SEO_INDEXING_ENABLED === "true" && process.env.VERCEL_ENV === "production";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    const securityHeaders = [
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];

    if (!isIndexable) {
      securityHeaders.push({
        key: "X-Robots-Tag",
        value: "noindex, nofollow, noarchive",
      });
    }

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
