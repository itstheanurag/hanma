/**
 * Use case page generator
 * Generates SEO-optimized pages for common use cases
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
  slugify,
} from "../utils/seo-metadata.js";
import {
  generateFullPage,
  generateBreadcrumb,
  generateFaqSection,
} from "../utils/html-templates.js";
import { GeneratedPage, BuildStats, Snippet } from "../types.js";
import { SITE_URL } from "../constant.js";

const OUTPUT_DIR = join(process.cwd(), "../../dist/seo");

// Common use case keywords to target
const COMMON_USE_CASES = [
  // Auth & Identity
  "authentication",
  "authorization",
  "role based access control",
  "permission management",
  "session management",
  "token management",

  // Request lifecycle
  "routing",
  "middleware",
  "request parsing",
  "response transformation",
  "api versioning",

  // Validation & Errors
  "validation",
  "schema validation",
  "input sanitization",
  "error handling",
  "global error handling",

  // Security
  "cors",
  "csrf protection",
  "security headers",
  "rate limiting",
  "brute force protection",

  // Observability
  "logging",
  "structured logging",
  "request tracing",
  "metrics",
  "health checks",

  // Data & Storage
  "database",
  "database migrations",
  "transactions",
  "caching",
  "cache invalidation",

  // Real-time & Async
  "websocket",
  "server sent events",
  "background jobs",
  "message queues",

  // Files & Media
  "file upload",
  "file validation",
  "image processing",
  "cloud storage",

  // Performance
  "compression",
  "response caching",
  "load balancing",
  "performance optimization",

  // Testing & Quality
  "unit testing",
  "integration testing",
  "end to end testing",
  "mocking",
  "test data seeding",

  // Dev & Ops
  "configuration management",
  "environment variables",
  "feature flags",
  "graceful shutdown",
  "production deployment",
];

/**
 * Extract use case from snippet
 */
function extractUseCaseFromSnippet(snippet: Snippet): string[] {
  const useCases: string[] = [];

  // Check purpose for keywords
  const purpose = snippet.purpose.toLowerCase();
  const description = snippet.description.toLowerCase();
  const features = snippet.features.map((f) => f.toLowerCase());

  // Common use case patterns
  const patterns: Record<string, string[]> = {
    authentication: ["auth", "login", "jwt", "session", "password", "oauth"],
    authorization: ["permission", "role", "guard", "access", "admin"],
    logging: ["log", "logger", "monitor", "trace"],
    validation: ["validate", "schema", "input", "type"],
    error: ["error", "exception", "handle"],
    rate: ["rate", "limit", "throttle"],
    cors: ["cors", "cross-origin", "origin"],
    database: ["db", "database", "query", "sql", "prisma", "drizzle"],
    cache: ["cache", "redis", "memory"],
    file: ["upload", "file", "multipart", "s3"],
    websocket: ["ws", "socket", "realtime", " realtime"],
    testing: ["test", "mock", "unit", "e2e"],
    middleware: ["middleware", "hook", "intercept"],
    routing: ["route", "router", "endpoint"],
    security: ["security", "header", "csrf", "xss"],
  };

  const allText = [purpose, description, ...features].join(" ");

  for (const [useCase, keywords] of Object.entries(patterns)) {
    if (keywords.some((kw) => allText.includes(kw))) {
      useCases.push(useCase);
    }
  }

  return useCases.length > 0 ? useCases : ["general"];
}

/**
 * Generate use case page content
 */
function generateUseCaseContent(
  useCase: string,
  framework: { id: string; name: string },
  snippets: Array<{ snippet: Snippet; category: string }>,
): string {
  const slug = slugify(useCase);

  return `<header class="page-header">
  <h1>${useCase.charAt(0).toUpperCase() + useCase.slice(1)} in ${framework.name}</h1>
  <p class="page-description">
    Explore ${snippets.length} code snippets for implementing ${useCase} in ${framework.name}.
    Copy-paste ready solutions for your production applications.
  </p>
</header>

${generateBreadcrumb([
  { name: "Home", url: "/" },
  { name: framework.name, url: `/framework/${framework.id}` },
  { name: useCase, url: `/use-case/${framework.id}/${slug}` },
])}

<main class="page-content">
  <section class="use-case-overview">
    <h2>Overview</h2>
    <p>
      This page contains ${snippets.length} code snippets for implementing ${useCase}
      in ${framework.name}. Each snippet is production-ready and can be copy-pasted
      directly into your project.
    </p>
  </section>

  <section class="snippets-list">
    <h2>Available Snippets</h2>
    <div class="snippets-grid">
      ${snippets
        .map(
          ({ snippet, category }) => `
        <article class="snippet-card">
          <a href="/snippet/${framework.id}/${category}/${snippet.id}" class="snippet-link">
            <h3>${snippet.displayName}</h3>
            <p class="snippet-description">${snippet.description}</p>
            <div class="snippet-meta">
              <span class="snippet-command"><code>${snippet.command}</code></span>
            </div>
            <ul class="snippet-features">
              ${snippet.features
                .slice(0, 3)
                .map((f) => `<li>${f}</li>`)
                .join("")}
            </ul>
          </a>
        </article>
      `,
        )
        .join("\n")}
    </div>
  </section>

  ${generateFaqSection([
    {
      question: `How do I implement ${useCase} in ${framework.name}?`,
      answer: `Browse the snippets above and copy the code that matches your needs. Each snippet includes installation instructions and usage examples.`,
    },
    {
      question: "Are these snippets production-ready?",
      answer:
        "Yes, all snippets are designed for production use. However, always review and test them in your specific context before deployment.",
    },
    {
      question: `Can I use these snippets with other ${framework.name} versions?`,
      answer:
        "These snippets are designed for the current major version of the framework. Check the snippet documentation for version compatibility notes.",
    },
  ])}
</main>`;
}

/**
 * Generate use case page
 */
async function generateUseCasePage(
  useCase: string,
  framework: { id: string; name: string },
  snippets: Array<{ snippet: Snippet; category: string }>,
): Promise<GeneratedPage> {
  const slug = slugify(useCase);
  const metadata = generateMetadata(
    "useCase",
    { useCase: slug, framework: framework.id },
    { snippetCount: snippets.length },
  );

  const content = generateUseCaseContent(useCase, framework, snippets);

  const jsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: framework.name, url: `${SITE_URL}/framework/${framework.id}` },
    { name: useCase, url: `${SITE_URL}/use-case/${framework.id}/${slug}` },
  ]);

  const fullPage = generateFullPage(metadata, content, jsonLd);

  return {
    path: join(OUTPUT_DIR, "use-case", framework.id, `${slug}.html`),
    content: fullPage,
    metadata,
  };
}

/**
 * Generate all use case pages
 */
export async function generateUseCasePages(): Promise<{
  pages: GeneratedPage[];
  stats: BuildStats;
}> {
  const startTime = Date.now();
  const pages: GeneratedPage[] = [];

  console.log("Generating use case pages...");

  const frameworks = await loadAllFrameworks();
  const useCasesMap = new Map<
    string,
    Map<string, Array<{ snippet: Snippet; category: string }>>
  >();

  // Collect snippets by use case and framework
  for (const framework of frameworks) {
    const categories = await loadFrameworkCategories(framework.id);

    for (const category of categories) {
      for (const snippet of category.snippets) {
        const useCases = extractUseCaseFromSnippet(snippet);

        for (const useCase of useCases) {
          if (!useCasesMap.has(useCase)) {
            useCasesMap.set(useCase, new Map());
          }

          const frameworkUseCases = useCasesMap.get(useCase)!;
          if (!frameworkUseCases.has(framework.id)) {
            frameworkUseCases.set(framework.id, []);
          }

          frameworkUseCases.get(framework.id)!.push({
            snippet,
            category: category.id,
          });
        }
      }
    }
  }

  // Generate pages for common use cases
  for (const useCase of COMMON_USE_CASES) {
    const frameworkUseCases = useCasesMap.get(useCase);
    if (!frameworkUseCases) continue;

    for (const [frameworkId, snippets] of frameworkUseCases) {
      const framework = frameworks.find((f) => f.id === frameworkId);
      if (!framework) continue;

      const page = await generateUseCasePage(useCase, framework, snippets);
      pages.push(page);

      // Ensure output directory exists
      await mkdir(join(OUTPUT_DIR, "use-case", frameworkId), {
        recursive: true,
      });

      // Write file
      await writeFile(page.path, page.content, "utf-8");
    }
  }

  const stats: BuildStats = {
    totalPages: pages.length,
    pagesByType: {
      "use-case": pages.length,
    },
    buildTime: Date.now() - startTime,
  };

  console.log(
    `Generated ${stats.totalPages} use case pages in ${stats.buildTime}ms`,
  );

  return { pages, stats };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateUseCasePages()
    .then(() => console.log("Use case pages generation complete!"))
    .catch((error) => {
      console.error("Error generating use case pages:", error);
      process.exit(1);
    });
}
