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
- `sitemap.xml`, `robots.txt`, `build-stats.json`

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
│   └── html-templates.ts # HTML head, footer, and page components
└── generators/
    ├── framework-pages.ts
    ├── category-pages.ts
    ├── snippet-pages.ts
    ├── use-case-pages.ts
    ├── comparison-pages.ts
    ├── tutorial-pages.ts
    ├── tag-pages.ts
    ├── search-pages.ts
    └── pattern-pages.ts
```

All paths are resolved from `paths.ts`, so the build works regardless of the current working directory.

## Page Types

| Page type  | URL pattern                              | Source                               |
| ---------- | ---------------------------------------- | ------------------------------------ |
| Framework  | `/framework/:framework`                  | Framework definitions                |
| Category   | `/framework/:framework/:category`        | Framework category JSON              |
| Snippet    | `/snippet/:framework/:category/:snippet` | Snippet registry and source          |
| Use case   | `/use-case/:framework/:use-case`         | Snippet purpose and features         |
| Comparison | `/compare/:framework-vs-framework`       | Framework pairs                      |
| Tutorial   | `/guide/:framework-topic`                | Tutorial topics and related snippets |
| Tag        | `/tag/:framework/:tag`                   | Snippet tags                         |
| Search     | `/search/:query`                         | Search query list                    |
| Pattern    | `/pattern/:framework-pattern`            | Design patterns                      |

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
- Open Graph and Twitter tags point to the 1200x630 images in `apps/web/public`.
- JSON-LD is serialized with `JSON.stringify` and each document is emitted in its own script tag.
- `robots.txt` allows the SPA and keeps `/docs/` and `/builder/` out of the crawl path until they have route-level metadata.

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
