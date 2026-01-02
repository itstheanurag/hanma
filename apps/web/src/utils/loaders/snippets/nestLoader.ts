/**
 * NestJS framework snippets loader with dynamic imports
 */
import type { FrameworkType } from "@/types/docs";

export const loadNestIndex = async () => {
  const module = await import("@/docs/snippets/nest/index.json");
  return module.default;
};

export const loadNestCategory = async (fileName: string) => {
  const categoryMap: Record<string, () => Promise<any>> = {
    "libs.json": () => import("@/docs/snippets/nest/libs.json"),
    "decorators.json": () => import("@/docs/snippets/nest/decorators.json"),
    "guards.json": () => import("@/docs/snippets/nest/guards.json"),
    "interceptors.json": () => import("@/docs/snippets/nest/interceptors.json"),
    "pipes.json": () => import("@/docs/snippets/nest/pipes.json"),
    "filters.json": () => import("@/docs/snippets/nest/filters.json"),
    "middleware.json": () => import("@/docs/snippets/nest/middleware.json"),
    "providers.json": () => import("@/docs/snippets/nest/providers.json"),
    "utils.json": () => import("@/docs/snippets/nest/utils.json"),
  };

  const loader = categoryMap[fileName];
  if (!loader) return null;

  const module = await loader();
  return module.default;
};

export const loadNestSources = async () => {
  const module = await import("@/docs/sources/nest/sources.json");
  return module.default as Record<string, string>;
};

export const nestFramework: FrameworkType = "nest";
