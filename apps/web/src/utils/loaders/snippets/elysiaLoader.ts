/**
 * Elysia framework snippets loader with dynamic imports
 */
import type { FrameworkType } from "@/types/docs";

export const loadElysiaIndex = async () => {
  const module = await import("@/docs/snippets/elysia/index.json");
  return module.default;
};

export const loadElysiaCategory = async (fileName: string) => {
  const categoryMap: Record<string, () => Promise<any>> = {
    "libs.json": () => import("@/docs/snippets/elysia/libs.json"),
    "plugins.json": () => import("@/docs/snippets/elysia/plugins.json"),
    "middleware.json": () => import("@/docs/snippets/elysia/middleware.json"),
    "guards.json": () => import("@/docs/snippets/elysia/guards.json"),
    "utils.json": () => import("@/docs/snippets/elysia/utils.json"),
    "validation.json": () => import("@/docs/snippets/elysia/validation.json"),
    "routes.json": () => import("@/docs/snippets/elysia/routes.json"),
  };

  const loader = categoryMap[fileName];
  if (!loader) return null;

  const module = await loader();
  return module.default;
};

export const loadElysiaSources = async () => {
  const module = await import("@/docs/sources/elysia/sources.json");
  return module.default as Record<string, string>;
};

export const elysiaFramework: FrameworkType = "elysia";
