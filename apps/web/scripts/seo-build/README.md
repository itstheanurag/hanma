# Hanma SEO Build Scripts

This directory contains scripts for generating SEO-optimized static pages for the Hanma project.

## Overview

The SEO build system generates static HTML pages targeting long-tail developer search queries. These pages are designed to improve search engine visibility and LLM (ChatGPT, Claude, etc.) citations.

## Architecture

```
apps/web/scripts/seo-build/
├── index.ts              # Main build orchestrator
├── types.ts              # TypeScript type definitions
├── utils/
│   ├── content-loader.ts  # Load content from docs JSON
│   ├── seo-metadata.ts   # Generate SEO metadata
│   └── html-templates.ts # HTML template utilities
└── generators/
    ├── framework-pages.ts # Generate framework landing pages
    ├── category-pages.ts  # Generate category landing pages
    ├── snippet-pages.ts   # Generate snippet detail pages (TODO)
    ├── use-case-pages.ts # Generate use case pages (TODO)
    └── sitemap.ts        # Generate sitemaps (TODO)
```

## Page Types

### Phase 1 (Implemented)

| Page Type         | Count | URL Pattern                       | Status |
| ----------------- | ----- | --------------------------------- | ------ |
| Framework Landing | 5     | `/framework/:framework`           | ✅     |
| Category Landing  | ~40   | `/framework/:framework/:category` | ✅     |

### Phase 2 (Completed)

| Page Type         | Count | URL Pattern                                 | Status |
| ----------------- | ----- | ------------------------------------------- | ------ |
| Framework Landing | 5     | `/framework/:framework`                     | ✅     |
| Category Landing  | ~27   | `/framework/:framework/:category`           | ✅     |
| Snippet Detail    | ~129  | `/snippet/:framework/:category/:snippet-id` | ✅     |
| Use Case          | ~54   | `/use-case/:framework/:use-case-slug`       | ✅     |

### Phase 3 (Completed)

| Page Type      | Count | URL Pattern                | Status |
| -------------- | ----- | -------------------------- | ------ |
| Comparison     | 10    | `/compare/:f1-vs-:f2`      | ✅     |
| Tutorial/Guide | 60    | `/guide/:framework/:topic` | ✅     |
| Tag/Topic      | 100   | `/tag/:framework/:tag`     | ✅     |
| Search Results | 40    | `/search/:query`           | ✅     |

### Phase 4+ (Planned)

| Page Type    | Count   | URL Pattern              | Status |
| ------------ | ------- | ------------------------ | ------ |
| Code Pattern | ~10,000 | `/pattern/:pattern-slug` | 📋     |

## Usage

### Install Dependencies

```bash
cd apps/web/scripts/seo-build
npm install
```

### Run Full Build

```bash
npm run build
```

### Run Individual Generators

```bash
# Generate framework pages only
npm run build:frameworks

# Generate category pages only
npm run build:categories

# Generate snippet pages only
npm run build:snippets

# Generate sitemap only
npm run build:sitemap
```

## Output

Generated pages are written to `apps/web/dist/seo/`:

```
dist/seo/
├── framework/
│   ├── express.html
│   ├── hono.html
│   ├── elysia.html
│   ├── fastify.html
│   └── nest/
│       ├── middleware.html
│       ├── routes.html
│       └── ...
├── sitemap.xml
├── robots.txt
└── build-stats.json
```

## SEO Features

### Metadata

- **Title tags**: Optimized for search engines
- **Meta descriptions**: Compelling descriptions with keywords
- **Canonical URLs**: Prevent duplicate content issues
- **Open Graph**: Social media sharing
- **Twitter Cards**: Twitter sharing

### Structured Data (JSON-LD)

- **SoftwareSourceCode**: For code snippets
- **SoftwareApplication**: For framework pages
- **BreadcrumbList**: Navigation structure
- **WebSite**: Site information

### LLM Optimization

- Clear, descriptive content
- Well-documented code with JSDoc
- FAQ sections on every page
- Comparison content across frameworks
- Problem/solution format

## Development

### Adding a New Page Type

1. Create a new generator in `generators/`:

   ```typescript
   // generators/new-page-type.ts
   export async function generateNewPages(): Promise<{
     pages: GeneratedPage[];
     stats: BuildStats;
   }> {
     // Implementation
   }
   ```

2. Add to `index.ts`:

   ```typescript
   import { generateNewPages } from "./generators/new-page-type.js";

   const newResult = await generateNewPages();
   ```

3. Add to `package.json`:
   ```json
   {
     "scripts": {
       "build:new-type": "tsx generators/new-page-type.ts"
     }
   }
   ```

### Testing

```bash
# Run build and check output
npm run build

# Check generated pages
ls -la dist/seo/

# Verify sitemap
cat dist/seo/sitemap.xml
```

## Deployment

### Cloudflare Pages

The generated pages can be deployed to Cloudflare Pages:

1. Build the pages:

   ```bash
   npm run build
   ```

2. Deploy to Cloudflare Pages:

   ```bash
   # Using Wrangler
   npx wrangler pages deploy dist/seo --project-name=hanma-seo
   ```

3. Configure routing in `_redirects`:
   ```
   /framework/* /framework/:splat 200
   /snippet/* /snippet/:splat 200
   /use-case/* /use-case/:splat 200
   ```

## Monitoring

### Build Stats

After each build, `build-stats.json` is generated:

```json
{
  "buildDate": "2024-01-15T10:30:00.000Z",
  "totalPages": 45,
  "pagesByType": {
    "framework": 5,
    "category": 40
  },
  "buildTime": 1234
}
```

### Google Search Console

1. Add `sitemap.xml` to GSC
2. Monitor indexing status
3. Track keyword rankings
4. Monitor crawl errors

## Troubleshooting

### Build Fails

```bash
# Check if dependencies are installed
npm list

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Pages Not Generated

```bash
# Check content files exist
ls -la ../src/docs/snippets/

# Verify content loader works
node -e "import('./utils/content-loader.js').then(m => m.loadAllFrameworks().then(console.log))"
```

### Linting Errors

```bash
# Run linter
npm run lint

# Fix automatically
npm run lint:fix
```

## Next Steps

- [x] Implement snippet detail pages generator
- [x] Implement use case pages generator
- [x] Implement comparison pages generator
- [x] Implement tutorial/guide pages generator
- [x] Implement tag pages generator
- [x] Implement search result pages generator
- [ ] Implement code pattern pages generator
- [ ] Add CSS styling for generated pages
- [ ] Set up Cloudflare Pages deployment
- [ ] Configure analytics tracking
- [ ] Monitor indexing and performance

## Resources

- [Programmatic SEO Strategy](../../../plans/programmatic-seo-strategy.md)
- [Google SEO Starter Guide](https://developers.google.com/search/docs)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
