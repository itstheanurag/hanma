import { registrySchema } from "../types";
import {
  REGISTRY_URL,
  TEMPLATES_URL,
  MODULES_URL,
  CACHE_TTL,
  BYPASS_CACHE,
} from "../constants";
import { Registry, TemplateRegistry, ModulesRegistry } from "../types";
import { isCacheValid, readCache, writeCache } from "./cache";

/**
 * Generic fetcher for registry data with caching support
 */
async function fetchRegistryData<T>(
  url: string,
  cacheKey: string,
  schema: {
    safeParse: (data: unknown) => { success: boolean; data?: T; error?: any };
  },
  errorMessage: string,
  forceRefresh = false,
): Promise<T> {
  // Try cache first (unless bypassed or force refresh)
  if (!BYPASS_CACHE && !forceRefresh) {
    if (await isCacheValid(cacheKey, CACHE_TTL)) {
      const cached = await readCache<T>(cacheKey);
      if (cached) return cached;
    }
  }

  // Fetch from network
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`${errorMessage}: ${res.statusText}`);
    }
    const json = await res.json();
    const result = schema.safeParse(json);

    if (!result.success) {
      throw new Error(
        `${errorMessage} (Invalid format): ${result.error.message}`,
      );
    }

    // Write to cache
    await writeCache(cacheKey, result.data);

    return result.data as T;
  } catch (error) {
    // Fallback to stale cache if network fails
    const cached = await readCache<T>(cacheKey);
    if (cached) return cached;
    throw error;
  }
}

/**
 * Generic JSON fetcher with caching (no schema validation)
 */
async function fetchJsonWithCache<T>(
  url: string,
  cacheKey: string,
  forceRefresh = false,
): Promise<T | null> {
  // Try cache first (unless bypassed or force refresh)
  if (!BYPASS_CACHE && !forceRefresh) {
    if (await isCacheValid(cacheKey, CACHE_TTL)) {
      const cached = await readCache<T>(cacheKey);
      if (cached) return cached;
    }
  }

  // Fetch from network
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    await writeCache(cacheKey, data);
    return data as T;
  } catch {
    // Fallback to stale cache
    return readCache<T>(cacheKey);
  }
}

/**
 * Get frameworks that actually have templates available.
 * This derives frameworks from the templates registry instead of a static index.
 */
export async function fetchAvailableFrameworks(
  forceRefresh = false,
): Promise<string[]> {
  const registry = await fetchJsonWithCache<TemplateRegistry>(
    `${TEMPLATES_URL}/index.json`,
    "templates-index",
    forceRefresh,
  );

  if (!registry) return [];

  const frameworks = new Set<string>();

  // Extract unique frameworks from base templates
  registry.base?.forEach((t) => {
    if (t.framework) frameworks.add(t.framework);
  });

  return Array.from(frameworks);
}

export async function fetchRegistry(
  framework: string,
  forceRefresh = false,
): Promise<Registry> {
  return fetchRegistryData(
    `${REGISTRY_URL}/${framework}.json`,
    `registry-${framework}`,
    registrySchema,
    `Failed to fetch registry for ${framework}`,
    forceRefresh,
  );
}

export async function fetchTemplatesRegistry(
  framework: string,
  forceRefresh = false,
): Promise<TemplateRegistry | null> {
  const fullRegistry = await fetchJsonWithCache<TemplateRegistry>(
    `${TEMPLATES_URL}/index.json`,
    "templates-index",
    forceRefresh,
  );

  if (!fullRegistry) return null;

  // Filter templates by framework - keep templates that either:
  // 1. Have no framework specified (shared templates)
  // 2. Match the selected framework
  // 3. If no framework filter is provided, keep all items
  const filterByFramework = <T extends { framework?: string }>(
    items: T[] | undefined,
  ): T[] => {
    if (!items) return [];
    // If no framework specified, return all items
    if (!framework) return items;
    return items.filter(
      (item) => !item.framework || item.framework === framework,
    );
  };

  return {
    base: filterByFramework(fullRegistry.base),
    features: filterByFramework(fullRegistry.features),
    presets: filterByFramework(fullRegistry.presets),
    extra: filterByFramework(fullRegistry.extra),
  };
}

/**
 * Fetch modules registry (auth, database, etc.)
 */
export async function fetchModulesRegistry(
  forceRefresh = false,
): Promise<ModulesRegistry | null> {
  return fetchJsonWithCache<ModulesRegistry>(
    `${MODULES_URL}/index.json`,
    "modules-index",
    forceRefresh,
  );
}

/**
 * Fetch tooling registry (dev configs like biome, eslint, prettier)
 */
export async function fetchToolingRegistry(
  forceRefresh = false,
): Promise<Registry> {
  return fetchRegistryData(
    `${REGISTRY_URL}/tooling.json`,
    "tooling",
    registrySchema,
    "Failed to fetch tooling registry",
    forceRefresh,
  );
}

/**
 * Fetch addons registry (shared cross-framework snippets)
 */
export async function fetchAddonsRegistry(
  forceRefresh = false,
): Promise<Registry> {
  return fetchRegistryData(
    `${REGISTRY_URL}/shared.json`,
    "shared",
    registrySchema,
    "Failed to fetch addons registry",
    forceRefresh,
  );
}

type RefreshResult = {
  success: string[];
  failed: string[];
};

/**
 * Refresh all registries (force update cache) - fully parallel
 */
export async function refreshAllRegistries(): Promise<RefreshResult> {
  // First get the frameworks list (uses cache so fast)
  const frameworks = await fetchAvailableFrameworks(false);

  // Build the list of all tasks with their names
  const taskDefinitions = [
    { name: "templates", fn: () => fetchTemplatesRegistry("", true) },
    { name: "modules", fn: () => fetchModulesRegistry(true) },
    { name: "addons", fn: () => fetchAddonsRegistry(true) },
    ...frameworks.map((f) => ({
      name: `registry-${f}`,
      fn: () => fetchRegistry(f, true),
    })),
  ];

  // Execute all in parallel - Promise.allSettled catches all rejections
  const results = await Promise.allSettled(
    taskDefinitions.map((task) => task.fn()),
  );

  // Build the results
  return results.reduce<RefreshResult>(
    (acc, result, index) => {
      const name = taskDefinitions[index]?.name ?? "unknown";
      if (result.status === "fulfilled") {
        acc.success.push(name);
      } else {
        acc.failed.push(name);
      }
      return acc;
    },
    { success: [], failed: [] },
  );
}
