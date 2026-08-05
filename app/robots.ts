import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://gjusmartconnect.online/sitemap.xml",
    host: "https://gjusmartconnect.online",
  };
}