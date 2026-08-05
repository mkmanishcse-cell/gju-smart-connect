import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GJU Smart Connect",
    short_name: "GJU",
    description:
  "GJU Smart Connect is a modern academic platform connecting students, teachers and administration through one secure system.",
    start_url: "/",

    display: "standalone",

    background_color: "#ffffff",

    theme_color: "#2563eb",

    orientation: "portrait",

    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },

      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}