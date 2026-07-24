# AG Enterprises Painting

Production website for AG Enterprises Painting, a neighbor-run painting and wall-repair company based in Cinnaminson, New Jersey.

## What the site includes

- Interior painting, drywall and Sheetrock repair, skim coating, and wallpaper-removal service pages
- Real project photography sourced from the company’s public Instagram posts
- Responsive, accessible interactions and reduced-motion support
- Local-search metadata for Cinnaminson and nearby South Jersey
- A verified Instagram contact path without placeholder phone numbers, email addresses, ratings, or licensing claims
- A 1200 × 630 social-sharing card and lightweight PNG favicon

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm test
```

`npm test` builds the vinext production worker and verifies the rendered page, SEO copy, project assets, palette, accessibility hooks, and motion fallbacks.

## Main files

- `app/page.tsx` — content, project data, and interactions
- `app/globals.css` — design tokens, layout, and motion system
- `app/layout.tsx` — SEO, social-sharing, and crawler metadata
- `public/work/` — selected real project photography
- `.openai/hosting.json` — Sites project and resource bindings
