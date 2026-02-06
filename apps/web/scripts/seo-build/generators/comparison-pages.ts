/**
 * Comparison page generator
 * Generates SEO-optimized pages comparing different frameworks
 */

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import {
  loadAllFrameworks,
  loadFrameworkCategories,
} from "../utils/content-loader.js";
import {
  generateMetadata,
  slugify,
  generateBreadcrumbJsonLd,
} from "../utils/seo-metadata.js";
import {
  generateFullPage,
  generateBreadcrumb,
  generateFaqSection,
} from "../utils/html-templates.js";
import { GeneratedPage, BuildStats, Snippet } from "../types.js";
import { SITE_URL } from "../constant.js";

const OUTPUT_DIR = join(process.cwd(), "../../dist/seo");

// Framework pairs to compare (avoid duplicates like express-vs-hono vs hono-vs-express)
const FRAMEWORK_PAIRS = [
  ["express", "hono"],
  ["express", "elysia"],
  ["express", "fastify"],
  ["express", "nest"],
  ["hono", "elysia"],
  ["hono", "fastify"],
  ["hono", "nest"],
  ["elysia", "fastify"],
  ["elysia", "nest"],
  ["fastify", "nest"],
];

interface FrameworkInfo {
  id: string;
  name: string;
  description: string;
}

/**
 * Get framework info by ID
 */
function getFrameworkInfo(
  frameworks: Array<{ id: string; name: string; description: string }>,
  id: string,
): FrameworkInfo | null {
  const fw = frameworks.find((f) => f.id === id);
  return fw || null;
}

/**
 * Find snippets that exist in both frameworks for a category
 */
function findCommonSnippets(
  category1Snippets: Snippet[],
  category2Snippets: Snippet[],
): Array<{ name: string; fw1Code: string | null; fw2Code: string | null }> {
  const common: Array<{
    name: string;
    fw1Code: string | null;
    fw2Code: string | null;
  }> = [];

  for (const s1 of category1Snippets) {
    const s2 = category2Snippets.find((s) => s.name === s1.name);
    if (s2) {
      common.push({
        name: s1.displayName,
        fw1Code: s1.usage,
        fw2Code: s2.usage,
      });
    }
  }

  return common;
}

/**
 * Generate performance badge
 */
function getPerformanceBadge(fwId: string): string {
  if (fwId === "hono" || fwId === "elysia") return "Excellent";
  if (fwId === "fastify") return "Very High";
  return "Good";
}

/**
 * Generate type safety badge
 */
function getTypeSafetyBadge(fwId: string): string {
  if (fwId === "nest" || fwId === "elysia") return "Full End-to-End";
  return "Standard TypeScript";
}

/**
 * Generate ecosystem badge
 */
function getEcosystemBadge(fwId: string): string {
  if (fwId === "express") return "Largest";
  if (fwId === "nest") return "Enterprise";
  return "Growing";
}

/**
 * Generate framework type badge
 */
function getFrameworkTypeBadge(fwId: string): string {
  if (fwId === "nest") return "Full-stack Framework";
  return "Micro-framework";
}

/**
 * Generate comparison page content
 */
function generateComparisonContent(
  fw1: FrameworkInfo,
  fw2: FrameworkInfo,
  comparisons: Array<{
    category: string;
    fw1Snippets: Snippet[];
    fw2Snippets: Snippet[];
    common: Array<{
      name: string;
      fw1Code: string | null;
      fw2Code: string | null;
    }>;
  }>,
): string {
  const slug = slugify(`${fw1.name}-vs-${fw2.name}`);

  return `<header class="page-header">
  <h1>${fw1.name} vs ${fw2.name}: Complete Framework Comparison</h1>
  <p class="page-description">
    Compare ${fw1.name} and ${fw2.name} side by side. Find the best framework for your next project
    based on performance, developer experience, and ecosystem.
  </p>
</header>

${generateBreadcrumb([
  { name: "Home", url: "/" },
  { name: "Compare", url: "/compare" },
  { name: `${fw1.name} vs ${fw2.name}`, url: `/compare/${slug}` },
])}

<main class="page-content">
  <section class="framework-overview">
    <div class="framework-card">
      <h2>${fw1.name}</h2>
      <p>${fw1.description}</p>
    </div>
    <div class="vs-badge">VS</div>
    <div class="framework-card">
      <h2>${fw2.name}</h2>
      <p>${fw2.description}</p>
    </div>
  </section>

  <section class="comparison-table">
    <h2>Quick Comparison</h2>
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>${fw1.name}</th>
          <th>${fw2.name}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Type</td>
          <td>${getFrameworkTypeBadge(fw1.id)}</td>
          <td>${getFrameworkTypeBadge(fw2.id)}</td>
        </tr>
        <tr>
          <td>Performance</td>
          <td>${getPerformanceBadge(fw1.id)}</td>
          <td>${getPerformanceBadge(fw2.id)}</td>
        </tr>
        <tr>
          <td>Type Safety</td>
          <td>${getTypeSafetyBadge(fw1.id)}</td>
          <td>${getTypeSafetyBadge(fw2.id)}</td>
        </tr>
        <tr>
          <td>Ecosystem</td>
          <td>${getEcosystemBadge(fw1.id)}</td>
          <td>${getEcosystemBadge(fw2.id)}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="category-comparisons">
    <h2>Feature Comparison by Category</h2>
    ${comparisons
      .map(
        (comp) => `
      <div class="category-comparison">
        <h3>${comp.category.charAt(0).toUpperCase() + comp.category.slice(1)}</h3>
        <p>${fw1.name}: ${comp.fw1Snippets.length} snippets | ${fw2.name}: ${comp.fw2Snippets.length} snippets</p>
        ${
          comp.common.length > 0
            ? `
          <div class="common-features">
            <h4>Common Features (${comp.common.length})</h4>
            <ul>
              ${comp.common.map((c) => `<li>${c.name}</li>`).join("")}
            </ul>
          </div>
        `
            : ""
        }
      </div>
    `,
      )
      .join("\n")}
  </section>

  ${generateFaqSection([
    {
      question: `Which framework is faster, ${fw1.name} or ${fw2.name}?`,
      answer: `${getPerformanceBadge(fw1.id) === "Excellent" ? fw1.name : fw2.name} generally has better raw performance benchmarks, but actual performance depends on your use case and workload.`,
    },
    {
      question: `Is ${fw1.name} compatible with ${fw2.name} middleware?`,
      answer:
        "No, each framework has its own middleware system. However, many concepts translate between frameworks.",
    },
    {
      question: `Which framework should I choose for my project?`,
      answer: `Choose ${fw1.name} if you prioritize ${fw1.id === "express" ? "simplicity and ecosystem" : fw1.id === "nest" ? "enterprise features" : "performance"}. Choose ${fw2.name} if you prioritize ${fw2.id === "express" ? "simplicity and ecosystem" : fw2.id === "nest" ? "enterprise features" : "performance"}.`,
    },
    {
      question: `Can I migrate from ${fw1.name} to ${fw2.name}?`,
      answer:
        "Migration is possible but requires significant effort due to different APIs and patterns. Consider using an abstraction layer if you anticipate needing to switch.",
    },
  ])}
</main>`;
}

/**
 * Generate comparison page
 */
async function generateComparisonPage(
  fw1Id: string,
  fw2Id: string,
  frameworks: Array<{ id: string; name: string; description: string }>,
): Promise<GeneratedPage | null> {
  const fw1 = getFrameworkInfo(frameworks, fw1Id);
  const fw2 = getFrameworkInfo(frameworks, fw2Id);

  if (!fw1 || !fw2) return null;

  const categories1 = await loadFrameworkCategories(fw1Id);
  const categories2 = await loadFrameworkCategories(fw2Id);

  const comparisons: Array<{
    category: string;
    fw1Snippets: Snippet[];
    fw2Snippets: Snippet[];
    common: Array<{
      name: string;
      fw1Code: string | null;
      fw2Code: string | null;
    }>;
  }> = [];

  // Compare common categories
  const categoryIds1 = new Set(categories1.map((c) => c.id));
  const commonCategories = categories2.filter((c) => categoryIds1.has(c.id));

  for (const cat2 of commonCategories) {
    const cat1 = categories1.find((c) => c.id === cat2.id);
    if (!cat1) continue;

    const common = findCommonSnippets(cat1.snippets, cat2.snippets);

    comparisons.push({
      category: cat1.title,
      fw1Snippets: cat1.snippets,
      fw2Snippets: cat2.snippets,
      common,
    });
  }

  const slug = slugify(`${fw1.name}-vs-${fw2.name}`);
  const metadata = generateMetadata(
    "framework",
    { framework: slug },
    { frameworkDescription: `${fw1.name} vs ${fw2.name} comparison` },
  );

  const content = generateComparisonContent(fw1, fw2, comparisons);

  const jsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Compare", url: `${SITE_URL}/compare` },
    { name: `${fw1.name} vs ${fw2.name}`, url: `${SITE_URL}/compare/${slug}` },
  ]);

  const fullPage = generateFullPage(metadata, content, jsonLd);

  return {
    path: join(OUTPUT_DIR, "compare", `${slug}.html`),
    content: fullPage,
    metadata,
  };
}

/**
 * Generate all comparison pages
 */
export async function generateComparisonPages(): Promise<{
  pages: GeneratedPage[];
  stats: BuildStats;
}> {
  const startTime = Date.now();
  const pages: GeneratedPage[] = [];

  console.log("Generating comparison pages...");

  const frameworks = await loadAllFrameworks();

  for (const [fw1Id, fw2Id] of FRAMEWORK_PAIRS) {
    const page = await generateComparisonPage(fw1Id, fw2Id, frameworks);
    if (page) {
      pages.push(page);

      // Ensure output directory exists
      await mkdir(join(OUTPUT_DIR, "compare"), { recursive: true });

      // Write file
      await writeFile(page.path, page.content, "utf-8");
    }
  }

  const stats: BuildStats = {
    totalPages: pages.length,
    pagesByType: {
      comparison: pages.length,
    },
    buildTime: Date.now() - startTime,
  };

  console.log(
    `Generated ${stats.totalPages} comparison pages in ${stats.buildTime}ms`,
  );

  return { pages, stats };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateComparisonPages()
    .then(() => console.log("Comparison pages generation complete!"))
    .catch((error) => {
      console.error("Error generating comparison pages:", error);
      process.exit(1);
    });
}
