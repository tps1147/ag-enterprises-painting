function normalizeSiteUrl(value: string | undefined): string {
  if (!value) {
    if (process.env.VERCEL === "1") {
      throw new Error(
        "SITE_URL is required on Vercel. Set it to the purchased canonical domain in Production and Preview.",
      );
    }

    return "http://localhost:3000";
  }

  const input = value.trim();
  const parsed = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`);
  const isLocalhost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";

  if (!isLocalhost && parsed.protocol !== "https:") {
    throw new Error("SITE_URL must use HTTPS.");
  }

  if (
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    (parsed.pathname !== "/" && parsed.pathname !== "")
  ) {
    throw new Error("SITE_URL must be a bare origin without credentials, a path, query, or hash.");
  }

  return parsed.origin;
}

export const SITE_URL = normalizeSiteUrl(process.env.SITE_URL);
export const IS_INDEXABLE =
  process.env.SEO_INDEXING_ENABLED === "true" && process.env.VERCEL_ENV === "production";
export const SITE_NAME = "AG Enterprises Painting";
export const INSTAGRAM_URL = "https://www.instagram.com/ag_enterprises_painting/";

export const PAGE_TITLE = "Cinnaminson Interior Painter & Drywall Repair | AG Enterprises";
export const PAGE_DESCRIPTION =
  "Andrew handles interior painting, drywall repair, skim coating, and wallpaper removal in Cinnaminson and nearby South Jersey. Small projects welcome.";
