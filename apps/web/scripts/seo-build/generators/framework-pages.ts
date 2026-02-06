/**
 * Framework landing page generator
 * Generates SEO-optimized pages for each framework
 */

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import {
  loadAllFrameworks,
  loadFrameworkCategories,
} from "../utils/content-loader.js";
import {
  generateMetadata,
  generateFrameworkJsonLd,
  generateBreadcrumbJsonLd,
} from "../utils/seo-metadata.js";
import {
  generateFullPage,
  generateBreadcrumb,
  generateFrameworkNavigation,
  generateFeatureList,
} from "../utils/html-templates.js";
import { GeneratedPage, BuildStats } from "../types.js";
import { SITE_URL } from "../constant.js";

const OUTPUT_DIR = join(process.cwd(), "../../dist/seo");

/**
 * Generate framework landing page
 */
async function generateFrameworkPage(framework: {
  id: string;
  name: string;
  description: string;
}): Promise<GeneratedPage> {
  const categories = await loadFrameworkCategories(framework.id);
  const totalSnippets = categories.reduce(
    (sum, cat) => sum + cat.snippets.length,
    0,
  );
  const topFeatures = categories
    .flatMap((cat) => cat.snippets.slice(0, 2).map((s) => s.displayName))
    .slice(0, 6);

  const metadata = generateMetadata(
    "framework",
    { framework: framework.id },
    { frameworkDescription: framework.description },
  );

  const breadcrumb = generateBreadcrumb([
    { name: "Home", url: "/" },
    { name: framework.name, url: `/framework/${framework.id}` },
  ]);

  const frameworks = await loadAllFrameworks();
  const frameworkNav = generateFrameworkNavigation(framework.id, frameworks);

  const categoriesHtml = categories
    .map(
      (cat) => `<section class="category-section" id="${cat.id}">
  <h2>
    <a href="/framework/${framework.id}/${cat.id}">${cat.title}</a>
  </h2>
  <p class="category-description">${cat.description}</p>
  <p class="snippet-count">${cat.snippets.length} snippets</p>
  <div class="category-preview">
    ${cat.snippets
      .slice(0, 3)
      .map(
        (
          s,
        ) => `<a href="/snippet/${framework.id}/${cat.id}/${s.id}" class="snippet-preview">
      <h3>${s.displayName}</h3>
      <p>${s.description}</p>
    </a>`,
      )
      .join("\n")}
  </div>
</section>`,
    )
    .join("\n");

  const content = `<header class="page-header">
  <h1>${framework.name} Snippets & Code Examples</h1>
  <p class="page-description">${framework.description}</p>
  <div class="stats">
    <span class="stat">
      <strong>${categories.length}</strong> Categories
    </span>
    <span class="stat">
      <strong>${totalSnippets}</strong> Snippets
    </span>
  </div>
</header>

${breadcrumb}

${frameworkNav}

<main class="page-content">
  <section class="overview">
    <h2>What is ${framework.name}?</h2>
    <p>${framework.description}</p>
    <p>Use the snippets below to quickly add common functionality to your ${framework.name} applications. All snippets are production-ready and can be copied directly into your project.</p>
  </section>

  <section class="popular-features">
    <h2>Popular Features</h2>
    ${generateFeatureList(topFeatures)}
  </section>

  <section class="categories">
    <h2>Categories</h2>
    <div class="categories-grid">
      ${categoriesHtml}
    </div>
  </section>

  <section class="getting-started">
    <h2>Getting Started</h2>
    <p>Install the Hanma CLI to add snippets to your project:</p>
    <pre class="code-block"><code class="language-bash">npx hanma add <snippet-name> --framework ${framework.id}</code></pre>
    <p>Or browse the categories above to find the snippet you need.</p>
  </section>
</main>`;

  const jsonLd = generateFrameworkJsonLd(
    framework.name,
    framework.description,
    totalSnippets,
  );
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    {
      name: framework.name,
      url: `${SITE_URL}/framework/${framework.id}`,
    },
  ]);

  const fullPage = generateFullPage(
    metadata,
    content,
    `${jsonLd}\n${breadcrumbJsonLd}`,
  );

  return {
    path: join(OUTPUT_DIR, "framework", `${framework.id}.html`),
    content: fullPage,
    metadata,
  };
}

/**
 * Generate all framework pages
 */
export async function generateFrameworkPages(): Promise<{
  pages: GeneratedPage[];
  stats: BuildStats;
}> {
  const startTime = Date.now();
  const frameworks = await loadAllFrameworks();
  const pages: GeneratedPage[] = [];

  console.log(`Generating ${frameworks.length} framework pages...`);

  for (const framework of frameworks) {
    const page = await generateFrameworkPage(framework);
    pages.push(page);

    // Ensure output directory exists
    await mkdir(join(OUTPUT_DIR, "framework"), { recursive: true });

    // Write file
    await writeFile(page.path, page.content, "utf-8");
    console.log(`  Generated: ${framework.id}`);
  }

  const stats: BuildStats = {
    totalPages: pages.length,
    pagesByType: {
      framework: pages.length,
    },
    buildTime: Date.now() - startTime,
  };

  console.log(`Framework pages generated in ${stats.buildTime}ms`);

  return { pages, stats };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateFrameworkPages()
    .then(() => console.log("Framework pages generation complete!"))
    .catch((error) => {
      console.error("Error generating framework pages:", error);
      process.exit(1);
    });
}
