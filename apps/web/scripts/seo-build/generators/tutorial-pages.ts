/**
 * Tutorial/guide page generator
 * Generates SEO-optimized tutorial pages for common tasks
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

// Common tutorial topics
const TUTORIAL_TOPICS = [
  {
    id: "setup-project",
    title: "Set Up a New Project",
    keywords: ["setup", "init", "new project", "boilerplate"],
  },
  {
    id: "create-api",
    title: "Create a REST API",
    keywords: ["api", "rest", "endpoint", "route"],
  },
  {
    id: "add-authentication",
    title: "Add Authentication",
    keywords: ["auth", "login", "jwt", "session"],
  },
  {
    id: "add-validation",
    title: "Add Input Validation",
    keywords: ["validate", "schema", "input"],
  },
  {
    id: "add-error-handling",
    title: "Add Error Handling",
    keywords: ["error", "exception", "handle"],
  },
  {
    id: "add-logging",
    title: "Add Logging",
    keywords: ["log", "logger", "monitor"],
  },
  {
    id: "add-rate-limiting",
    title: "Add Rate Limiting",
    keywords: ["rate", "limit", "throttle"],
  },
  {
    id: "add-cors",
    title: "Configure CORS",
    keywords: ["cors", "cross-origin", "origin"],
  },
  {
    id: "connect-database",
    title: "Connect to Database",
    keywords: ["db", "database", "sql", "prisma"],
  },
  {
    id: "add-file-upload",
    title: "Handle File Uploads",
    keywords: ["upload", "file", "multipart"],
  },
  {
    id: "write-tests",
    title: "Write Tests",
    keywords: ["test", "mock", "unit"],
  },
  {
    id: "deploy-production",
    title: "Deploy to Production",
    keywords: ["deploy", "production", "docker", "pm2"],
  },
];

/**
 * Find snippets related to a topic
 */
function findRelatedSnippets(
  snippets: Snippet[],
  keywords: string[],
): Snippet[] {
  return snippets.filter((snippet) => {
    const text = [
      snippet.purpose,
      snippet.description,
      ...snippet.features,
      snippet.name,
      snippet.displayName,
    ]
      .join(" ")
      .toLowerCase();

    return keywords.some((kw) => text.includes(kw.toLowerCase()));
  });
}

/**
 * Generate tutorial page content
 */
function generateTutorialContent(
  topic: { id: string; title: string; keywords: string[] },
  framework: { id: string; name: string },
  relatedSnippets: Snippet[],
): string {
  const slug = slugify(`${framework.id}-${topic.id}`);

  return `<header class="page-header">
  <h1>${topic.title} in ${framework.name}</h1>
  <p class="page-description">
    Learn how to ${topic.title.toLowerCase()} in ${framework.name} with step-by-step instructions
    and production-ready code snippets.
  </p>
</header>

${generateBreadcrumb([
  { name: "Home", url: "/" },
  { name: framework.name, url: `/framework/${framework.id}` },
  { name: "Guides", url: `/guide/${framework.id}` },
  { name: topic.title, url: `/guide/${slug}` },
])}

<main class="page-content">
  <section class="tutorial-overview">
    <h2>Overview</h2>
    <p>
      This guide will walk you through ${topic.title.toLowerCase()} in ${framework.name}.
      ${
        relatedSnippets.length > 0
          ? `We've found ${relatedSnippets.length} relevant code snippets to help you get started.`
          : "Browse our snippet library for related code examples."
      }
    </p>
  </section>

  <section class="prerequisites">
    <h2>Prerequisites</h2>
    <ul>
      <li>Node.js 18+ installed</li>
      <li>${framework.name} project initialized</li>
      <li>Basic understanding of ${framework.name}</li>
    </ul>
  </section>

  <section class="steps">
    <h2>Step-by-Step Guide</h2>

    <div class="step">
      <h3>Step 1: Install Dependencies</h3>
      <p>First, install any required dependencies for ${topic.title.toLowerCase()}:</p>
      ${generateCodeBlock(`npm install ${relatedSnippets[0]?.dependencies.join(" ") || ""}`, "bash")}
    </div>

    <div class="step">
      <h3>Step 2: Copy the Code</h3>
      <p>Use our pre-built snippets to implement ${topic.title.toLowerCase()}:</p>
      <div class="snippets-grid">
        ${relatedSnippets
          .slice(0, 3)
          .map(
            (snippet) => `
          <article class="snippet-card">
            <a href="/snippet/${framework.id}/${snippet.id}" class="snippet-link">
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

    <div class="step">
      <h3>Step 3: Test Your Implementation</h3>
      <p>Verify that your implementation works correctly:</p>
      ${generateCodeBlock(`npm test\n# or\nnpm run test:watch`, "bash")}
    </div>
  </section>

  ${
    relatedSnippets.length > 0
      ? `
  <section class="available-snippets">
    <h2>Available Snippets for This Topic</h2>
    <div class="snippets-list">
      ${relatedSnippets
        .map(
          (snippet) => `
        <article class="snippet-item">
          <h3><a href="/snippet/${framework.id}/${snippet.id}">${snippet.displayName}</a></h3>
          <p>${snippet.description}</p>
          <code>${snippet.command}</code>
        </article>
      `,
        )
        .join("\n")}
    </div>
  </section>
  `
      : ""
  }

  ${generateFaqSection([
    {
      question: `How do I implement ${topic.title.toLowerCase()} in ${framework.name}?`,
      answer:
        "Follow the step-by-step guide above. Each step includes code examples and explanations. You can also browse the related snippets for more implementation details.",
    },
    {
      question: "Are these code examples production-ready?",
      answer:
        "Yes, all snippets are designed for production use. However, always review and adapt the code to your specific requirements before deployment.",
    },
    {
      question: `Can I use this guide with ${framework.name} v2?`,
      answer:
        "This guide is written for the current stable version. Check the framework documentation for version-specific differences.",
    },
    {
      question: "Where can I find more examples?",
      answer:
        "Browse our complete snippet library for more code examples and implementations.",
    },
  ])}
</main>`;
}

/**
 * Generate tutorial page
 */
async function generateTutorialPage(
  topic: { id: string; title: string; keywords: string[] },
  framework: { id: string; name: string; description: string },
): Promise<GeneratedPage> {
  const categories = await loadFrameworkCategories(framework.id);
  const allSnippets = categories.flatMap((cat) => cat.snippets);
  const relatedSnippets = findRelatedSnippets(allSnippets, topic.keywords);

  const slug = slugify(`${framework.id}-${topic.id}`);
  const metadata = generateMetadata(
    "guide",
    { guide: slug, framework: framework.id },
    { tutorialTopic: topic.title, snippetCount: relatedSnippets.length },
  );

  const content = generateTutorialContent(topic, framework, relatedSnippets);

  const jsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: framework.name, url: `${SITE_URL}/framework/${framework.id}` },
    { name: "Guides", url: `${SITE_URL}/guide/${framework.id}` },
    { name: topic.title, url: `${SITE_URL}/guide/${slug}` },
  ]);

  const fullPage = generateFullPage(metadata, content, jsonLd);

  return {
    path: join(OUTPUT_DIR, "guide", `${slug}.html`),
    content: fullPage,
    metadata,
  };
}

/**
 * Generate all tutorial pages
 */
export async function generateTutorialPages(): Promise<{
  pages: GeneratedPage[];
  stats: BuildStats;
}> {
  const startTime = Date.now();
  const pages: GeneratedPage[] = [];

  console.log("Generating tutorial pages...");

  const frameworks = await loadAllFrameworks();

  for (const framework of frameworks) {
    for (const topic of TUTORIAL_TOPICS) {
      const page = await generateTutorialPage(topic, framework);
      pages.push(page);

      // Ensure output directory exists
      await mkdir(join(OUTPUT_DIR, "guide"), { recursive: true });

      // Write file
      await writeFile(page.path, page.content, "utf-8");
    }

    console.log(
      `  Generated ${TUTORIAL_TOPICS.length} tutorials for ${framework.name}`,
    );
  }

  const stats: BuildStats = {
    totalPages: pages.length,
    pagesByType: {
      tutorial: pages.length,
    },
    buildTime: Date.now() - startTime,
  };

  console.log(
    `Generated ${stats.totalPages} tutorial pages in ${stats.buildTime}ms`,
  );

  return { pages, stats };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTutorialPages()
    .then(() => console.log("Tutorial pages generation complete!"))
    .catch((error) => {
      console.error("Error generating tutorial pages:", error);
      process.exit(1);
    });
}
