/**
 * Shared snippets (addons) loader with dynamic imports
 */

export const loadSharedIndex = async () => {
  const module = await import("@/docs/shared/index.json");
  return module.default;
};

export const loadSharedCategory = async (fileName: string) => {
  const categoryMap: Record<string, () => Promise<any>> = {
    "db.json": () => import("@/docs/shared/db.json"),
    "libs.json": () => import("@/docs/shared/libs.json"),
    "mailers.json": () => import("@/docs/shared/mailers.json"),
    "passwords.json": () => import("@/docs/shared/passwords.json"),
    "queries.json": () => import("@/docs/shared/queries.json"),
    "uploads.json": () => import("@/docs/shared/uploads.json"),
    "utils.json": () => import("@/docs/shared/utils.json"),
  };

  const loader = categoryMap[fileName];
  if (!loader) return null;

  const module = await loader();
  return module.default;
};

export const loadSharedSources = async () => {
  const module = await import("@/docs/sources/shared/sources.json");
  return module.default as Record<string, string>;
};
