/**
 * Tooling loader with dynamic imports
 */

export const loadToolingIndex = async () => {
  const module = await import("@/docs/tooling/index.json");
  return module.default;
};

export const loadToolingCategory = async (fileName: string) => {
  const categoryMap: Record<string, () => Promise<any>> = {
    "formatters.json": () => import("@/docs/tooling/formatters.json"),
    "typescript.json": () => import("@/docs/tooling/typescript.json"),
  };

  const loader = categoryMap[fileName];
  if (!loader) return null;

  const module = await loader();
  return module.default;
};

export const loadToolingSources = async () => {
  const module = await import("@/docs/sources/tooling/sources.json");
  return module.default as Record<string, string>;
};
