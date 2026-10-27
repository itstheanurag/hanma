/**
 * Framework index page generator.
 *
 * A crawlable hub that links every framework landing page. The SPA links here
 * from the supported frameworks section and footer so search engines are not
 * limited to the sitemap when discovering framework and snippet pages.
 */

import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import {
  loadAllFrameworks,
  loadFrameworkCategories,
} from "../utils/content-loader.js";
import {
  generateBreadcrumbJsonLd,
  getOgImageUrl,
} from "../utils/seo-metadata.js";
import {
  generateBreadcrumb,
  generateFullPage,
} from "../utils/html-templates.js";
import { GeneratedPage, PageMetadata } from "../types.js";
import { SITE_URL } from "../constant.js";
import { DIST_DIR } from "../paths.js";

const OUTPUT_DIR = DIST_DIR;

const TITLE = "Backend Framework Snippets | Hanma";
const DESCRIPTION =
  "Browse production-ready snippets and code examples for Express, Hono, Elysia, Fastify, and NestJS.";

/**
 * Generate the framework hub page.
 */
export async function generateFrameworkIndexPage(): Promise<GeneratedPage> {
  const frameworks = await loadAllFrameworks();
  const metadata: PageMetadata = {
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}/framework`,
    ogTitle: TITLE,
    ogDescription: DESCRIPTION,
    ogImage: getOgImageUrl(`${SITE_URL}/framework`),
    twitterImage: getOgImageUrl(`${SITE_URL}/framework`),
  };

  const cards = (
    await Promise.all(
      frameworks.map(async (framework) => {
        const categories = await loadFrameworkCategories(framework.id);
        const snippetCount = categories.reduce(
          (sum, category) => sum + category.snippets.length,
          0,
        );

        return `<a href="/framework/${framework.id}" class="framework-card">
  <h2>${framework.name}</h2>
  <p>${framework.description}</p>
  <span class="framework-meta">${categories.length} categories · ${snippetCount} snippets</span>
</a>`;
      }),
    )
  ).join("\n");

  const breadcrumb = generateBreadcrumb([
    { name: "Home", url: "/" },
    { name: "Frameworks", url: "/framework" },
  ]);

  const content = `<header class="page-header">
  <h1>Backend Framework Snippets</h1>
  <p class="page-description">
    Browse production-ready snippets and code examples for every framework supported by Hanma.
  </p>
</header>

${breadcrumb}

<main class="page-content">
  <section class="framework-grid">
    ${cards}
  </section>

  <section class="getting-started">
    <h2>Getting Started</h2>
    <p>Install the Hanma CLI and add snippets directly to your project:</p>
    <pre class="code-block"><code class="language-bash">npx hanma add &lt;snippet-name&gt; --framework express</code></pre>
  </section>
</main>`;

  const jsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Frameworks", url: `${SITE_URL}/framework` },
  ]);

  const page: GeneratedPage = {
    path: join(OUTPUT_DIR, "framework", "index.html"),
    content: generateFullPage(metadata, content, [jsonLd]),
    metadata,
  };

  await mkdir(dirname(page.path), { recursive: true });
  await writeFile(page.path, page.content, "utf-8");

  return page;
}
