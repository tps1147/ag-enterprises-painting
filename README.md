# AG Enterprises Painting

Production website for AG Enterprises Painting, a neighbor-run painting and wall-repair company based in Cinnaminson, New Jersey. The app is a native Next.js project prepared for Vercel's GitHub integration.

## What the site includes

- Interior painting, drywall and Sheetrock repair, skim coating, and wallpaper-removal services
- Real project photography sourced from the company's public Instagram posts
- Responsive, accessible interactions and reduced-motion support
- Local-search metadata for Cinnaminson and nearby South Jersey
- Canonical metadata, XML sitemap, robots rules, social sharing, and truthful HousePainter structured data
- Fail-closed indexing protection for preview deployments

## Local development

Requires Node.js 22.x.

```bash
npm install
npm run dev
```

Local development falls back to `http://localhost:3000`. To test production metadata locally, copy `.env.example` to `.env.local` and set `SITE_URL` to the intended origin.

## Validation

```bash
npm run check
npm run audit:production
```

The check runs ESLint, TypeScript, two native Next.js production builds, and HTTP-level tests for both indexable production behavior and non-indexable preview behavior. The production audit excludes development-only lint tooling and must report zero runtime vulnerabilities.

## Vercel setup

1. Import the connected GitHub repository into Vercel and keep the detected **Next.js** framework preset. Leave Build Command, Output Directory, and Install Command at their defaults.
2. Set the project's Node.js version to **22.x**.
3. Add `SITE_URL=https://your-purchased-domain.com` to both **Production** and **Preview** environments. Use the final canonical host (apex or `www`) and do not include a path.
4. Keep `SEO_INDEXING_ENABLED=false` for Preview. Keep it false for the first Production deployment until the custom domain is attached and verified.
5. Add the purchased domain in Vercel, choose the canonical host, and configure the other host to redirect to it.
6. Set `SEO_INDEXING_ENABLED=true` in Production and trigger a fresh Production deployment from the production branch. Do not promote a preview artifact, because it was intentionally built with no-index settings.

`SITE_URL` is required whenever Vercel builds the project. This prevents an accidental `vercel.app` or obsolete hosting URL from becoming the canonical URL.

## Main files

- `app/page.tsx` — content, project data, and interactions
- `app/globals.css` — design tokens, layout, and motion system
- `app/layout.tsx` — SEO, social sharing, and structured data
- `app/site-config.ts` — canonical-domain and indexing configuration
- `next.config.ts` — native Next.js and response-security headers
- `public/work/` — selected real project photography
- `scripts/test-production.mjs` — production/preview deployment verification
