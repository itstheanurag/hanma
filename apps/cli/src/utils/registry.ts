import { Registry, registrySchema } from "../schema";
import { REGISTRY_URL, TEMPLATES_URL } from "../constants";
import { TemplateRegistry } from "../types";

export async function fetchFrameworks(): Promise<string[]> {
  const res = await fetch(`${REGISTRY_URL}/index.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch frameworks index: ${res.statusText}`);
  }
  return (await res.json()) as string[];
}

export async function fetchRegistry(framework: string): Promise<Registry> {
  const res = await fetch(`${REGISTRY_URL}/${framework}.json`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch registry for ${framework}: ${res.statusText}`,
    );
  }
  const json = await res.json();
  const result = registrySchema.safeParse(json);

  if (!result.success) {
    throw new Error(
      `Invalid registry format for ${framework}: ${result.error.message}`,
    );
  }

  return result.data;
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
    };
  } catch {
    return null;
  }
}
