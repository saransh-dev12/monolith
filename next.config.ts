import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev-tools badge floats over the sidebar footer and intercepts
  // pointer events, so Playwright cannot click the account menu in dev
  // mode. Error overlays are unaffected.
  devIndicators: false,
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
