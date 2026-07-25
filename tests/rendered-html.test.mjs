import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const canonicalUrl = "https://ag-enterprises-painting.create851050.chatgpt.site/";

async function fetchRoute(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", String(process.pid) + "-" + Date.now() + "-" + pathname);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(new URL(pathname, "http://localhost/"), {
      headers: { accept: pathname === "/" ? "text/html" : "*/*", host: "localhost" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the landing page with stable premium metadata", async () => {
  const response = await fetchRoute();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang=["']en-US["']/i);
  assert.ok(html.includes("<title>Cinnaminson Interior Painter &amp; Drywall Repair | AG Enterprises</title>"));
  assert.ok(html.includes("Andrew handles interior painting, drywall repair, skim coating"));
  assert.ok(html.includes('rel="canonical" href="' + canonicalUrl + '"'));
  assert.ok(html.includes('property="og:url" content="' + canonicalUrl + '"'));
  assert.ok(html.includes("https://www.instagram.com/ag_enterprises_painting/"));
  assert.ok(html.includes("og-v3.jpg"));
  assert.ok(html.includes("That wall has a story."));
  assert.ok(html.includes("a better ending."));
  assert.doesNotMatch(html, /localhost|Your site is taking shape|react-loading-skeleton|Starter Project/i);

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
  assert.doesNotMatch(JSON.stringify(business), /aggregateRating|review|telephone|streetAddress|licensed|insured/i);
});

test("serves canonical crawl discovery files", async () => {
  const robotsResponse = await fetchRoute("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  assert.match(robotsResponse.headers.get("content-type") ?? "", /^text\/plain\b/i);
  const robots = await robotsResponse.text();
  assert.match(robots, /User-Agent: \*/i);
  assert.match(robots, /Allow: \//i);
  assert.ok(robots.includes("Sitemap: " + canonicalUrl + "sitemap.xml"));

  const sitemapResponse = await fetchRoute("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /xml/i);
  const sitemap = await sitemapResponse.text();
  assert.ok(sitemap.includes("<loc>" + canonicalUrl + "</loc>"));
  assert.ok(sitemap.includes(canonicalUrl + "work/exterior-column.jpg"));
  assert.doesNotMatch(sitemap, /localhost|preview/i);
  const manifestResponse = await fetchRoute("/manifest.webmanifest");
  assert.equal(manifestResponse.status, 200);
  assert.match(manifestResponse.headers.get("content-type") ?? "", /manifest|json/i);
  const manifest = await manifestResponse.json();
  assert.equal(manifest.name, "AG Enterprises Painting");
  assert.deepEqual(manifest.icons.map((icon) => icon.sizes), ["192x192", "512x512"]);
});

test("keeps assets, palette, motion safety, and contact path intact", async () => {
  const [page, css, layout, packageJson, socialImageStat] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
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
  assert.ok(layout.includes("max-image-preview"));
  assert.ok(socialImageStat.size < 300_000);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
