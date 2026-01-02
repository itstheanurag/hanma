/**
 * Fastify framework snippets loader with dynamic imports
 */
import type { FrameworkType } from "@/types/docs";

export const loadFastifyIndex = async () => {
  const module = await import("@/docs/snippets/fastify/index.json");
  return module.default;
};

export const loadFastifyCategory = async (fileName: string) => {
  const categoryMap: Record<string, () => Promise<any>> = {
    "docs.json": () => import("@/docs/snippets/fastify/docs.json"),
    "libs.json": () => import("@/docs/snippets/fastify/libs.json"),
    "middleware.json": () => import("@/docs/snippets/fastify/middleware.json"),
    "utils.json": () => import("@/docs/snippets/fastify/utils.json"),
  };

  const loader = categoryMap[fileName];
  if (!loader) return null;

  const module = await loader();
  return module.default;
};

export const loadFastifySources = async () => {
  const module = await import("@/docs/sources/fastify/sources.json");
  return module.default as Record<string, string>;
};

export const fastifyFramework: FrameworkType = "fastify";
