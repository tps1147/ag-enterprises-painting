import type { MetadataRoute } from "next";
import { IS_INDEXABLE, SITE_URL } from "./site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: IS_INDEXABLE
      ? {
          userAgent: "*",
          allow: "/",
        }
      : {
          userAgent: "*",
          disallow: "/",
        },
    sitemap: SITE_URL + "/sitemap.xml",
    host: SITE_URL,
  };
}
