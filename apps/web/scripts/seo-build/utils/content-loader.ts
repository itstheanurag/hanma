/**
 * Content loader utilities
 * Reads and parses JSON content from docs directory
 */

import { readFile } from "fs/promises";
import { join } from "path";
import {
  Framework,
  FrameworkContent,
  Category,
  Snippet,
  Module,
} from "../types.js";

const DOCS_DIR = join(process.cwd(), "../../src/docs");

/**
 * Load all framework content
 */
export async function loadAllFrameworks(): Promise<Framework[]> {
  const frameworks: Framework[] = [
    {
      id: "express",
      name: "Express.js",
      description:
        "The battle-tested standard. Middleware and controllers compatible with Express 4 and 5.",
    },
    {
      id: "hono",
      name: "Hono",
      description:
        "Ultrafast web framework for the Edge. Runs on Cloudflare Workers, Deno, and Bun.",
    },
    {
      id: "elysia",
      name: "Elysia",
      description:
        "Ergonomic framework for Bun. End-to-end type safety with TypeBox integration.",
    },
    {
      id: "fastify",
      name: "Fastify",
      description:
        "Fast and low overhead web framework, focused on providing the best developer experience.",
    },
    {
      id: "nest",
      name: "NestJS",
      description:
        "A progressive Node.js framework for building efficient, scalable, and enterprise-grade server-side applications.",
    },
  ];

  return frameworks;
}

/**
 * Load framework content from JSON file
 */
export async function loadFrameworkContent(
  frameworkId: string,
): Promise<FrameworkContent | null> {
  try {
    const indexPath = join(DOCS_DIR, "snippets", frameworkId, "index.json");
    const content = await readFile(indexPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Could not load framework content for ${frameworkId}:`, error);
    return null;
  }
}

/**
 * Load category content for a framework
 */
export async function loadCategoryContent(
  frameworkId: string,
  categoryId: string,
): Promise<Category | null> {
  try {
    const categoryPath = join(
      DOCS_DIR,
      "snippets",
      frameworkId,
      `${categoryId}.json`,
    );
    const content = await readFile(categoryPath, "utf-8");
    const data = JSON.parse(content);

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      // Flatten snippets from all subcategories
      snippets:
        data.subcategories?.flatMap(
          (sub: { snippets: Snippet[] }) => sub.snippets,
        ) || [],
    };
  } catch (error) {
    console.warn(
      `Could not load category ${categoryId} for ${frameworkId}:`,
      error,
    );
    return null;
  }
}

/**
 * Load all categories for a framework
 */
export async function loadFrameworkCategories(
  frameworkId: string,
): Promise<Category[]> {
  try {
    const frameworkContent = await loadFrameworkContent(frameworkId);
    if (!frameworkContent) return [];

    const categories: Category[] = [];

    for (const categoryFile of frameworkContent.categoryFiles) {
      const category = await loadCategoryContent(frameworkId, categoryFile.id);
      if (category) {
        categories.push(category);
      }
    }

    return categories;
  } catch (error) {
    console.warn(`Could not load categories for ${frameworkId}:`, error);
    return [];
  }
}

/**
 * Load snippet source code
 */
export async function loadSnippetSource(
  frameworkId: string,
  snippetId: string,
): Promise<string | null> {
  try {
    const sourcesPath = join(DOCS_DIR, "sources", frameworkId, "sources.json");
    const content = await readFile(sourcesPath, "utf-8");
    const sources = JSON.parse(content);

    return sources[snippetId] || null;
  } catch (error) {
    console.warn(`Could not load source for ${snippetId}:`, error);
    return null;
  }
}

/**
 * Load modules content
 */
export async function loadModules(): Promise<Module[]> {
  try {
    const modulesPath = join(DOCS_DIR, "modules", "index.json");
    const content = await readFile(modulesPath, "utf-8");
    const data = JSON.parse(content);

    return data.modules || [];
  } catch (error) {
    console.warn("Could not load modules:", error);
    return [];
  }
}

/**
 * Load shared content
 */
export async function loadSharedContent(
  categoryId: string,
): Promise<Category | null> {
  try {
    const categoryPath = join(DOCS_DIR, "shared", `${categoryId}.json`);
    const content = await readFile(categoryPath, "utf-8");
    const data = JSON.parse(content);

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      snippets:
        data.subcategories?.flatMap(
          (sub: { snippets: Snippet[] }) => sub.snippets,
        ) || [],
    };
  } catch (error) {
    console.warn(`Could not load shared category ${categoryId}:`, error);
    return null;
  }
}

/**
 * Get all snippet IDs across all frameworks
 */
export async function getAllSnippetIds(): Promise<
  Array<{ framework: string; category: string; snippetId: string }>
> {
  const frameworks = await loadAllFrameworks();
  const allSnippets: Array<{
    framework: string;
    category: string;
    snippetId: string;
  }> = [];

  for (const framework of frameworks) {
    const categories = await loadFrameworkCategories(framework.id);

    for (const category of categories) {
      for (const snippet of category.snippets) {
        allSnippets.push({
          framework: framework.id,
          category: category.id,
          snippetId: snippet.id,
        });
      }
    }
  }

  return allSnippets;
}

/**
 * Extract use cases from snippets
 */
export async function extractUseCases(): Promise<
  Map<string, Array<{ framework: string; snippet: Snippet }>>
> {
  const useCases = new Map<
    string,
    Array<{ framework: string; snippet: Snippet }>
  >();
  const frameworks = await loadAllFrameworks();

  for (const framework of frameworks) {
    const categories = await loadFrameworkCategories(framework.id);

    for (const category of categories) {
      for (const snippet of category.snippets) {
        // Extract use cases from purpose and features
        const keywords = [
          ...snippet.purpose.toLowerCase().split(/\s+/),
          ...snippet.features.flatMap((f) => f.toLowerCase().split(/\s+/)),
        ].filter((k) => k.length > 3);

        for (const keyword of keywords) {
          if (!useCases.has(keyword)) {
            useCases.set(keyword, []);
          }
          useCases.get(keyword)!.push({ framework: framework.id, snippet });
        }
      }
    }
  }

  return useCases;
}
