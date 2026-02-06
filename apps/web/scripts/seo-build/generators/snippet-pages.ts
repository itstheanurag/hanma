/**
 * Snippet detail page generator
 * Generates SEO-optimized pages for individual code snippets
 */

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import {
  loadAllFrameworks,
  loadFrameworkCategories,
  loadSnippetSource,
} from "../utils/content-loader.js";
import {
  generateMetadata,
  generateSnippetJsonLd,
  generateBreadcrumbJsonLd,
} from "../utils/seo-metadata.js";
import {
  generateFullPage,
  generateBreadcrumb,
  generateCodeBlock,
  generateCopyButton,
  generateFaqSection,
  generateInstallationSection,
  generateUsageSection,
} from "../utils/html-templates.js";
import { GeneratedPage, BuildStats } from "../types.js";
import { SITE_URL } from "../constant.js";

const OUTPUT_DIR = join(process.cwd(), "../../dist/seo");

interface SnippetData {
  id: string;
  name: string;
  displayName: string;
  description: string;
  purpose: string;
  features: string[];
  usage: string;
  output: string;
  dependencies: string[];
  command: string;
}

interface CategoryData {
  id: string;
  title: string;
  description: string;
  snippets: SnippetData[];
}

/**
 * Generate FAQ for a snippet
 */
function generateSnippetFaq(
  snippet: SnippetData,
): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];

  // Installation FAQ
  faqs.push({
    question: `How do I install ${snippet.displayName}?`,
    answer: `Run the following command: <code>${snippet.command}</code>`,
  });

  // Dependencies FAQ
  if (snippet.dependencies.length > 0) {
    faqs.push({
      question: "What dependencies are required?",
      answer: `This snippet requires: ${snippet.dependencies.join(", ")}. Make sure to install them before using the snippet.`,
    });
  }

  // Usage FAQ
  faqs.push({
    question: "How do I use this snippet?",
    answer: `Copy the code and paste it into your project. The snippet will be saved to <code>${snippet.output}</code>.`,
  });

  // Customization FAQ
  faqs.push({
    question: "Can I customize this snippet?",
    answer:
      "Yes! All snippets are copy-paste code that you own. Feel free to modify them to fit your needs.",
  });

  // Framework-specific FAQ
  faqs.push({
    question: "Does this work with other frameworks?",
    answer:
      "This snippet is designed for the specific framework. Check the other framework pages for equivalent implementations.",
  });

  return faqs;
}

/**
 * Generate related snippets
 */
function generateRelatedSnippets(
  allSnippets: SnippetData[],
  currentSnippet: SnippetData,
  frameworkId: string,
  categoryId: string,
  limit: number = 6,
): Array<{ name: string; displayName: string; url: string }> {
  // Filter out current snippet and get from same category
  const related = allSnippets
    .filter((s) => s.id !== currentSnippet.id)
    .slice(0, limit);

  return related.map((s) => ({
    name: s.name,
    displayName: s.displayName,
    url: `/snippet/${frameworkId}/${categoryId}/${s.id}`,
  }));
}

/**
 * Generate snippet detail page
 */
async function generateSnippetPage(
  framework: { id: string; name: string },
  category: CategoryData,
  snippet: SnippetData,
  sourceCode: string | null,
): Promise<GeneratedPage> {
  const metadata = generateMetadata(
    "snippet",
    { framework: framework.id, category: category.id, snippet: snippet.id },
    { snippetData: snippet },
  );

  const breadcrumb = generateBreadcrumb([
    { name: "Home", url: "/" },
    { name: framework.name, url: `/framework/${framework.id}` },
    { name: category.title, url: `/framework/${framework.id}/${category.id}` },
    {
      name: snippet.displayName,
      url: `/snippet/${framework.id}/${category.id}/${snippet.id}`,
    },
  ]);

  const faqs = generateSnippetFaq(snippet);
  const relatedSnippets = generateRelatedSnippets(
    category.snippets,
    snippet,
    framework.id,
    category.id,
  );

  const content = `<header class="page-header">
  <h1>${snippet.displayName}</h1>
  <p class="page-description">${snippet.description}</p>
  <div class="snippet-meta">
    <span class="meta-item">
      <strong>Framework:</strong> ${framework.name}
    </span>
    <span class="meta-item">
      <strong>Category:</strong> ${category.title}
    </span>
    <span class="meta-item">
      <strong>Output:</strong> ${snippet.output}
    </span>
  </div>
</header>

${breadcrumb}

<main class="page-content">
  <section class="overview">
    <h2>Overview</h2>
    <p>${snippet.purpose}</p>
    <div class="features">
      <h3>Features</h3>
      <ul>
        ${snippet.features.map((f) => `<li>${f}</li>`).join("\n")}
      </ul>
    </div>
  </section>

  ${generateInstallationSection(snippet.command, snippet.dependencies)}

  <section class="code-section">
    <h2>Code</h2>
    <div class="code-container">
      ${generateCodeBlock(sourceCode || "// Source code not available", "typescript")}
      ${generateCopyButton("snippet-code")}
    </div>
  </section>

  ${generateUsageSection(snippet.usage)}

  <section class="dependencies">
    <h2>Dependencies</h2>
    ${
      snippet.dependencies.length > 0
        ? `<ul>
          ${snippet.dependencies.map((dep) => `<li><code>${dep}</code></li>`).join("\n")}
        </ul>`
        : "<p>No external dependencies required.</p>"
    }
  </section>

  ${generateFaqSection(faqs)}

  <section class="related">
    <h2>Related Snippets</h2>
    <div class="related-grid">
      ${relatedSnippets
        .map(
          (s) => `<a href="${s.url}" class="related-card">
  <h3>${s.displayName}</h3>
  <p>${s.name}</p>
</a>`,
        )
        .join("\n")}
    </div>
  </section>
</main>`;

  const jsonLd = generateSnippetJsonLd(
    snippet.displayName,
    snippet.description,
    framework.name,
    sourceCode || undefined,
  );

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
    {
      name: snippet.displayName,
      url: `${SITE_URL}/snippet/${framework.id}/${category.id}/${snippet.id}`,
    },
  ]);

  const fullPage = generateFullPage(
    metadata,
    content,
    `${jsonLd}\n${breadcrumbJsonLd}`,
  );

  return {
    path: join(
      OUTPUT_DIR,
      "snippet",
      framework.id,
      category.id,
      `${snippet.id}.html`,
    ),
    content: fullPage,
    metadata,
  };
}

/**
 * Generate all snippet pages
 */
export async function generateSnippetPages(): Promise<{
  pages: GeneratedPage[];
  stats: BuildStats;
}> {
  const startTime = Date.now();
  const frameworks = await loadAllFrameworks();
  const pages: GeneratedPage[] = [];

  console.log("Generating snippet pages...");

  for (const framework of frameworks) {
    const categories = await loadFrameworkCategories(framework.id);
    console.log(
      `  Processing ${framework.id}: ${categories.length} categories`,
    );

    for (const category of categories) {
      console.log(
        `    Category: ${category.id} (${category.snippets.length} snippets)`,
      );

      for (const snippet of category.snippets) {
        const sourceCode = await loadSnippetSource(framework.id, snippet.id);
        const page = await generateSnippetPage(
          framework,
          category as CategoryData,
          snippet as SnippetData,
          sourceCode,
        );
        pages.push(page);

        // Ensure output directory exists
        await mkdir(join(OUTPUT_DIR, "snippet", framework.id, category.id), {
          recursive: true,
        });

        // Write file
        await writeFile(page.path, page.content, "utf-8");
      }
    }

    console.log(
      `  Generated ${categories.reduce((sum, cat) => sum + cat.snippets.length, 0)} snippet pages for ${framework.id}`,
    );
  }

  const stats: BuildStats = {
    totalPages: pages.length,
    pagesByType: {
      snippet: pages.length,
    },
    buildTime: Date.now() - startTime,
  };

  console.log(`Snippet pages generated in ${stats.buildTime}ms`);

  return { pages, stats };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSnippetPages()
    .then(() => console.log("Snippet pages generation complete!"))
    .catch((error) => {
      console.error("Error generating snippet pages:", error);
      process.exit(1);
    });
}
