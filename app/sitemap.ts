import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-config";

const lastSignificantUpdate = new Date("2026-07-25T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL + "/",
      lastModified: lastSignificantUpdate,
      changeFrequency: "monthly",
      priority: 1,
      images: [
        SITE_URL + "/work/exterior-column.jpg",
        SITE_URL + "/work/kitchen-reset-v3.webp",
        SITE_URL + "/work/blue-wall-finish.webp",
        SITE_URL + "/work/room-finish.jpg",
        SITE_URL + "/work/careful-prep.jpg",
        SITE_URL + "/work/clubhouse-walls-v2.webp",
      ],
    },
  ];
}
