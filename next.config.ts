import type { NextConfig } from "next";
import withPWA from "next-pwa";

const config: NextConfig = {
  // existing config
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(config);
