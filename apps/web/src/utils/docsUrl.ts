import type { TabType, FrameworkType } from "@/types/docs";

/**
 * Parse URL path to extract tab, framework, and category
 * Pattern: /docs/:tab?/:framework?/:category?
 */
export const parseDocsPath = (
  pathname: string,
): {
  tab: TabType;
  framework: FrameworkType;
  category: string;
} => {
  const parts = pathname.replace("/docs", "").split("/").filter(Boolean);

  // Default values
  let tab: TabType = "snippets";
  let framework: FrameworkType = "express";
  let category = "";

  if (parts.length >= 1) {
    const firstPart = parts[0];
    if (
      firstPart === "templates" ||
      firstPart === "modules" ||
      firstPart === "snippets" ||
      firstPart === "addons"
    ) {
      tab = firstPart as TabType;
    } else {
      // First part is framework (legacy URL support)
      framework = firstPart as FrameworkType;
    }
  }

  if (parts.length >= 2) {
    const secondPart = parts[1];
    if (
      ["express", "hono", "elysia", "fastify", "shared"].includes(secondPart)
    ) {
      framework = secondPart as FrameworkType;
    } else {
      category = secondPart;
    }
  }

  if (parts.length >= 3) {
    category = parts[2];
  }

  return { tab, framework, category };
};

/**
 * Build URL path from state
 */
export const buildDocsPath = (
  tab: TabType,
  framework: FrameworkType,
  category: string,
): string => {
  if (tab === "modules") {
    return "/docs/modules";
  }
  if (tab === "addons") {
    return "/docs/addons";
  }

  let path = `/docs/${tab}/${framework}`;
  if (category) {
    path += `/${category}`;
  }
  return path;
};
