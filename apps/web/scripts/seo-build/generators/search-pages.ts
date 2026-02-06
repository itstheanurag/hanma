/**
 * Search result page generator
 * Generates SEO-optimized search result pages for common queries
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

// Common search queries
const SEARCH_QUERIES = [
  // Express.js
  "express js middleware example",
  "express js custom middleware",
  "express js error handling",
  "express js async error handler",
  "express js validation",
  "express js request validation",
  "express js jwt authentication",
  "express js oauth authentication",
  "express js session management",
  "express js cors",
  "express js rate limiting",
  "express js logging",
  "express js morgan logging",
  "express js database connection",
  "express js mongodb integration",
  "express js postgresql integration",
  "express js prisma example",
  "express js sequelize example",
  "express js file upload",
  "express js multer example",
  "express js image upload",
  "express js websocket",
  "express js socket.io",
  "express js api versioning",
  "express js health check",
  "express js security best practices",
  "express js helmet",
  "express js csrf protection",
  "express js unit testing",
  "express js jest testing",
  "express js supertest example",
  "express js production setup",

  // Hono.js
  "hono js middleware",
  "hono js custom middleware",
  "hono js authentication",
  "hono js jwt authentication",
  "hono js oauth",
  "hono js cors",
  "hono js rate limiter",
  "hono js logging",
  "hono js error handling",
  "hono js global error handler",
  "hono js validation",
  "hono js zod validation",
  "hono js database",
  "hono js drizzle orm",
  "hono js prisma",
  "hono js cloudflare workers",
  "hono js bun runtime",
  "hono js deno runtime",
  "hono js file upload",
  "hono js multipart form",
  "hono js testing",
  "hono js unit tests",
  "hono js api versioning",
  "hono js security headers",
  "hono js performance",
  "hono js edge functions",

  // Elysia.js
  "elysia js getting started",
  "elysia js middleware",
  "elysia js plugin example",
  "elysia js jwt",
  "elysia js authentication",
  "elysia js validation",
  "elysia js typebox validation",
  "elysia js error handler",
  "elysia js global error handling",
  "elysia js cors",
  "elysia js security headers",
  "elysia js rate limiting",
  "elysia js logging",
  "elysia js request lifecycle",
  "elysia js database integration",
  "elysia js prisma",
  "elysia js drizzle orm",
  "elysia js websocket",
  "elysia js real time",
  "elysia js file upload",
  "elysia js testing",
  "elysia js bun performance",
  "elysia js production deployment",

  // Fastify
  "fastify getting started",
  "fastify middleware",
  "fastify hooks",
  "fastify authentication",
  "fastify jwt",
  "fastify oauth",
  "fastify rate limiting",
  "fastify validation",
  "fastify schema validation",
  "fastify error handling",
  "fastify custom error handler",
  "fastify logging",
  "fastify pino logging",
  "fastify database integration",
  "fastify prisma",
  "fastify mongodb",
  "fastify postgresql",
  "fastify websocket",
  "fastify socket.io",
  "fastify file upload",
  "fastify multipart",
  "fastify testing",
  "fastify jest",
  "fastify api versioning",
  "fastify security headers",
  "fastify helmet",
  "fastify performance tuning",
  "fastify production best practices",

  // NestJS
  "nestjs controller",
  "nestjs service",
  "nestjs module",
  "nestjs provider",
  "nestjs dependency injection",
  "nestjs guard",
  "nestjs auth guard",
  "nestjs jwt authentication",
  "nestjs passport",
  "nestjs interceptor",
  "nestjs logging interceptor",
  "nestjs pipe",
  "nestjs validation pipe",
  "nestjs custom decorator",
  "nestjs exception filter",
  "nestjs global error handling",
  "nestjs middleware",
  "nestjs rate limiting",
  "nestjs throttler",
  "nestjs cors",
  "nestjs database integration",
  "nestjs prisma",
  "nestjs typeorm",
  "nestjs mongoose",
  "nestjs websocket gateway",
  "nestjs graphql",
  "nestjs rest api best practices",
  "nestjs testing",
  "nestjs e2e testing",
  "nestjs jest",
  "nestjs production deployment",
  "nestjs microservices",
  "nestjs kafka",
  "nestjs redis cache"
];


interface SearchResult {
  snippet: Snippet;
  score: number;
  framework: string;
  category: string;
}

/**
 * Find snippets matching a search query
 */
function findMatchingSnippets(
  snippets: Snippet[],
  query: string,
): Array<{ snippet: Snippet; score: number }> {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);

  const matches = snippets.map((snippet) => {
    let score = 0;

    const text = [
      snippet.purpose,
      snippet.description,
      ...snippet.features,
      snippet.name,
      snippet.displayName,
    ]
      .join(" ")
      .toLowerCase();

    // Exact phrase match
    if (text.includes(queryLower)) {
      score += 10;
    }

    // Word matches
    for (const word of queryWords) {
      if (text.includes(word)) {
        score += 2;
      }
    }

    // Name match (highest weight)
    if (snippet.name.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    return { snippet, score };
  });

  return matches.filter((m) => m.score > 0).sort((a, b) => b.score - a.score);
}

/**
 * Generate search page content
 */
function generateSearchContent(query: string, results: SearchResult[]): string {
  const slug = slugify(query);

  return `<header class="page-header">
  <h1>Search Results: ${query}</h1>
  <p class="page-description">
    Found ${results.length} code snippets matching "${query}".
    Browse below to find the perfect solution for your needs.
  </p>
</header>

${generateBreadcrumb([
  { name: "Home", url: "/" },
  { name: "Search", url: "/search" },
  { name: query, url: `/search/${slug}` },
])}

<main class="page-content">
  ${
    results.length > 0
      ? `
  <section class="search-results">
    <h2>Results</h2>
    <div class="results-info">
      <p>Showing ${Math.min(results.length, 10)} of ${results.length} results</p>
    </div>
    <div class="results-list">
      ${results
        .slice(0, 20)
        .map(
          ({ snippet, framework, category }) => `
        <article class="result-card">
          <a href="/snippet/${framework}/${category}/${snippet.id}" class="result-link">
            <h3>${snippet.displayName}</h3>
            <p class="result-description">${snippet.description}</p>
            <div class="result-meta">
              <span class="framework-badge">${framework}</span>
              <span class="category-badge">${category}</span>
            </div>
            <code class="result-command">${snippet.command}</code>
          </a>
        </article>
      `,
        )
        .join("\n")}
    </div>
  </section>
  `
      : `
  <section class="no-results">
    <h2>No Results Found</h2>
    <p>We couldn't find any snippets matching "${query}".</p>
    <div class="suggestions">
      <h3>Suggestions:</h3>
      <ul>
        <li>Check your spelling</li>
        <li>Try more general keywords</li>
        <li>Browse our framework pages</li>
      </ul>
    </div>
  </section>
  `
  }

  ${generateFaqSection([
    {
      question: `What if I can't find what I'm looking for?`,
      answer:
        "Browse our framework pages to explore all available snippets, or use the search on our main page.",
    },
    {
      question: "Can I request a new snippet?",
      answer:
        "Yes! We're always adding new snippets. Check our GitHub repository to request or contribute new code examples.",
    },
    {
      question: "How are search results ranked?",
      answer:
        "Results are ranked by relevance based on how well the snippet matches your search query, including name, description, and features.",
    },
  ])}
</main>`;
}

/**
 * Generate search page
 */
async function generateSearchPage(query: string): Promise<GeneratedPage> {
  const frameworks = await loadAllFrameworks();
  const allResults: SearchResult[] = [];

  for (const framework of frameworks) {
    const categories = await loadFrameworkCategories(framework.id);

    for (const category of categories) {
      const matches = findMatchingSnippets(category.snippets, query);
      for (const match of matches) {
        allResults.push({
          snippet: match.snippet,
          score: match.score,
          framework: framework.id,
          category: category.id,
        });
      }
    }
  }

  // Sort by score
  allResults.sort((a, b) => b.score - a.score);

  const slug = slugify(query);
  const metadata = generateMetadata(
    "search",
    { query: slug },
    { searchQuery: query, resultCount: allResults.length },
  );

  const content = generateSearchContent(query, allResults);

  const jsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Search", url: `${SITE_URL}/search` },
    { name: query, url: `${SITE_URL}/search/${slug}` },
  ]);

  const fullPage = generateFullPage(metadata, content, jsonLd);

  return {
    path: join(OUTPUT_DIR, "search", `${slug}.html`),
    content: fullPage,
    metadata,
  };
}

/**
 * Generate all search pages
 */
export async function generateSearchPages(): Promise<{
  pages: GeneratedPage[];
  stats: BuildStats;
}> {
  const startTime = Date.now();
  const pages: GeneratedPage[] = [];

  console.log("Generating search pages...");

  for (const query of SEARCH_QUERIES) {
    const page = await generateSearchPage(query);
    pages.push(page);

    // Ensure output directory exists
    await mkdir(join(OUTPUT_DIR, "search"), { recursive: true });

    // Write file
    await writeFile(page.path, page.content, "utf-8");
  }

  const stats: BuildStats = {
    totalPages: pages.length,
    pagesByType: {
      search: pages.length,
    },
    buildTime: Date.now() - startTime,
  };

  console.log(
    `Generated ${stats.totalPages} search pages in ${stats.buildTime}ms`,
  );

  return { pages, stats };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSearchPages()
    .then(() => console.log("Search pages generation complete!"))
    .catch((error) => {
      console.error("Error generating search pages:", error);
      process.exit(1);
    });
}
