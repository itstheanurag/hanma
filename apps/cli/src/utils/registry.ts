import { registrySchema } from "../schemas/registry";
import { REGISTRY_URL, TEMPLATES_URL } from "../constants";
import { Registry, TemplateRegistry } from "../types";

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

export async function fetchFrameworks(): Promise<string[]> {
  const res = await fetch(`${REGISTRY_URL}/index.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch frameworks index: ${res.statusText}`);
  }
  return (await res.json()) as string[];
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
    const filterByFramework = <T extends { framework?: string }>(
      items: T[] | undefined,
    ): T[] => {
      if (!items) return [];
      return items.filter(
        (item) => !item.framework || item.framework === framework,
      );
    };

    return {
      base: filterByFramework(fullRegistry.base),
      database: filterByFramework(fullRegistry.database),
      auth: filterByFramework(fullRegistry.auth),
      features: filterByFramework(fullRegistry.features),
      presets: filterByFramework(fullRegistry.presets),
      extra: filterByFramework(fullRegistry.extra),
    };
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
