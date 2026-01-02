/**
 * Hono framework snippets loader with dynamic imports
 */
import type { FrameworkType } from "@/types/docs";

export const loadHonoIndex = async () => {
  const module = await import("@/docs/snippets/hono/index.json");
  return module.default;
};

export const loadHonoCategory = async (fileName: string) => {
  const categoryMap: Record<string, () => Promise<any>> = {
    "libs.json": () => import("@/docs/snippets/hono/libs.json"),
    "middleware.json": () => import("@/docs/snippets/hono/middleware.json"),
  };

  const loader = categoryMap[fileName];
  if (!loader) return null;

  const module = await loader();
  return module.default;
};

export const loadHonoSources = async () => {
  const module = await import("@/docs/sources/hono/sources.json");
  return module.default as Record<string, string>;
};

export const honoFramework: FrameworkType = "hono";
