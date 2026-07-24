import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", String(process.pid) + "-" + Date.now());
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html", host: "localhost" },
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

test("server-renders the AG Enterprises Painting landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang=["']en["']/i);
  assert.ok(html.includes("<title>Cinnaminson Interior Painting &amp; Drywall Repair | AG Enterprises</title>"));
  assert.ok(html.includes("AG Enterprises Painting handles interior painting, drywall repair, skim coating, and wallpaper removal"));
  assert.ok(html.includes("Small repairs."));
  assert.ok(html.includes("Big fresh-room energy."));
  assert.ok(html.includes("https://www.instagram.com/ag_enterprises_painting/"));
  assert.ok(html.includes("og.png"));
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton|Starter Project/i);
});

test("keeps production assets, palette, motion, and contact path intact", async () => {
  const [page, css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  await Promise.all([
    "public/work/exterior-column.jpg",
    "public/work/kitchen-reset.jpg",
    "public/work/careful-prep.jpg",
    "public/work/room-finish.jpg",
    "public/og.png",
  ].map((path) => access(new URL("../" + path, import.meta.url))));

  assert.ok(page.includes('aria-labelledby="hero-heading"'));
  assert.ok(page.includes("prefers-reduced-motion: reduce"));
  assert.ok(page.includes("project-note-"));
  assert.ok(page.includes("Instagram is the verified contact channel"));
  assert.doesNotMatch(page, /tel:|mailto:|five-star|licensed|insured/i);

  assert.ok(css.includes("--cream: #fff5e5"));
  assert.ok(css.includes("--navy: #153046"));
  assert.ok(css.includes("--pine: #123d35"));
  assert.ok(css.includes("--coral: #ff6737"));
  assert.ok(css.includes("prefers-reduced-motion: reduce"));
  assert.ok(css.includes("animation-timeline: scroll"));

  assert.ok(layout.includes("Cinnaminson Interior Painting & Drywall Repair"));
  assert.ok(layout.includes("max-image-preview"));
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
