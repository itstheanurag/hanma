/**
 * Templates loader with dynamic imports
 */
import type { FrameworkType } from "@/types/docs";

export const loadTemplatesIndex = async (
  framework: FrameworkType = "express",
) => {
  const loaders: Record<string, () => Promise<any>> = {
    express: () => import("@/docs/templates/express/index.json"),
    hono: () => import("@/docs/templates/hono/index.json"),
    elysia: () => import("@/docs/templates/elysia/index.json"),
  };

  const loader = loaders[framework];
  if (!loader) return null;

  const module = await loader();
  return module.default;
};

export const loadTemplateCategory = async (
  fileName: string,
  framework: FrameworkType = "express",
) => {
  const frameworkCategories: Record<
    string,
    Record<string, () => Promise<any>>
  > = {
    express: {
      "base.json": () => import("@/docs/templates/express/base.json"),
    },
    hono: {
      "base.json": () => import("@/docs/templates/hono/base.json"),
    },
    elysia: {
      "base.json": () => import("@/docs/templates/elysia/base.json"),
    },
  };

  const categories = frameworkCategories[framework];
  if (!categories) return null;

  const loader = categories[fileName];
  if (!loader) return null;

  const module = await loader();
  return module.default;
};
