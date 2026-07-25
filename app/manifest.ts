import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AG Enterprises Painting",
    short_name: "AG Painting",
    description: "Interior painting and wall repair in Cinnaminson and nearby South Jersey.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffbf4",
    theme_color: "#ff6737",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
