import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The home page requests quality 90 to match the source encodes.
    // Declaring it is optional in 15.x but required from Next 16.
    qualities: [90],
  },
};

export default nextConfig;
