import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // dev server only: lets you open the site via 127.0.0.1 as well as localhost
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      // album art from Apple's iTunes API (is1-ssl.mzstatic.com ... is5-ssl.mzstatic.com)
      { protocol: "https", hostname: "**.mzstatic.com", pathname: "/image/**" },
      // collection posters (see src/lib/media.ts)
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/**" },
      { protocol: "https", hostname: "s4.anilist.co", pathname: "/file/**" },
      { protocol: "https", hostname: "static.tvmaze.com", pathname: "/uploads/**" },
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" },
    ],
  },
};

export default nextConfig;
