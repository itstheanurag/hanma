# Hanma SEO Build Scripts

Generates static, SEO-optimized pages for the Hanma snippet library. The output is written into the same directory as the Vite build so the SPA and the generated pages deploy together.

## Commands

Run from the repository root:

```bash
# Generate only the SEO pages. Requires apps/web/dist to already exist.
pnpm build:seo

# Full deployable build:
# 1. generate registry/docs files
# 2. build the SPA with Turbo
# 3. generate SEO pages into apps/web/dist
pnpm build
```

The SEO build does not wipe `apps/web/dist`; it only clears the directories and files it owns:

- `framework/`, `snippet/`, `use-case/`, `compare/`, `guide/`, `tag/`, `search/`, `pattern/`
- `sitemap.xml`, `robots.txt`, `llms.txt`, `build-stats.json`

If `apps/web/dist/index.html` is missing, the build still runs but prints a warning because the result is not a complete deployment.

## Architecture

```
apps/web/scripts/seo-build/
├── index.ts              # Build orchestrator, sitemap, robots, stats
├── paths.ts              # Location-independent filesystem paths
├── constant.ts           # Canonical site URL
├── types.ts              # Shared TypeScript types
├── utils/
│   ├── content-loader.ts # Loads docs JSON and snippet sources
│   ├── seo-metadata.ts   # Titles, descriptions, canonicals, JSON-LD
│   ├── html-templates.ts # HTML head, footer, and page components
│   └── og-image.ts       # Renders social cards with Satori + resvg
└── generators/
    ├── framework-pages.ts
    ├── framework-index.ts
    ├── category-pages.ts
    ├── snippet-pages.ts
    ├── use-case-pages.ts
    ├── comparison-pages.ts
    ├── tutorial-pages.ts
    ├── tag-pages.ts
    ├── search-pages.ts
    ├── pattern-pages.ts
    └── og-images.ts
```

All paths are resolved from `paths.ts`, so the build works regardless of the current working directory.

## Page Types

| Page type       | URL pattern                              | Source                               |
| --------------- | ---------------------------------------- | ------------------------------------ |
| Framework       | `/framework/:framework`                  | Framework definitions                |
| Framework index | `/framework`                             | Framework definitions                |
| Category        | `/framework/:framework/:category`        | Framework category JSON              |
| Snippet         | `/snippet/:framework/:category/:snippet` | Snippet registry and source          |
| Use case        | `/use-case/:framework/:use-case`         | Snippet purpose and features         |
| Comparison      | `/compare/:framework-vs-framework`       | Framework pairs                      |
| Tutorial        | `/guide/:framework-topic`                | Tutorial topics and related snippets |
| Tag             | `/tag/:framework/:tag`                   | Snippet tags                         |
| Search          | `/search/:query`                         | Search query list                    |
| Pattern         | `/pattern/:framework-pattern`            | Design patterns                      |

Counts depend on the current docs content. `build-stats.json` records the pages produced by the latest run.

## Output

```text
apps/web/dist/
├── index.html
├── assets/
├── framework/express.html
├── framework/express/libs.html
├── snippet/express/libs/express-server.html
├── compare/express-js-vs-hono.html
├── guide/express-setup-project.html
├── tag/express/authentication.html
├── pattern/express-repository-pattern.html
├── sitemap.xml
├── robots.txt
├── llms.txt
├── og/
│   ├── home.png
│   ├── framework/express.png
│   └── snippet/express/libs/express-server.png
├── og-image.png
├── twitter-image.png
├── favicon.svg
├── favicon.png
├── favicon.ico
└── styles.css
```

Generated pages use extensionless canonical URLs such as `/framework/express`. Static hosts including Cloudflare Pages serve `framework/express.html` for that path automatically.

## SEO Rules

- Every page gets a canonical URL from `generateMetadata`.
- `sitemap.xml` is built from canonical URLs only. It excludes pages marked `noindex` and includes the homepage.
- Search result pages are generated but marked `noindex, nofollow`.
- Tag pages with no matching snippets are skipped instead of being published as thin content.
- Pattern pages with no related snippets are marked `noindex`.
- Titles and descriptions use display names from the content data, not raw slugs.
- Every indexable page gets a unique 1200x630 social card under `/og`, generated at build time with Satori and resvg. Noindex pages reuse the homepage card.
- Open Graph and Twitter tags point to the per-page card, with the static `og-image.png` and `twitter-image.png` kept as fallbacks.
- JSON-LD is serialized with `JSON.stringify` and each document is emitted in its own script tag.
- `robots.txt` allows the SPA and keeps `/docs/` and `/builder/` out of the crawl path until they have route-level metadata.

## Answer and Generative Engine Optimization

- `llms.txt` is generated with a concise project summary, canonical resource links, frameworks, categories, and CLI commands.
- Any page that renders the shared FAQ section automatically emits `FAQPage` structured data. Questions and answers are extracted from the generated markup, so generators do not duplicate content.
- Pages with FAQs also keep visible answers in the HTML rather than hiding them behind client-side state.
- Canonical URLs, breadcrumbs, and `SoftwareSourceCode` / `CollectionPage` schema remain the source of truth for citations.
- AI crawlers follow the same `robots.txt` rules as other crawlers. `/docs/` remains excluded until docs routes are prerendered with their own metadata.

## Social Cards

Each indexable page gets its own Open Graph and Twitter image:

- Canonical `/framework/express` maps to `/og/framework/express.png`.
- The homepage maps to `/og/home.png`.
- Cards are rendered at build time with Satori (HTML/CSS to SVG) and `@resvg/resvg-js` (SVG to PNG). No headless browser is used.
- `assets/fonts` contains the Inter WOFF files used by Satori. They are licensed under the SIL Open Font License; see `assets/fonts/OFL.txt`.
- Search and other `noindex` pages reuse `/og/home.png`, so the number of cards matches the number of indexable pages.

Adding a new page type only requires calling `generateMetadata`; the image URL and card are derived from the canonical URL automatically.

## Deployment

Use these Cloudflare Pages settings:

| Setting                | Value           |
| ---------------------- | --------------- |
| Framework preset       | None            |
| Build command          | `pnpm build`    |
| Build output directory | `apps/web/dist` |
| Root directory         | repository root |

Environment variables:

| Variable       | Value   |
| -------------- | ------- |
| `NODE_VERSION` | `22`    |
| `PNPM_VERSION` | `9.0.0` |

`apps/web/public/_redirects` provides the SPA fallback. Cloudflare Pages serves existing static files before applying it, so generated pages keep their own URLs.

## Custom Domain

The canonical URL is defined in `constant.ts`, and absolute image/canonical URLs for the SPA are in `apps/web/index.html`. Update both when the production domain changes.

## Adding a Generator

1. Use `DIST_DIR` from `../paths.js` as the output root.
2. Build metadata with `generateMetadata` and pass display names through `additionalData`.
3. Return `GeneratedPage` objects containing the filesystem path, HTML, and metadata.
4. Register the generator in `index.ts` and add its stats to the build summary.

Page files are written by each generator. The orchestrator only generates the sitemap, robots file, and build stats.
