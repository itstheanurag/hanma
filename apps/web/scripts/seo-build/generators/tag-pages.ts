/**
 * Tag/topic page generator
 * Generates SEO-optimized tag pages for common topics
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
  humanize,
  generateBreadcrumbJsonLd,
} from "../utils/seo-metadata.js";
import {
  generateFullPage,
  generateBreadcrumb,
  generateFaqSection,
} from "../utils/html-templates.js";
import { GeneratedPage, BuildStats, Snippet } from "../types.js";
import { SITE_URL } from "../constant.js";
import { DIST_DIR } from "../paths.js";

const OUTPUT_DIR = DIST_DIR;

// Common tags/topics
const TAGS = [
  // Core backend
  "server",
  "backend",
  "api",
  "http",

  // Auth & Identity
  "authentication",
  "authorization",
  "jwt",
  "sessions",
  "rbac",

  // Security
  "security",
  "cors",
  "helmet",
  "csrf",
  "rate-limiting",
  "security-headers",

  // Request lifecycle
  "middleware",
  "routing",
  "validation",
  "error-handling",

  // Data & Storage
  "database",
  "orm",
  "transactions",
  "cache",

  // Performance & Scale
  "performance",
  "scaling",
  "load-balancing",
  "caching-strategies",

  // Real-time
  "websocket",
  "sse",

  // Files & Media
  "file-upload",
  "multipart",

  // Observability
  "logging",
  "monitoring",
  "metrics",
  "tracing",

  // Testing & Quality
  "testing",
  "unit-testing",
  "integration-testing",

  // Config & Ops
  "configuration",
  "environment-variables",
  "deployment",
  "production",
];

/**
 * Extract tags from snippet
 */
function extractTags(snippet: Snippet): string[] {
  const tags: string[] = [];

  const text = [
    snippet.purpose,
    snippet.description,
    ...snippet.features,
    snippet.name,
    snippet.displayName,
    snippet.output,
  ]
    .join(" ")
    .toLowerCase();

  // Tag mappings
  const tagPatterns: Record<string, string[]> = {
    authentication: [
      "auth",
      "login",
      "jwt",
      "session",
      "password",
      "oauth",
      "token",
    ],
    authorization: [
      "permission",
      "role",
      "guard",
      "access",
      "admin",
      "authorize",
    ],
    cors: ["cors", "cross-origin", "origin"],
    database: [
      "db",
      "database",
      "sql",
      "prisma",
      "drizzle",
      "query",
      "repository",
    ],
    "error-handling": ["error", "exception", "handle", "throw"],
    "file-upload": ["upload", "file", "multipart", "s3", "storage"],
    jwt: ["jwt", "token", "bearer"],
    logging: ["log", "logger", "pino", "winston"],
    middleware: ["middleware", "hook", "intercept"],
    performance: ["performance", "optimize", "cache", "benchmark"],
    "rate-limiting": ["rate", "limit", "throttle", " quota"],
    routing: ["route", "router", "endpoint", "path"],
    security: ["security", "header", "csrf", "xss", "helmet"],
    testing: ["test", "mock", "vitest", "jest", "unit"],
    validation: ["validate", "schema", "input", "typebox", "zod"],
    websocket: ["ws", "socket", " realtime", " realtime"],
    cache: ["cache", "redis", "memory"],
    monitoring: ["monitor", "metrics", "telemetry", "opentelemetry"],
    configuration: ["config", "env", "environment", "dotenv"],
  };

  for (const [tag, keywords] of Object.entries(tagPatterns)) {
    if (keywords.some((kw) => text.includes(kw))) {
      tags.push(tag);
    }
  }

  return tags.length > 0 ? tags : ["general"];
}

/**
 * Generate tag page content
 */
function generateTagContent(
  tag: string,
  framework: { id: string; name: string },
  snippets: Array<{ snippet: Snippet; category: string }>,
): string {
  const slug = slugify(tag);
  const displayTag = humanize(tag);

  return `<header class="page-header">
  <h1>${displayTag} in ${framework.name}</h1>
  <p class="page-description">
    Explore ${snippets.length} code snippets for ${displayTag.toLowerCase()} in ${framework.name}.
    Find the perfect solution for your next project.
  </p>
</header>

${generateBreadcrumb([
  { name: "Home", url: "/" },
  { name: framework.name, url: `/framework/${framework.id}` },
  { name: displayTag, url: `/tag/${framework.id}/${slug}` },
])}

<main class="page-content">
  <section class="tag-overview">
    <h2>Overview</h2>
    <p>
      This page collects ${snippets.length} code snippets related to ${displayTag.toLowerCase()}
      for ${framework.name}. Browse below to find the perfect solution for your needs.
    </p>
  </section>

  <section class="snippets-by-category">
    <h2>Snippets by Category</h2>
    ${Object.entries(
      snippets.reduce(
        (acc, { snippet, category }) => {
          if (!acc[category]) acc[category] = [];
          acc[category].push({ snippet, category });
          return acc;
        },
        {} as Record<string, Array<{ snippet: Snippet; category: string }>>,
      ),
    )
      .map(
        ([category, items]) => `
      <div class="category-group">
        <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
        <div class="snippets-grid">
          ${items
            .map(
              ({ snippet }) => `
            <article class="snippet-card">
              <a href="/snippet/${framework.id}/${category}/${snippet.id}" class="snippet-link">
                <h4>${snippet.displayName}</h4>
                <p>${snippet.description}</p>
                <code>${snippet.command}</code>
              </a>
            </article>
          `,
            )
            .join("\n")}
        </div>
      </div>
    `,
      )
      .join("\n")}
  </section>

  ${generateFaqSection([
    {
      question: `How do I implement ${displayTag.toLowerCase()} in ${framework.name}?`,
      answer: `Browse the snippets above and select the one that best fits your needs. Each snippet includes installation instructions and usage examples.`,
    },
    {
      question: "Are these snippets production-ready?",
      answer:
        "Yes, all snippets are designed for production use. Review and adapt to your specific requirements before deployment.",
    },
    {
      question: `Can I use these with ${framework.name}?`,
      answer: `Yes, these snippets are specifically designed and tested for ${framework.name}.`,
    },
  ])}
</main>`;
}

/**
 * Generate tag page
 */
async function generateTagPage(
  tag: string,
  framework: { id: string; name: string; description: string },
): Promise<GeneratedPage | null> {
  const categories = await loadFrameworkCategories(framework.id);
  const allSnippets = categories.flatMap((cat) => cat.snippets);

  const taggedSnippets = allSnippets
    .filter((snippet) => extractTags(snippet).includes(tag))
    .map((snippet) => ({
      snippet,
      category:
        categories.find((cat) => cat.snippets.some((s) => s.id === snippet.id))
          ?.id || "general",
    }));

  // Empty tag pages are thin content with no useful result for searchers.
  if (taggedSnippets.length === 0) return null;

  const slug = slugify(tag);
  const metadata = generateMetadata(
    "tag",
    { tag: slug, framework: framework.id },
    {
      tagName: humanize(tag),
      frameworkName: framework.name,
      snippetCount: taggedSnippets.length,
    },
  );

  const content = generateTagContent(tag, framework, taggedSnippets);

  const jsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: framework.name, url: `${SITE_URL}/framework/${framework.id}` },
    {
      name: humanize(tag),
      url: `${SITE_URL}/tag/${framework.id}/${slug}`,
    },
  ]);

  const fullPage = generateFullPage(metadata, content, jsonLd);

  return {
    path: join(OUTPUT_DIR, "tag", framework.id, `${slug}.html`),
    content: fullPage,
    metadata,
  };
}

/**
 * Generate all tag pages
 */
export async function generateTagPages(): Promise<{
  pages: GeneratedPage[];
  stats: BuildStats;
}> {
  const startTime = Date.now();
  const pages: GeneratedPage[] = [];

  console.log("Generating tag pages...");

  const frameworks = await loadAllFrameworks();

  for (const framework of frameworks) {
    let generatedForFramework = 0;

    for (const tag of TAGS) {
      const page = await generateTagPage(tag, framework);
      if (!page) continue;

      pages.push(page);
      generatedForFramework += 1;

      // Ensure output directory exists
      await mkdir(join(OUTPUT_DIR, "tag", framework.id), { recursive: true });

      // Write file
      await writeFile(page.path, page.content, "utf-8");
    }

    console.log(
      `  Generated ${generatedForFramework} tag pages for ${framework.name}`,
    );
  }

  const stats: BuildStats = {
    totalPages: pages.length,
    pagesByType: {
      tag: pages.length,
    },
    buildTime: Date.now() - startTime,
  };

  console.log(
    `Generated ${stats.totalPages} tag pages in ${stats.buildTime}ms`,
  );

  return { pages, stats };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTagPages()
    .then(() => console.log("Tag pages generation complete!"))
    .catch((error) => {
      console.error("Error generating tag pages:", error);
      process.exit(1);
    });
}
