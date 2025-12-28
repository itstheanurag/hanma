/**
 * Static imports for all docs JSON files.
 * This replaces the runtime fetch() calls since docs are now in src/docs.
 */

// Snippets - Express
import expressIndex from "@/docs/snippets/express/index.json";
import expressDocs from "@/docs/snippets/express/docs.json";
import expressLibs from "@/docs/snippets/express/libs.json";
import expressMiddleware from "@/docs/snippets/express/middleware.json";
import expressRoutes from "@/docs/snippets/express/routes.json";
import expressUtils from "@/docs/snippets/express/utils.json";

// Snippets - Hono
import honoIndex from "@/docs/snippets/hono/index.json";
import honoLibs from "@/docs/snippets/hono/libs.json";
import honoMiddleware from "@/docs/snippets/hono/middleware.json";

// Snippets - Elysia
import elysiaIndex from "@/docs/snippets/elysia/index.json";
import elysiaLibs from "@/docs/snippets/elysia/libs.json";
import elysiaPlugins from "@/docs/snippets/elysia/plugins.json";

// Snippets - Shared
import sharedIndex from "@/docs/snippets/shared/index.json";
import sharedDb from "@/docs/snippets/shared/db.json";
import sharedLibs from "@/docs/snippets/shared/libs.json";
import sharedMailers from "@/docs/snippets/shared/mailers.json";
import sharedPasswords from "@/docs/snippets/shared/passwords.json";
import sharedQueries from "@/docs/snippets/shared/queries.json";
import sharedUploads from "@/docs/snippets/shared/uploads.json";
import sharedUtils from "@/docs/snippets/shared/utils.json";

// Templates - Express
import templatesExpressIndex from "@/docs/templates/express/index.json";
import templatesExpressBase from "@/docs/templates/express/base.json";

// Templates - Hono
import templatesHonoIndex from "@/docs/templates/hono/index.json";
import templatesHonoBase from "@/docs/templates/hono/base.json";

// Templates - Elysia
import templatesElysiaIndex from "@/docs/templates/elysia/index.json";
import templatesElysiaBase from "@/docs/templates/elysia/base.json";

// Add-ons (shared across all frameworks)
import addonsIndex from "@/docs/templates/shared/index.json";
import addonsDatabase from "@/docs/templates/shared/database.json";
import addonsAuth from "@/docs/templates/shared/auth.json";
import addonsFeatures from "@/docs/templates/shared/features.json";
import addonsPresets from "@/docs/templates/shared/presets.json";

// Modules
import modulesIndex from "@/docs/modules/index.json";

// Snippets Sources
import expressSourcesJson from "@/docs/sources/express/sources.json";
import honoSourcesJson from "@/docs/sources/hono/sources.json";
import elysiaSourcesJson from "@/docs/sources/elysia/sources.json";
import sharedSourcesJson from "@/docs/sources/shared/sources.json";

import type { FrameworkType } from "@/types/docs";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Snippet index loaders
export const snippetIndexes: Record<FrameworkType, any> = {
  express: expressIndex,
  hono: honoIndex,
  elysia: elysiaIndex,
  shared: sharedIndex,
};

// Snippet category loaders by framework
const expressCategories: Record<string, any> = {
  "docs.json": expressDocs,
  "libs.json": expressLibs,
  "middleware.json": expressMiddleware,
  "routes.json": expressRoutes,
  "utils.json": expressUtils,
};

const honoCategories: Record<string, any> = {
  "libs.json": honoLibs,
  "middleware.json": honoMiddleware,
};

const elysiaCategories: Record<string, any> = {
  "libs.json": elysiaLibs,
  "plugins.json": elysiaPlugins,
};

const sharedCategories: Record<string, any> = {
  "db.json": sharedDb,
  "libs.json": sharedLibs,
  "mailers.json": sharedMailers,
  "passwords.json": sharedPasswords,
  "queries.json": sharedQueries,
  "uploads.json": sharedUploads,
  "utils.json": sharedUtils,
};

const allCategories: Record<FrameworkType, Record<string, any>> = {
  express: expressCategories,
  hono: honoCategories,
  elysia: elysiaCategories,
  shared: sharedCategories,
};

// Dynamic category file loaders
export function loadSnippetCategory(
  framework: FrameworkType,
  fileName: string,
): any | null {
  const categories = allCategories[framework];
  return categories?.[fileName] || null;
}

// Template index loaders by framework
export const templatesIndexes: Record<string, any> = {
  express: templatesExpressIndex,
  hono: templatesHonoIndex,
  elysia: templatesElysiaIndex,
};

// For backwards compatibility
export const templatesIndex: any = templatesExpressIndex;

// Template category loaders by framework
const templatesExpressCategories: Record<string, any> = {
  "base.json": templatesExpressBase,
};

const templatesHonoCategories: Record<string, any> = {
  "base.json": templatesHonoBase,
};

const templatesElysiaCategories: Record<string, any> = {
  "base.json": templatesElysiaBase,
};

const allTemplatesCategories: Record<string, Record<string, any>> = {
  express: templatesExpressCategories,
  hono: templatesHonoCategories,
  elysia: templatesElysiaCategories,
};

// Add-ons loader
export const addonsIndexData: any = addonsIndex;

const addonsCategories: Record<string, any> = {
  "database.json": addonsDatabase,
  "auth.json": addonsAuth,
  "features.json": addonsFeatures,
  "presets.json": addonsPresets,
};

export function loadAddonCategory(fileName: string): any | null {
  return addonsCategories[fileName] || null;
}

export function loadTemplateCategory(
  fileName: string,
  framework: string = "express",
): any | null {
  const categories = allTemplatesCategories[framework];
  return categories?.[fileName] || null;
}

// Modules loader
export const modulesData: any = modulesIndex;

// Sources loaders
export const snippetSources: Record<FrameworkType, Record<string, string>> = {
  express: expressSourcesJson as Record<string, string>,
  hono: honoSourcesJson as Record<string, string>,
  elysia: elysiaSourcesJson as Record<string, string>,
  shared: sharedSourcesJson as Record<string, string>,
};

export function getSnippetSource(
  framework: FrameworkType,
  snippetId: string,
): string | null {
  const sources = snippetSources[framework];
  return sources?.[snippetId] || null;
}
