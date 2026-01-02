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
export function clearFrameworkCache(framework: FrameworkType | "shared"): void {
  Object.keys(cache)
    .filter((key) => key.includes(framework))
    .forEach((key) => delete cache[key]);
}
