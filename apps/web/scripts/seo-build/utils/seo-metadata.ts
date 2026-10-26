/**
 * SEO metadata generation utilities
 */

import { SITE_URL } from "../constant.js";
import { PageMetadata, PageContext } from "../types.js";

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_TWITTER_IMAGE = `${SITE_URL}/twitter-image.png`;
const MAX_DESCRIPTION_LENGTH = 160;

/**
 * Title templates for different page types.
 * Display names are supplied by the generators so pages never expose raw slugs.
 */
const titleTemplates = {
  framework: (framework: string) =>
    `${framework} Snippets & Code Examples | Hanma`,
  category: (category: string, framework: string) =>
    `${framework} ${category} Snippets & Examples | Hanma`,
  snippet: (snippetName: string, framework: string, category: string) =>
    `${snippetName} | ${framework} ${category} Snippet | Hanma`,
  useCase: (useCase: string, framework: string) =>
    `${useCase} in ${framework} | Hanma`,
  guide: (guide: string, framework: string) =>
    `${guide} in ${framework} | Hanma`,
  pattern: (pattern: string, framework: string) =>
    `${pattern} in ${framework} | Hanma`,
  tag: (tag: string, framework: string) =>
    `${tag} Snippets for ${framework} | Hanma`,
  search: (query: string) => `${query} - Code Snippet Search | Hanma`,
  comparison: (first: string, second: string) =>
    `${first} vs ${second}: Framework Comparison | Hanma`,
  home: () => "Hanma | Production-Ready Backend Snippets",
};

/**
 * Description templates for different page types
 */
const descriptionTemplates = {
  framework: (framework: string, description: string) =>
    `Production-ready ${framework} snippets and modules. ${description} Copy-paste code for authentication, middleware, databases, and more.`,
  category: (
    category: string,
    framework: string,
    count: number,
    topFeatures: string[],
  ) => {
    const featureText =
      topFeatures.length > 0
        ? ` Includes ${topFeatures.slice(0, 3).join(", ")}.`
        : "";
    return `Browse ${count} ${category} snippets for ${framework}.${featureText} Copy-paste ready code for your next project.`;
  },
  snippet: (
    snippet: {
      description: string;
      features: string[];
      command: string;
    },
    framework: string,
    category: string,
  ) =>
    `${snippet.description}. ${framework} ${category} snippet. Features: ${snippet.features
      .slice(0, 3)
      .join(", ")}. Install with: ${snippet.command}`,
  useCase: (useCase: string, framework: string, count: number) =>
    `Learn how to implement ${useCase} in ${framework} with ${count} production-ready code snippets and examples.`,
  guide: (guide: string, framework: string) =>
    `Step-by-step guide to ${guide} in ${framework}, with production-ready snippets, code examples, and common solutions.`,
  pattern: (pattern: string, framework: string) =>
    `Learn the ${pattern} in ${framework} with production-ready examples and guidance on when to use it.`,
  tag: (tag: string, framework: string, count: number) =>
    `Browse ${count} ${tag} snippets for ${framework}, with copy-paste code examples and installation instructions.`,
  search: (query: string, count: number) =>
    `Search results for ${query}: ${count} matching code snippets across Express, Hono, Elysia, Fastify, and NestJS.`,
  comparison: (first: string, second: string) =>
    `Compare ${first} and ${second} side by side: performance, type safety, ecosystem, and available code snippets.`,
  home: () =>
    "Production-ready backend code snippets for Express, Hono, Elysia, Fastify, and NestJS. Copy-paste code for authentication, middleware, database, and more.",
};

const WORD_OVERRIDES: Record<string, string> = {
  api: "API",
  cors: "CORS",
  cqrs: "CQRS",
  csrf: "CSRF",
  graphql: "GraphQL",
  http: "HTTP",
  js: "JS",
  jwt: "JWT",
  mongodb: "MongoDB",
  nestjs: "NestJS",
  nodejs: "Node.js",
  oauth: "OAuth",
  orm: "ORM",
  postgresql: "PostgreSQL",
  rbac: "RBAC",
  rest: "REST",
  sse: "SSE",
  sql: "SQL",
  typeorm: "TypeORM",
  websocket: "WebSocket",
};

/**
 * Turn a slug into a readable display name.
 */
export function humanize(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      return (
        WORD_OVERRIDES[lower] ?? lower.charAt(0).toUpperCase() + lower.slice(1)
      );
    })
    .join(" ");
}

function getString(
  data: Record<string, unknown> | undefined,
  key: string,
  fallback: string,
): string {
  const value = data?.[key];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function getNumber(
  data: Record<string, unknown> | undefined,
  key: string,
): number {
  const value = data?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/**
 * Generate page metadata based on context
 */
export function generateMetadata(
  pageType: keyof typeof titleTemplates,
  context: PageContext,
  additionalData: Record<string, unknown> = {},
): PageMetadata {
  const {
    framework = "",
    category = "",
    snippet = "",
    useCase = "",
    guide = "",
    pattern = "",
    tag = "",
    query = "",
    comparison = "",
  } = context;

  const frameworkName = getString(
    additionalData,
    "frameworkName",
    humanize(framework),
  );
  const categoryName = getString(
    additionalData,
    "categoryName",
    humanize(category),
  );
  const useCaseName = getString(
    additionalData,
    "useCaseName",
    humanize(useCase),
  );
  const guideName = getString(additionalData, "guideName", humanize(guide));
  const patternName = getString(
    additionalData,
    "patternName",
    humanize(pattern),
  );
  const tagName = getString(additionalData, "tagName", humanize(tag));
  const searchQuery = getString(additionalData, "searchQuery", humanize(query));
  const firstFramework = getString(
    additionalData,
    "firstFramework",
    frameworkName,
  );
  const secondFramework = getString(
    additionalData,
    "secondFramework",
    frameworkName,
  );

  let title = "";
  let description = "";
  let canonical = "";
  let noindex = false;

  switch (pageType) {
    case "framework":
      title = titleTemplates.framework(frameworkName);
      description = descriptionTemplates.framework(
        frameworkName,
        getString(additionalData, "frameworkDescription", ""),
      );
      canonical = `${SITE_URL}/framework/${framework}`;
      break;

    case "category":
      title = titleTemplates.category(categoryName, frameworkName);
      description = descriptionTemplates.category(
        categoryName,
        frameworkName,
        getNumber(additionalData, "snippetCount"),
        Array.isArray(additionalData.topFeatures)
          ? (additionalData.topFeatures as string[])
          : [],
      );
      canonical = `${SITE_URL}/framework/${framework}/${category}`;
      break;

    case "snippet": {
      const snippetData = additionalData.snippetData as
        | {
            description?: string;
            features?: string[];
            command?: string;
          }
        | undefined;
      const normalizedSnippet = {
        description: snippetData?.description || "",
        features: Array.isArray(snippetData?.features)
          ? snippetData.features
          : [],
        command: snippetData?.command || "",
      };
      const snippetName = getString(
        additionalData,
        "snippetName",
        humanize(snippet),
      );

      title = titleTemplates.snippet(snippetName, frameworkName, categoryName);
      description = descriptionTemplates.snippet(
        normalizedSnippet,
        frameworkName,
        categoryName,
      );
      canonical = `${SITE_URL}/snippet/${framework}/${category}/${snippet}`;
      break;
    }

    case "useCase":
      title = titleTemplates.useCase(useCaseName, frameworkName);
      description = descriptionTemplates.useCase(
        useCaseName,
        frameworkName,
        getNumber(additionalData, "snippetCount"),
      );
      canonical = `${SITE_URL}/use-case/${framework}/${useCase}`;
      break;

    case "guide":
      title = titleTemplates.guide(guideName, frameworkName);
      description = descriptionTemplates.guide(guideName, frameworkName);
      canonical = `${SITE_URL}/guide/${guide}`;
      break;

    case "pattern":
      title = titleTemplates.pattern(patternName, frameworkName);
      description = descriptionTemplates.pattern(patternName, frameworkName);
      canonical = `${SITE_URL}/pattern/${pattern}`;
      noindex = getNumber(additionalData, "snippetCount") === 0;
      break;

    case "tag": {
      const snippetCount = getNumber(additionalData, "snippetCount");
      title = titleTemplates.tag(tagName, frameworkName);
      description = descriptionTemplates.tag(
        tagName,
        frameworkName,
        snippetCount,
      );
      canonical = `${SITE_URL}/tag/${framework}/${tag}`;
      // Empty tag pages are thin content and should not be indexed.
      noindex = snippetCount === 0;
      break;
    }

    case "search":
      title = titleTemplates.search(searchQuery);
      description = descriptionTemplates.search(
        searchQuery,
        getNumber(additionalData, "resultCount"),
      );
      canonical = `${SITE_URL}/search/${query}`;
      // Search result pages are generated from query lists and are not
      // canonical landing pages, so keep them out of the index.
      noindex = true;
      break;

    case "comparison":
      title = titleTemplates.comparison(firstFramework, secondFramework);
      description = descriptionTemplates.comparison(
        firstFramework,
        secondFramework,
      );
      canonical = `${SITE_URL}/compare/${comparison}`;
      break;

    case "home":
      title = titleTemplates.home();
      description = descriptionTemplates.home();
      canonical = `${SITE_URL}/`;
      break;
  }

  const normalizedDescription = truncate(description, MAX_DESCRIPTION_LENGTH);

  return {
    title,
    description: normalizedDescription,
    canonical,
    ogTitle: title,
    ogDescription: normalizedDescription,
    ogImage: DEFAULT_OG_IMAGE,
    twitterImage: DEFAULT_TWITTER_IMAGE,
    noindex,
  };
}

/**
 * Generate JSON-LD structured data for code snippets
 */
export function generateSnippetJsonLd(
  snippetName: string,
  description: string,
  framework: string,
  codeSample?: string,
): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: snippetName,
    description,
    programmingLanguage: "TypeScript",
    framework,
    codeRepository: "https://github.com/itstheanurag/hanma",
    license: "MIT",
    author: {
      "@type": "Organization",
      name: "Hanma",
      url: `${SITE_URL}/`,
    },
    ...(codeSample && {
      codeSample: {
        "@type": "Code",
        text: codeSample,
      },
    }),
  };

  return JSON.stringify(jsonLd, null, 2);
}

/**
 * Generate JSON-LD structured data for framework pages
 */
export function generateFrameworkJsonLd(
  framework: string,
  description: string,
  snippetCount: number,
  canonical: string,
): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${framework} Snippets & Code Examples`,
    description,
    url: canonical,
    isPartOf: {
      "@type": "WebSite",
      name: "Hanma",
      url: `${SITE_URL}/`,
    },
    about: {
      "@type": "SoftwareApplication",
      name: framework,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      name: `${framework} snippets`,
      numberOfItems: snippetCount,
    },
  };

  return JSON.stringify(jsonLd, null, 2);
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return JSON.stringify(jsonLd, null, 2);
}

/**
 * Slugify text for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

/**
 * Truncate text to specified length without cutting through a word when possible.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const slice = text.slice(0, maxLength - 3);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice;

  return `${cut.trimEnd()}...`;
}
