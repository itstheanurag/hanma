/**
 * Code pattern page generator
 * Generates SEO-optimized pages for software design patterns
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
  generateCodeBlock,
  generateFaqSection,
} from "../utils/html-templates.js";
import { GeneratedPage, BuildStats, Snippet } from "../types.js";
import { SITE_URL } from "../constant.js";

const OUTPUT_DIR = join(process.cwd(), "../../dist/seo");

// Software design patterns
const PATTERNS = [
  {
    id: "repository-pattern",
    name: "Repository Pattern",
    description: "Decouple data access layer from business logic",
    keywords: ["repository", "data access", "database", "crud", "dao"],
  },
  {
    id: "factory-pattern",
    name: "Factory Pattern",
    description: "Create objects without specifying their concrete classes",
    keywords: ["factory", "create", "instantiate", "builder"],
  },
  {
    id: "singleton-pattern",
    name: "Singleton Pattern",
    description: "Ensure a class has only one instance",
    keywords: ["singleton", "single instance", "global"],
  },
  {
    id: "strategy-pattern",
    name: "Strategy Pattern",
    description: "Define a family of algorithms and make them interchangeable",
    keywords: ["strategy", "algorithm", "behavior", " interchangeable"],
  },
  {
    id: "observer-pattern",
    name: "Observer Pattern",
    description: "Define a one-to-many dependency between objects",
    keywords: ["observer", "subscribe", "publish", "event", "listener"],
  },
  {
    id: "decorator-pattern",
    name: "Decorator Pattern",
    description: "Add behavior to objects dynamically",
    keywords: ["decorator", "wrapper", "enhance", "compose"],
  },
  {
    id: "middleware-pattern",
    name: "Middleware Pattern",
    description: "Chain processing objects to handle requests",
    keywords: ["middleware", "chain", "pipeline", "filter"],
  },
  {
    id: "dependency-injection",
    name: "Dependency Injection",
    description: "Supply dependencies from external sources",
    keywords: ["dependency", "injection", "ioc", "container", "provider"],
  },
  {
    id: "unit-of-work",
    name: "Unit of Work",
    description: "Maintain a list of objects and coordinate writing",
    keywords: ["unit of work", "transaction", "atomic", "batch"],
  },
  {
    id: " cqrs",
    name: "CQRS Pattern",
    description: "Separate read and write operations",
    keywords: ["cqrs", "command query", "separation", "read", "write"],
  },
];

/**
 * Find snippets related to a pattern
 */
function findPatternSnippets(
  snippets: Snippet[],
  keywords: string[],
): Array<{ snippet: Snippet; score: number }> {
  return snippets
    .map((snippet) => {
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

      for (const keyword of keywords) {
        if (text.includes(keyword.toLowerCase())) {
          score += 3;
        }
      }

      return { snippet, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Generate pattern page content
 */
function generatePatternContent(
  pattern: (typeof PATTERNS)[0],
  framework: { id: string; name: string },
  relatedSnippets: Array<{ snippet: Snippet; score: number }>,
): string {
  const slug = slugify(`${framework.id}-${pattern.id}`);

  return `<header class="page-header">
  <h1>${pattern.name} in ${framework.name}</h1>
  <p class="page-description">
    Implement ${pattern.name.toLowerCase()} in ${framework.name}. ${pattern.description}
    Production-ready code snippets and examples.
  </p>
</header>

${generateBreadcrumb([
  { name: "Home", url: "/" },
  { name: framework.name, url: `/framework/${framework.id}` },
  { name: "Patterns", url: `/pattern/${framework.id}` },
  { name: pattern.name, url: `/pattern/${slug}` },
])}

<main class="page-content">
  <section class="pattern-overview">
    <h2>Overview</h2>
    <p>${pattern.description}</p>
    <div class="pattern-info">
      <span class="pattern-badge">${pattern.name}</span>
      <span class="snippet-count">${relatedSnippets.length} implementations available</span>
    </div>
  </section>

  <section class="when-to-use">
    <h2>When to Use</h2>
    <ul>
      <li>When you need to abstract data access logic</li>
      <li>When you want to make your code testable</li>
      <li>When you need to support multiple data sources</li>
      <li>When you want to decouple business logic from infrastructure</li>
    </ul>
  </section>

  ${
    relatedSnippets.length > 0
      ? `
  <section class="implementations">
    <h2>Available Implementations</h2>
    <div class="implementations-grid">
      ${relatedSnippets
        .slice(0, 6)
        .map(
          ({ snippet }) => `
        <article class="implementation-card">
          <a href="/snippet/${framework.id}/${snippet.id}" class="implementation-link">
            <h3>${snippet.displayName}</h3>
            <p>${snippet.description}</p>
            <code>${snippet.command}</code>
            <div class="features">
              ${snippet.features
                .slice(0, 3)
                .map((f) => `<span class="feature-tag">${f}</span>`)
                .join("")}
            </div>
          </a>
        </article>
      `,
        )
        .join("\n")}
    </div>
  </section>
  `
      : ""
  }

  <section class="example">
    <h2>Basic Example</h2>
    ${generateCodeBlock(
      `// ${pattern.name} implementation example
// This shows the basic structure of ${pattern.name.toLowerCase()} in ${framework.name}

// Define your interface
interface IRepository {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<void>;
}

// Implement the pattern
class ${pattern.name.split(" ")[0]}Repository implements IRepository {
  async findAll(): Promise<T[]> {
    // Implementation
  }

  async findById(id: string): Promise<T | null> {
    // Implementation
  }

  async create(data: CreateDto): Promise<T> {
    // Implementation
  }

  async update(id: string, data: UpdateDto): Promise<T> {
    // Implementation
  }

  async delete(id: string): Promise<void> {
    // Implementation
  }
}

// Use the pattern
const repository = new ${pattern.name.split(" ")[0]}Repository();
const items = await repository.findAll();`,
      "typescript",
    )}
  </section>

  ${generateFaqSection([
    {
      question: `What is ${pattern.name}?`,
      answer: `${pattern.description}. It's a well-established software design pattern that helps organize code for better maintainability and testability.`,
    },
    {
      question: `How does ${pattern.name} work with ${framework.name}?`,
      answer: `${framework.name} provides excellent support for this pattern through its dependency injection system and middleware composition.`,
    },
    {
      question: "What are the benefits?",
      answer:
        "Improved testability, separation of concerns, easier maintenance, and flexibility to change implementations without affecting business logic.",
    },
    {
      question: "When should I avoid this pattern?",
      answer:
        "For very simple applications with minimal logic, the pattern may add unnecessary complexity. Use judgment based on project requirements.",
    },
  ])}
</main>`;
}

/**
 * Generate pattern page
 */
async function generatePatternPage(
  pattern: (typeof PATTERNS)[0],
  framework: { id: string; name: string; description: string },
): Promise<GeneratedPage> {
  const categories = await loadFrameworkCategories(framework.id);
  const allSnippets = categories.flatMap((cat) => cat.snippets);
  const relatedSnippets = findPatternSnippets(allSnippets, pattern.keywords);

  const slug = slugify(`${framework.id}-${pattern.id}`);
  const metadata = generateMetadata(
    "pattern",
    { pattern: slug, framework: framework.id },
    { patternName: pattern.name, snippetCount: relatedSnippets.length },
  );

  const content = generatePatternContent(pattern, framework, relatedSnippets);

  const jsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: framework.name, url: `${SITE_URL}/framework/${framework.id}` },
    { name: "Patterns", url: `${SITE_URL}/pattern/${framework.id}` },
    { name: pattern.name, url: `${SITE_URL}/pattern/${slug}` },
  ]);

  const fullPage = generateFullPage(metadata, content, jsonLd);

  return {
    path: join(OUTPUT_DIR, "pattern", `${slug}.html`),
    content: fullPage,
    metadata,
  };
}

/**
 * Generate all pattern pages
 */
export async function generatePatternPages(): Promise<{
  pages: GeneratedPage[];
  stats: BuildStats;
}> {
  const startTime = Date.now();
  const pages: GeneratedPage[] = [];

  console.log("Generating pattern pages...");

  const frameworks = await loadAllFrameworks();

  for (const framework of frameworks) {
    for (const pattern of PATTERNS) {
      const page = await generatePatternPage(pattern, framework);
      pages.push(page);

      // Ensure output directory exists
      await mkdir(join(OUTPUT_DIR, "pattern"), { recursive: true });

      // Write file
      await writeFile(page.path, page.content, "utf-8");
    }

    console.log(
      `  Generated ${PATTERNS.length} pattern pages for ${framework.name}`,
    );
  }

  const stats: BuildStats = {
    totalPages: pages.length,
    pagesByType: {
      pattern: pages.length,
    },
    buildTime: Date.now() - startTime,
  };

  console.log(
    `Generated ${stats.totalPages} pattern pages in ${stats.buildTime}ms`,
  );

  return { pages, stats };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generatePatternPages()
    .then(() => console.log("Pattern pages generation complete!"))
    .catch((error) => {
      console.error("Error generating pattern pages:", error);
      process.exit(1);
    });
}
