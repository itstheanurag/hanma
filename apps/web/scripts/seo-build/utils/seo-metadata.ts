/**
 * SEO metadata generation utilities
 */

import { SITE_URL } from "../constant.js";
import { PageMetadata, PageContext } from "../types.js";

/**
 * Title templates for different page types
 */
const titleTemplates = {
  framework: (framework: string) =>
    `${framework} Snippets & Code Examples | Hanma`,
  category: (category: string, framework: string) =>
    `${category} ${framework} Snippets | Hanma`,
  snippet: (snippetName: string, framework: string, category: string) =>
    `${snippetName} - ${framework} ${category} Snippet | Hanma`,
  useCase: (useCase: string, framework: string) =>
    `${useCase} in ${framework} | Code Example | Hanma`,
  guide: (task: string, framework: string) =>
    `How to ${task} in ${framework} | Tutorial | Hanma`,
  pattern: (pattern: string, framework: string) =>
    `${pattern} Pattern | ${framework} Implementation | Hanma`,
  tag: (tag: string, framework: string) =>
    `${tag} Snippets | ${framework} Code Examples | Hanma`,
  search: (query: string, framework: string) =>
    `${query} | ${framework} Code Snippets | Hanma`,
  home: () => "Hanma - Backend Code Snippets Library",
};

/**
 * Description templates for different page types
 */
const descriptionTemplates = {
  framework: (framework: string, description: string) =>
    `Production-ready ${framework} snippets, templates, and modules. ${description}. Copy-paste code for authentication, middleware, database, and more.`,
  category: (
    category: string,
    framework: string,
    count: number,
    topFeatures: string[],
  ) =>
    `Browse ${count} ${category} ${framework} snippets. Includes ${topFeatures.slice(0, 3).join(", ")}. Copy and paste into your project.`,
  snippet: (snippet: {
    description: string;
    features: string[];
    command: string;
  }) =>
    `${snippet.description}. Features: ${snippet.features.slice(0, 3).join(", ")}. Install with: ${snippet.command}`,
  useCase: (useCase: string, framework: string) =>
    `Learn how to implement ${useCase} in ${framework}. Complete code example with explanations and best practices.`,
  guide: (task: string, framework: string) =>
    `Step-by-step tutorial: ${task} in ${framework}. Includes code examples, common issues, and solutions.`,
  pattern: (pattern: string, framework: string) =>
    `Understand ${pattern} pattern in ${framework}. Implementation examples and when to use it.`,
  tag: (tag: string, framework: string, count: number, topSnippets: string[]) =>
    `Explore ${count} ${tag} snippets for ${framework}. Includes ${topSnippets.slice(0, 3).join(", ")}.`,
  search: (query: string, framework: string, resultCount: number) =>
    `Find ${query} code snippets for ${framework}. ${resultCount} results found.`,
  home: () =>
    "Production-ready backend code snippets for Express, Hono, Elysia, Fastify, and NestJS. Copy-paste code for authentication, middleware, database, and more.",
};

/**
 * Generate page metadata based on context
 */
export function generateMetadata(
  pageType: keyof typeof titleTemplates,
  context: PageContext,
  additionalData?: Record<string, unknown>,
): PageMetadata {
  const { framework, category, snippet, useCase, guide, pattern, tag, query } =
    context;

  let title = "";
  let description = "";
  let canonical = "";

  switch (pageType) {
    case "framework":
      title = titleTemplates.framework(framework || "");
      description = descriptionTemplates.framework(
        framework || "",
        (additionalData?.frameworkDescription as string) || "",
      );
      canonical = `${SITE_URL}/framework/${framework}`;
      break;

    case "category":
      title = titleTemplates.category(category || "", framework || "");
      description = descriptionTemplates.category(
        category || "",
        framework || "",
        (additionalData?.snippetCount as number) || 0,
        (additionalData?.topFeatures as string[]) || [],
      );
      canonical = `${SITE_URL}/framework/${framework}/${category}`;
      break;

    case "snippet":
      title = titleTemplates.snippet(
        snippet || "",
        framework || "",
        category || "",
      );
      description = descriptionTemplates.snippet(
        additionalData?.snippetData as {
          description: string;
          features: string[];
          command: string;
        },
      );
      canonical = `${SITE_URL}/snippet/${framework}/${category}/${snippet}`;
      break;

    case "useCase":
      title = titleTemplates.useCase(useCase || "", framework || "");
      description = descriptionTemplates.useCase(
        useCase || "",
        framework || "",
      );
      canonical = `${SITE_URL}/use-case/${useCase}`;
      break;

    case "guide":
      title = titleTemplates.guide(guide || "", framework || "");
      description = descriptionTemplates.guide(guide || "", framework || "");
      canonical = `${SITE_URL}/guide/${guide}`;
      break;

    case "pattern":
      title = titleTemplates.pattern(pattern || "", framework || "");
      description = descriptionTemplates.pattern(
        pattern || "",
        framework || "",
      );
      canonical = `${SITE_URL}/pattern/${pattern}`;
      break;

    case "tag":
      title = titleTemplates.tag(tag || "", framework || "");
      description = descriptionTemplates.tag(
        tag || "",
        framework || "",
        (additionalData?.snippetCount as number) || 0,
        (additionalData?.topSnippets as string[]) || [],
      );
      canonical = `${SITE_URL}/tag/${tag}`;
      break;

    case "search":
      title = titleTemplates.search(query || "", framework || "");
      description = descriptionTemplates.search(
        query || "",
        framework || "",
        (additionalData?.resultCount as number) || 0,
      );
      canonical = `${SITE_URL}/search/${query}`;
      break;

    case "home":
      title = titleTemplates.home();
      description = descriptionTemplates.home();
      canonical = SITE_URL;
      break;
  }

  return {
    title,
    description,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogImage: `${SITE_URL}/og-image.png`,
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
      url: SITE_URL,
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
): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: framework,
    description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: snippetCount,
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
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
