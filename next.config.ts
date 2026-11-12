import type { NextConfig } from "next";

// Static export: the whole site is plain HTML/JS files that Cloudflare Pages
// serves for free. No server needed.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
