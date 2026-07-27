import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL;
const canonicalOrigin = new URL(process.env.TEST_CANONICAL_URL).origin;
const canonicalUrl = canonicalOrigin + "/";
const indexableValue = process.env.TEST_INDEXABLE;
const urlSource = process.env.TEST_URL_SOURCE;
const isIndexable = indexableValue === "true";

if (
  !baseUrl ||
  !process.env.TEST_CANONICAL_URL ||
  !["true", "false"].includes(indexableValue) ||
  !["custom", "vercel"].includes(urlSource)
) {
  throw new Error("Run this test through scripts/test-production.mjs.");
}

async function fetchRoute(pathname = "/") {
  return fetch(new URL(pathname, baseUrl), {
    headers: { accept: pathname === "/" ? "text/html" : "*/*" },
  });
}

function metaContent(html, name) {
  const pattern = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["'][^>]*>`,
    "i",
  );
  return html.match(pattern)?.[1] ?? "";
}

test("server-renders the landing page with canonical premium metadata", async () => {
  const response = await fetchRoute();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");

  const html = await response.text();
  assert.match(html, /<html[^>]*lang=["']en-US["']/i);
  assert.ok(html.includes("<title>Cinnaminson Interior Painter &amp; Drywall Repair | AG Enterprises</title>"));
  assert.ok(html.includes("Andrew handles interior painting, drywall repair, skim coating"));
  assert.ok(html.includes('rel="canonical" href="' + canonicalOrigin + '"'));
  assert.ok(html.includes('property="og:url" content="' + canonicalOrigin + '"'));
  assert.ok(html.includes("https://www.instagram.com/ag_enterprises_painting/"));
  assert.ok(html.includes("og-v3.jpg"));
  assert.ok(html.includes("That wall has a story."));
  assert.ok(html.includes("a better ending."));
  assert.doesNotMatch(html, /localhost|chatgpt\.site|Your site is taking shape|Starter Project/i);

  if (urlSource === "custom") {
    assert.doesNotMatch(html, /vercel\.app/i);
  } else {
    assert.match(canonicalOrigin, /\.vercel\.app$/i);
  }

  const h1Matches = html.match(/<h1\b/gi) ?? [];
  assert.equal(h1Matches.length, 1);

  const imageTags = html.match(/<img\b[^>]*>/gi) ?? [];
  assert.ok(imageTags.length >= 9);
  for (const image of imageTags) {
    assert.match(image, /\balt="[^"]+"/i);
    assert.match(image, /\bwidth="\d+"/i);
    assert.match(image, /\bheight="\d+"/i);
  }
  assert.equal(imageTags.filter((image) => /fetchPriority="high"/i.test(image)).length, 1);
});

test("emits truthful HousePainter structured data", async () => {
  const html = await (await fetchRoute()).text();
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(match, "JSON-LD script should be server-rendered");
  const graph = JSON.parse(match[1])["@graph"];
  assert.ok(Array.isArray(graph));

  const types = graph.map((node) => node["@type"]);
  assert.ok(types.includes("WebSite"));
  assert.ok(types.includes("WebPage"));
  assert.ok(types.includes("HousePainter"));

  const business = graph.find((node) => node["@type"] === "HousePainter");
  assert.equal(business.url, canonicalUrl);
  assert.equal(business.address.addressLocality, "Cinnaminson");
  assert.equal(business.hasOfferCatalog.itemListElement.length, 4);
  assert.deepEqual(business.sameAs, ["https://www.instagram.com/ag_enterprises_painting/"]);
  assert.doesNotMatch(JSON.stringify(business), /"(?:aggregateRating|review|telephone|streetAddress|licensed|insured)"\s*:/i);
});

test("serves canonical discovery files with mode-safe crawl rules", async () => {
  const robotsResponse = await fetchRoute("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  assert.match(robotsResponse.headers.get("content-type") ?? "", /^text\/plain\b/i);
  const robots = await robotsResponse.text();
  assert.match(robots, /User-Agent: \*/i);
  assert.ok(robots.includes("Sitemap: " + canonicalUrl + "sitemap.xml"));

  if (isIndexable) {
    assert.match(robots, /Allow: \//i);
    assert.doesNotMatch(robots, /Disallow: \//i);
  } else {
    assert.match(robots, /Disallow: \//i);
  }

  const sitemapResponse = await fetchRoute("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /xml/i);
  const sitemap = await sitemapResponse.text();
  assert.ok(sitemap.includes("<loc>" + canonicalUrl + "</loc>"));
  assert.ok(sitemap.includes(canonicalUrl + "work/exterior-column.jpg"));
  assert.doesNotMatch(sitemap, /localhost|chatgpt\.site/i);
  if (urlSource === "custom") {
    assert.doesNotMatch(sitemap, /vercel\.app/i);
  }

  const manifestResponse = await fetchRoute("/manifest.webmanifest");
  assert.equal(manifestResponse.status, 200);
  assert.match(manifestResponse.headers.get("content-type") ?? "", /manifest|json/i);
  const manifest = await manifestResponse.json();
  assert.equal(manifest.name, "AG Enterprises Painting");
  assert.deepEqual(manifest.icons.map((icon) => icon.sizes), ["192x192", "512x512"]);
});

test("indexing follows the explicit deployment safety setting", async () => {
  const response = await fetchRoute();
  const html = await response.text();
  const robots = metaContent(html, "robots");

  if (isIndexable) {
    assert.match(robots, /index/i);
    assert.match(robots, /follow/i);
    assert.doesNotMatch(robots, /noindex|nofollow/i);
    assert.equal(response.headers.get("x-robots-tag"), null);
  } else {
    assert.match(robots, /noindex/i);
    assert.match(robots, /nofollow/i);
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
  }
});

test("optimizes local project photography through the Next Image pipeline", async () => {
  const response = await fetchRoute(
    "/_next/image?url=%2Fwork%2Fexterior-column.jpg&w=640&q=75",
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^image\/(avif|webp|jpeg|jpg)\b/i);
  assert.ok((await response.arrayBuffer()).byteLength > 1_000);
});

test("keeps assets, palette, motion safety, and contact path intact", async () => {
  const [page, css, layout, packageJson, nextConfig, envExample, socialImageStat] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
    stat(new URL("../public/og-v3.jpg", import.meta.url)),
  ]);

  await Promise.all([
    "public/work/exterior-column.jpg",
    "public/work/kitchen-reset-v3.webp",
    "public/work/blue-wall-finish.webp",
    "public/work/clubhouse-walls-v2.webp",
    "public/work/careful-prep.jpg",
    "public/work/room-finish.jpg",
    "public/og-v3.jpg",
    "public/apple-touch-icon.png",
    "public/icon-192.png",
    "public/icon-512.png",
  ].map((path) => access(new URL("../" + path, import.meta.url))));

  assert.ok(page.includes('aria-labelledby="hero-heading"'));
  assert.ok(page.includes("prefers-reduced-motion: reduce"));
  assert.ok(page.includes("project-note-"));
  assert.ok(page.includes("You do not need to diagnose the wall"));
  assert.ok(page.includes("--roller-offset"));
  assert.ok(page.includes("ResizeObserver"));
  assert.ok(page.includes('typeof window.IntersectionObserver !== "function"'));
  assert.ok(page.includes('from "next/image"'));
  assert.doesNotMatch(page, /data-process-step={index} data-reveal/);
  assert.doesNotMatch(page, /className="process-intro" data-reveal/);
  assert.doesNotMatch(page, /tel:|mailto:|five-star|licensed|insured/i);

  assert.ok(css.includes("--cream: #fff5e5"));
  assert.ok(css.includes("--navy: #153046"));
  assert.ok(css.includes("--pine: #123d35"));
  assert.ok(css.includes("--coral: #ff6737"));
  assert.ok(css.includes("prefers-reduced-motion: reduce"));
  assert.ok(css.includes("@supports (animation-timeline: scroll())"));
  assert.ok(css.includes("translate: 0 24px"));
  assert.ok(css.includes(".motion-ready .process-section .process-step"));
  assert.match(css, /\.process-step\s*\{[\s\S]*?opacity:\s*1;/);
  assert.ok(css.includes("safe-area-inset-bottom"));

  assert.ok(layout.includes("HousePainter"));
  assert.ok(layout.includes("IS_INDEXABLE"));
  assert.ok(socialImageStat.size < 300_000);
  assert.doesNotMatch(packageJson, /vinext|wrangler|cloudflare|drizzle|react-loading-skeleton/i);
  assert.match(packageJson, /"build": "next build"/);
  assert.match(nextConfig, /X-Robots-Tag/);
  assert.match(envExample, /SITE_URL=https:\/\/your-purchased-domain\.com/);
  assert.match(envExample, /SEO_INDEXING_ENABLED=false/);

  await Promise.all([
    "../.openai/hosting.json",
    "../vite.config.ts",
    "../worker/index.ts",
    "../build/sites-vite-plugin.ts",
    "../app/_sites-preview",
  ].map((path) => assert.rejects(access(new URL(path, import.meta.url)))));
});
