/**
 * Unified docs loader with lazy loading via dynamic imports.
 *
 * This module provides async functions to load documentation data on demand,
 * reducing initial bundle size by only loading framework docs when needed.
 */

import type { FrameworkType } from "@/types/docs";
import {
  loadTemplatesIndex,
  loadTemplateCategory,
} from "./loaders/templatesLoader";
import {
  loadToolingIndex,
  loadToolingCategory,
  loadToolingSources,
} from "./loaders/toolingLoader";
import { loadModulesIndex } from "./loaders/modulesLoader";
import {
  loadExpressIndex,
  loadHonoIndex,
  loadElysiaIndex,
  loadFastifyIndex,
  loadNestIndex,
  loadSharedIndex,
  loadExpressCategory,
  loadHonoCategory,
  loadElysiaCategory,
  loadFastifyCategory,
  loadNestCategory,
  loadSharedCategory,
  loadExpressSources,
  loadHonoSources,
  loadElysiaSources,
  loadFastifySources,
  loadNestSources,
  loadSharedSources,
} from "./loaders";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Cache for loaded data to avoid repeated fetches
const cache: Record<string, any> = {};

function getCacheKey(type: string, ...args: string[]): string {
  return [type, ...args].join(":");
}

async function withCache<T>(key: string, loader: () => Promise<T>): Promise<T> {
  if (cache[key]) {
    return cache[key] as T;
  }
  const data = await loader();
  cache[key] = data;
  return data;
}

// ============================================================================
// Snippet Loaders
// ============================================================================

const indexLoaders: Record<string, () => Promise<any>> = {
  express: loadExpressIndex,
  hono: loadHonoIndex,
  elysia: loadElysiaIndex,
  fastify: loadFastifyIndex,
  nest: loadNestIndex,
  shared: loadSharedIndex,
};

const categoryLoaders: Record<string, (fileName: string) => Promise<any>> = {
  express: loadExpressCategory,
  hono: loadHonoCategory,
  elysia: loadElysiaCategory,
  fastify: loadFastifyCategory,
  nest: loadNestCategory,
  shared: loadSharedCategory,
};

const sourceLoaders: Record<string, () => Promise<Record<string, string>>> = {
  express: loadExpressSources,
  hono: loadHonoSources,
  elysia: loadElysiaSources,
  fastify: loadFastifySources,
  nest: loadNestSources,
  shared: loadSharedSources,
};

/**
 * Load snippet index for a framework
 */
export async function loadSnippetIndex(
  framework: FrameworkType | "shared",
): Promise<any> {
  const key = getCacheKey("snippetIndex", framework);
  const loader = indexLoaders[framework];
  if (!loader) return null;
  return withCache(key, loader);
}

/**
 * Load a specific snippet category
 */
export async function loadSnippetCategory(
  framework: FrameworkType | "shared",
  fileName: string,
): Promise<any> {
  const key = getCacheKey("snippetCategory", framework, fileName);
  const loader = categoryLoaders[framework];
  if (!loader) return null;
  return withCache(key, () => loader(fileName));
}

/**
 * Get snippet source code
 */
export async function getSnippetSource(
  framework: FrameworkType | "shared",
  snippetId: string,
): Promise<string | null> {
  const key = getCacheKey("snippetSources", framework);
  const loader = sourceLoaders[framework];
  if (!loader) return null;

  const sources = await withCache(key, loader);
  return sources[snippetId] || null;
}

// ============================================================================
// Add-ons (Shared Snippets) Loaders
// ============================================================================

/**
 * Load add-ons index
 */
export async function loadAddonsIndex(): Promise<any> {
  return loadSnippetIndex("shared");
}

/**
 * Load add-on category
 */
export async function loadAddonCategory(fileName: string): Promise<any> {
  return loadSnippetCategory("shared", fileName);
}

/**
 * Get add-on source code
 */
export async function getAddonSource(addonId: string): Promise<string | null> {
  return getSnippetSource("shared", addonId);
}

// ============================================================================
// Templates Loaders
// ============================================================================

/**
 * Load templates index for a framework
 */
export async function loadTemplatesIndexData(
  framework: FrameworkType = "express",
): Promise<any> {
  const key = getCacheKey("templatesIndex", framework);
  return withCache(key, () => loadTemplatesIndex(framework));
}

/**
 * Load template category
 */
export async function loadTemplateCategoryData(
  fileName: string,
  framework: FrameworkType = "express",
): Promise<any> {
  const key = getCacheKey("templateCategory", framework, fileName);
  return withCache(key, () => loadTemplateCategory(fileName, framework));
}

// ============================================================================
// Modules Loader
// ============================================================================

/**
 * Load modules data
 */
export async function loadModulesData(): Promise<any> {
  const key = getCacheKey("modules");
  return withCache(key, loadModulesIndex);
}

// ============================================================================
// Tooling Loaders
// ============================================================================

/**
 * Load tooling index
 */
export async function loadToolingIndexData(): Promise<any> {
  const key = getCacheKey("toolingIndex");
  return withCache(key, loadToolingIndex);
}

/**
 * Load tooling category
 */
export async function loadToolingCategoryData(fileName: string): Promise<any> {
  const key = getCacheKey("toolingCategory", fileName);
  return withCache(key, () => loadToolingCategory(fileName));
}

/**
 * Get tooling source code
 */
export async function getToolingSource(
  toolingId: string,
): Promise<string | null> {
  const key = getCacheKey("toolingSources");
  const sources = await withCache(key, loadToolingSources);
  return sources[toolingId] || null;
}

// ============================================================================
// Cache Management
// ============================================================================

/**
 * Clear all cached data
 */
export function clearDocsCache(): void {
  Object.keys(cache).forEach((key) => delete cache[key]);
}

/**
 * Clear cache for a specific framework
 */
// ============================================================================
// Search Loader
// ============================================================================

import type { SearchItem } from "@/types/docs";
import { type SnippetDoc, type SnippetCategory } from "@/types/docs";

/**
 * Load ALL searchable data from all frameworks and sections.
 * This is a heavy operation, so it should be called lazily.
 */
export async function loadAllSearchableData(): Promise<SearchItem[]> {
  const searchItems: SearchItem[] = [];
  const frameworks: FrameworkType[] = [
    "express",
    "hono",
    "elysia",
    "fastify",
    "nest",
  ];

  // 1. Load Snippets for all frameworks
  const snippetPromises = frameworks.map(async (fw) => {
    try {
      const index = await loadSnippetIndex(fw);
      if (!index) return;

      // Add concept if available
      if (index.concept) {
        searchItems.push({
          id: `concept-${fw}`,
          type: "concept",
          title: `${index.title} - Concept`,
          description: index.description,
          framework: fw,
          path: `/docs/snippets/${fw}`,
        });
      }

      // Load all categories
      const catPromises = index.categoryFiles.map(
        (cf: { id: string; file: string }) => loadSnippetCategory(fw, cf.file),
      );
      const categories = await Promise.all(catPromises);

      categories.forEach((cat: SnippetCategory | null) => {
        if (!cat) return;
        cat.subcategories.forEach((sub) => {
          sub.snippets.forEach((snippet) => {
            searchItems.push({
              id: snippet.id,
              type: "snippet",
              title: snippet.name,
              description: snippet.description,
              framework: fw,
              category: cat.title,
              path: `/docs/snippets/${fw}/${cat.id}?item=${snippet.id}`,
            });
          });
        });
      });
    } catch (e) {
      console.warn(`Failed to load snippets for ${fw}`, e);
    }
  });

  // 2. Load Templates
  const templatePromises = frameworks.map(async (fw) => {
    try {
      const index = await loadTemplatesIndexData(fw);
      if (!index) return;

      const catPromises = index.categoryFiles.map(
        (cf: { id: string; file: string }) =>
          loadTemplateCategoryData(cf.file, fw),
      );
      const categories = await Promise.all(catPromises);

      categories.forEach((cat: any) => {
        // Type as any or TemplateCategory
        if (!cat) return;
        if (cat.templates) {
          cat.templates.forEach((tmpl: any) => {
            searchItems.push({
              id: tmpl.id,
              type: "template",
              title: tmpl.name,
              description: tmpl.description || "",
              framework: fw,
              category: cat.title,
              path: `/docs/templates/${fw}/${cat.id}?item=${tmpl.id}`,
            });
          });
        }
        if (cat.subcategories) {
          cat.subcategories.forEach((sub: any) => {
            sub.templates.forEach((tmpl: any) => {
              searchItems.push({
                id: tmpl.id,
                type: "template",
                title: tmpl.name,
                description: tmpl.description || "",
                framework: fw,
                category: cat.title,
                path: `/docs/templates/${fw}/${cat.id}?item=${tmpl.id}`,
              });
            });
          });
        }
      });
    } catch (e) {
      console.warn(`Failed to load templates for ${fw}`, e);
    }
  });

  // 3. Load Modules
  const modulePromise = (async () => {
    try {
      const modulesData = await loadModulesData();
      if (modulesData && modulesData.modules) {
        modulesData.modules.forEach((mod: any) => {
          searchItems.push({
            id: mod.id,
            type: "module",
            title: mod.name,
            description: mod.description,
            path: `/docs/modules?item=${mod.id}`,
          });
        });
      }
    } catch (e) {
      console.warn("Failed to load modules", e);
    }
  })();

  // 4. Load Addons
  const addonPromise = (async () => {
    try {
      const index = await loadAddonsIndex();
      if (index) {
        const catPromises = index.categoryFiles.map(
          (cf: { id: string; file: string }) => loadAddonCategory(cf.file),
        );
        const categories = await Promise.all(catPromises);
        categories.forEach((cat: any) => {
          if (!cat) return;
          cat.subcategories.forEach((sub: any) => {
            sub.snippets.forEach((snip: any) => {
              searchItems.push({
                id: snip.id,
                type: "addon",
                title: snip.name,
                description: snip.description,
                category: cat.title,
                path: `/docs/addons/shared/${cat.id}?item=${snip.id}`,
              });
            });
          });
        });
      }
    } catch (e) {
      console.warn("Failed to load addons", e);
    }
  })();

  // 5. Load Tooling
  const toolingPromise = (async () => {
    try {
      const index = await loadToolingIndexData();
      if (index) {
        const catPromises = index.categoryFiles.map(
          (cf: { id: string; file: string }) =>
            loadToolingCategoryData(cf.file),
        );
        const categories = await Promise.all(catPromises);
        categories.forEach((cat: any) => {
          if (!cat) return;
          cat.items.forEach((item: any) => {
            searchItems.push({
              id: item.id,
              type: "tooling",
              title: item.name,
              description: item.description,
              category: cat.title,
              path: `/docs/tooling?category=${cat.id}&item=${item.id}`,
            });
          });
        });
      }
    } catch (e) {
      console.warn("Failed to load tooling", e);
    }
  })();

  await Promise.all([
    ...snippetPromises,
    ...templatePromises,
    modulePromise,
    addonPromise,
    toolingPromise,
  ]);

  return searchItems;
}

export function clearFrameworkCache(framework: FrameworkType | "shared"): void {
  Object.keys(cache)
    .filter((key) => key.includes(framework))
    .forEach((key) => delete cache[key]);
}
