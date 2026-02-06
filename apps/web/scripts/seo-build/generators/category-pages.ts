/**
 * Category landing page generator
 * Generates SEO-optimized pages for each category within each framework
 */

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import {
  loadAllFrameworks,
  loadFrameworkCategories,
} from "../utils/content-loader.js";
import {
  generateMetadata,
  generateBreadcrumbJsonLd,
} from "../utils/seo-metadata.js";
import {
  generateFullPage,
  generateBreadcrumb,
  generateRelatedSnippets,
} from "../utils/html-templates.js";
import { GeneratedPage, BuildStats } from "../types.js";
import { SITE_URL } from "../constant.js";

const OUTPUT_DIR = join(process.cwd(), "../../dist/seo");

interface SnippetData {
  id: string;
  name: string;
  displayName: string;
  description: string;
  command: string;
  features: string[];
}

interface CategoryData {
  id: string;
  title: string;
  description: string;
  snippets: SnippetData[];
}

/**
 * Generate category landing page
 */
async function generateCategoryPage(
  framework: { id: string; name: string },
  category: CategoryData,
): Promise<GeneratedPage> {
  const topFeatures = category.snippets.slice(0, 5).map((s) => s.displayName);

  const metadata = generateMetadata(
    "category",
    { framework: framework.id, category: category.id },
    { snippetCount: category.snippets.length, topFeatures },
  );

  const breadcrumb = generateBreadcrumb([
    { name: "Home", url: "/" },
    { name: framework.name, url: `/framework/${framework.id}` },
    { name: category.title, url: `/framework/${framework.id}/${category.id}` },
  ]);

  const snippetsHtml = category.snippets
    .map(
      (
        snippet: SnippetData,
      ) => `<article class="snippet-card" data-snippet-id="${snippet.id}">
  <a href="/snippet/${framework.id}/${category.id}/${snippet.id}" class="snippet-link">
    <h3>${snippet.displayName}</h3>
    <p class="snippet-description">${snippet.description}</p>
    <div class="snippet-meta">
      <span class="snippet-command"><code>${snippet.command}</code></span>
    </div>
    <ul class="snippet-features">
      ${snippet.features
        .slice(0, 3)
        .map((f: string) => `<li>${f}</li>`)
        .join("")}
    </ul>
  </a>
</article>`,
    )
    .join("\n");

  const relatedSnippets = category.snippets
    .slice(0, 6)
    .map((s: SnippetData) => ({
      name: s.name,
      displayName: s.displayName,
      url: `/snippet/${framework.id}/${category.id}/${s.id}`,
    }));

  const content = `<header class="page-header">
  <h1>${category.title} ${framework.name} Snippets</h1>
  <p class="page-description">${category.description}</p>
  <div class="stats">
    <span class="stat">
      <strong>${category.snippets.length}</strong> Snippets
    </span>
  </div>
</header>

${breadcrumb}

<main class="page-content">
  <section class="category-overview">
    <h2>About ${category.title}</h2>
    <p>${category.description}</p>
    <p>Browse the snippets below to find the ${category.title.toLowerCase()} implementation you need for your ${framework.name} project.</p>
  </section>

  <section class="snippets-list">
    <h2>All ${category.title} Snippets</h2>
    <div class="snippets-grid">
      ${snippetsHtml}
    </div>
  </section>

  ${generateRelatedSnippets(relatedSnippets)}

  <section class="installation">
    <h2>How to Use</h2>
    <p>Install any snippet using the Hanma CLI:</p>
    <pre class="code-block"><code class="language-bash">npx hanma add <snippet-name> --framework ${framework.id}</code></pre>
    <p>For example, to install the first snippet:</p>
    <pre class="code-block"><code class="language-bash">${category.snippets[0]?.command || "npx hanma add <snippet-name>"}</code></pre>
  </section>
</main>`;

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    {
      name: framework.name,
      url: `${SITE_URL}/framework/${framework.id}`,
    },
    {
      name: category.title,
      url: `${SITE_URL}/framework/${framework.id}/${category.id}`,
    },
  ]);

  const fullPage = generateFullPage(metadata, content, breadcrumbJsonLd);

  return {
    path: join(OUTPUT_DIR, "framework", framework.id, `${category.id}.html`),
    content: fullPage,
    metadata,
  };
}

/**
 * Generate all category pages
 */
export async function generateCategoryPages(): Promise<{
  pages: GeneratedPage[];
  stats: BuildStats;
}> {
  const startTime = Date.now();
  const frameworks = await loadAllFrameworks();
  const pages: GeneratedPage[] = [];

  console.log("Generating category pages...");

  for (const framework of frameworks) {
    const categories = await loadFrameworkCategories(framework.id);
    console.log(
      `  Processing ${framework.id}: ${categories.length} categories`,
    );

    for (const category of categories) {
      const page = await generateCategoryPage(
        framework,
        category as CategoryData,
      );
      pages.push(page);

      // Ensure output directory exists
      await mkdir(join(OUTPUT_DIR, "framework", framework.id), {
        recursive: true,
      });

      // Write file
      await writeFile(page.path, page.content, "utf-8");
    }

    console.log(
      `  Generated ${categories.length} category pages for ${framework.id}`,
    );
  }

  const stats: BuildStats = {
    totalPages: pages.length,
    pagesByType: {
      category: pages.length,
    },
    buildTime: Date.now() - startTime,
  };

  console.log(`Category pages generated in ${stats.buildTime}ms`);

  return { pages, stats };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateCategoryPages()
    .then(() => console.log("Category pages generation complete!"))
    .catch((error) => {
      console.error("Error generating category pages:", error);
      process.exit(1);
    });
}
