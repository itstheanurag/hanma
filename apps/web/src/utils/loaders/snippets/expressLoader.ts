/**
 * Express framework snippets loader with dynamic imports
 */
import type { FrameworkType } from "@/types/docs";

export const loadExpressIndex = async () => {
  const module = await import("@/docs/snippets/express/index.json");
  return module.default;
};

export const loadExpressCategory = async (fileName: string) => {
  const categoryMap: Record<string, () => Promise<any>> = {
    "docs.json": () => import("@/docs/snippets/express/docs.json"),
    "libs.json": () => import("@/docs/snippets/express/libs.json"),
    "middleware.json": () => import("@/docs/snippets/express/middleware.json"),
    "routes.json": () => import("@/docs/snippets/express/routes.json"),
    "utils.json": () => import("@/docs/snippets/express/utils.json"),
  };

  const loader = categoryMap[fileName];
  if (!loader) return null;

  const module = await loader();
  return module.default;
};

export const loadExpressSources = async () => {
  const module = await import("@/docs/sources/express/sources.json");
  return module.default as Record<string, string>;
};

export const expressFramework: FrameworkType = "express";
