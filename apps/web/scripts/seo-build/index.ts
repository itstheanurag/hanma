/**
 * Main SEO build orchestrator
 * Generates all SEO-optimized static pages
 */

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { generateFrameworkPages } from "./generators/framework-pages.js";
import { generateCategoryPages } from "./generators/category-pages.js";
import { generateSnippetPages } from "./generators/snippet-pages.js";
import { generateUseCasePages } from "./generators/use-case-pages.js";
import { generateComparisonPages } from "./generators/comparison-pages.js";
import { generateTutorialPages } from "./generators/tutorial-pages.js";
import { generateTagPages } from "./generators/tag-pages.js";
import { generateSearchPages } from "./generators/search-pages.js";
import { generatePatternPages } from "./generators/pattern-pages.js";
import { SITE_URL } from "./constant.js";
import { GeneratedPage, BuildStats, SitemapEntry } from "./types.js";

const OUTPUT_DIR = join(process.cwd(), "../../dist/seo");

/**
 * Generate sitemap.xml
 */
async function generateSitemap(pages: GeneratedPage[]): Promise<void> {
  const sitemapEntries: SitemapEntry[] = pages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "weekly",
    priority: page.path === "/" ? 1.0 : 0.8,
  }));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  await writeFile(join(OUTPUT_DIR, "sitemap.xml"), sitemap, "utf-8");
  console.log("Generated sitemap.xml");
}

/**
 * Generate robots.txt
 */
async function generateRobotsTxt(): Promise<void> {
  const robotsTxt = `User-agent: *
Allow: /

Disallow: /docs/
Disallow: /builder/

Sitemap: ${SITE_URL}/sitemap.xml
`;

  await writeFile(join(OUTPUT_DIR, "robots.txt"), robotsTxt, "utf-8");
  console.log("Generated robots.txt");
}

/**
 * Generate build stats
 */
async function generateBuildStats(stats: {
  framework: BuildStats;
  category: BuildStats;
  snippet: BuildStats;
  useCase: BuildStats;
  comparison: BuildStats;
  tutorial: BuildStats;
  tag: BuildStats;
  search: BuildStats;
  pattern: BuildStats;
}): Promise<void> {
  const totalPages =
    stats.framework.totalPages +
    stats.category.totalPages +
    stats.snippet.totalPages +
    stats.useCase.totalPages +
    stats.comparison.totalPages +
    stats.tutorial.totalPages +
    stats.tag.totalPages +
    stats.search.totalPages +
    stats.pattern.totalPages;

  const statsJson = {
    buildDate: new Date().toISOString(),
    totalPages,
    pagesByType: {
      framework: stats.framework.totalPages,
      category: stats.category.totalPages,
      snippet: stats.snippet.totalPages,
      useCase: stats.useCase.totalPages,
      comparison: stats.comparison.totalPages,
      tutorial: stats.tutorial.totalPages,
      tag: stats.tag.totalPages,
      search: stats.search.totalPages,
      pattern: stats.pattern.totalPages,
    },
    buildTime:
      stats.framework.buildTime +
      stats.category.buildTime +
      stats.snippet.buildTime +
      stats.useCase.buildTime +
      stats.comparison.buildTime +
      stats.tutorial.buildTime +
      stats.tag.buildTime +
      stats.search.buildTime +
      stats.pattern.buildTime,
  };

  await writeFile(
    join(OUTPUT_DIR, "build-stats.json"),
    JSON.stringify(statsJson, null, 2),
    "utf-8",
  );
  console.log("Generated build-stats.json");
}

/**
 * Main build function
 */
async function build(): Promise<void> {
  const startTime = Date.now();

  console.log("Starting SEO build...\n");

  // Ensure output directory exists
  await mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Generate all page types
  const frameworkResult = await generateFrameworkPages();
  const categoryResult = await generateCategoryPages();
  const snippetResult = await generateSnippetPages();
  const useCaseResult = await generateUseCasePages();
  const comparisonResult = await generateComparisonPages();
  const tutorialResult = await generateTutorialPages();
  const tagResult = await generateTagPages();
  const searchResult = await generateSearchPages();
  const patternResult = await generatePatternPages();

  // Collect all pages
  const allPages: GeneratedPage[] = [
    ...frameworkResult.pages,
    ...categoryResult.pages,
    ...snippetResult.pages,
    ...useCaseResult.pages,
    ...comparisonResult.pages,
    ...tutorialResult.pages,
    ...tagResult.pages,
    ...searchResult.pages,
    ...patternResult.pages,
  ];

  // Generate sitemap and robots.txt
  await generateSitemap(allPages);
  await generateRobotsTxt();

  // Generate build stats
  await generateBuildStats({
    framework: frameworkResult.stats,
    category: categoryResult.stats,
    snippet: snippetResult.stats,
    useCase: useCaseResult.stats,
    comparison: comparisonResult.stats,
    tutorial: tutorialResult.stats,
    tag: tagResult.stats,
    search: searchResult.stats,
    pattern: patternResult.stats,
  });

  const totalBuildTime = Date.now() - startTime;

  console.log("\n=== Build Complete ===");
  console.log(`Total pages generated: ${allPages.length}`);
  console.log(`Total build time: ${totalBuildTime}ms`);
  console.log(`\nPages by type:`);
  console.log(`  Framework pages: ${frameworkResult.stats.totalPages}`);
  console.log(`  Category pages: ${categoryResult.stats.totalPages}`);
  console.log(`  Snippet pages: ${snippetResult.stats.totalPages}`);
  console.log(`  Use Case pages: ${useCaseResult.stats.totalPages}`);
  console.log(`  Comparison pages: ${comparisonResult.stats.totalPages}`);
  console.log(`  Tutorial pages: ${tutorialResult.stats.totalPages}`);
  console.log(`  Tag pages: ${tagResult.stats.totalPages}`);
  console.log(`  Search pages: ${searchResult.stats.totalPages}`);
  console.log(`  Pattern pages: ${patternResult.stats.totalPages}`);
  console.log(`\nOutput directory: ${OUTPUT_DIR}`);
}

// Run build
build()
  .then(() => {
    console.log("\nSEO build completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nSEO build failed:", error);
    process.exit(1);
  });
