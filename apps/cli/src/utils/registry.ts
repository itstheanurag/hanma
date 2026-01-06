import { registrySchema } from "@repo/schemas";

import { REGISTRY_URL, TEMPLATES_URL, MODULES_URL } from "../constants";
import { Registry, TemplateRegistry, ModulesRegistry } from "../types";

/**
 * Generic fetcher for registry data
 */
async function fetchRegistryData<T>(
  url: string,
  schema: {
    safeParse: (data: unknown) => { success: boolean; data?: T; error?: any };
  },
  errorMessage: string,
): Promise<T> {
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

  return result.data as T;
}

/**
 * Get frameworks that actually have templates available.
 * This derives frameworks from the templates registry instead of a static index.
 */
export async function fetchAvailableFrameworks(): Promise<string[]> {
  const res = await fetch(`${TEMPLATES_URL}/index.json`);
  if (!res.ok) return [];

  const registry = (await res.json()) as TemplateRegistry;
  const frameworks = new Set<string>();

  // Extract unique frameworks from base templates
  registry.base?.forEach((t) => {
    if (t.framework) frameworks.add(t.framework);
  });

  return Array.from(frameworks);
}

export async function fetchRegistry(framework: string): Promise<Registry> {
  return fetchRegistryData(
    `${REGISTRY_URL}/${framework}.json`,
    registrySchema,
    `Failed to fetch registry for ${framework}`,
  );
}

export async function fetchTemplatesRegistry(
  framework: string,
): Promise<TemplateRegistry | null> {
  try {
    const res = await fetch(`${TEMPLATES_URL}/index.json`);
    if (!res.ok) {
      return null;
    }
    const fullRegistry = (await res.json()) as TemplateRegistry;

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
  } catch {
    return null;
  }
}

/**
 * Fetch modules registry (auth, database, etc.)
 */
export async function fetchModulesRegistry(): Promise<ModulesRegistry | null> {
  try {
    const res = await fetch(`${MODULES_URL}/index.json`);
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as ModulesRegistry;
  } catch {
    return null;
  }
}

/**
 * Fetch tooling registry (dev configs like biome, eslint, prettier)
 */
export async function fetchToolingRegistry(): Promise<Registry> {
  return fetchRegistryData(
    `${REGISTRY_URL}/tooling.json`,
    registrySchema,
    "Failed to fetch tooling registry",
  );
}

/**
 * Fetch addons registry (shared cross-framework snippets)
 */
export async function fetchAddonsRegistry(): Promise<Registry> {
  return fetchRegistryData(
    `${REGISTRY_URL}/shared.json`,
    registrySchema,
    "Failed to fetch addons registry",
  );
}
