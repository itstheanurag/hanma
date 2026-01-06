/**
 * Zod schemas for CLI registry data validation
 *
 * These schemas are inlined from @repo/schemas to avoid workspace
 * dependency issues when installing from npm.
 */

import { z } from "zod";

// ============================================================================
// Registry Schemas (snippets, addons, tooling)
// ============================================================================

export const registryItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(["snippet", "module", "addon", "tooling"]).default("snippet"),
  category: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  files: z.array(
    z.object({
      name: z.string(),
      path: z.string().optional(),
      content: z.string(),
    }),
  ),
  framework: z.string().optional(),
  version: z.string().optional(),
});

export const registrySchema = z.array(registryItemSchema);

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type Registry = z.infer<typeof registrySchema>;

// ============================================================================
// Template Schemas
// ============================================================================

export const templateFileSchema = z.object({
  path: z.string(),
  content: z.string(),
});

export const templateBlockSchema = z.object({
  name: z.string(),
  category: z.string(),
  description: z.string(),
  framework: z.string().optional(),
  version: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  scripts: z.record(z.string()).optional(),
  envVars: z.array(z.string()).optional(),
  files: z.array(templateFileSchema).optional(),
  featureType: z
    .enum([
      "mailer",
      "upload",
      "cache",
      "queue",
      "logging",
      "monitoring",
      "tooling",
    ])
    .optional(),
  merge: z
    .array(
      z.object({
        file: z.string(),
        strategy: z.enum(["deep", "replace", "append"]).default("replace"),
      }),
    )
    .optional(),
  includes: z
    .array(
      z.object({
        snippet: z.string(),
        path: z.string(),
      }),
    )
    .optional(),
});

export const templateRegistrySchema = z.object({
  base: z.array(templateBlockSchema),
  database: z.array(templateBlockSchema).optional(),
  auth: z.array(templateBlockSchema).optional(),
  features: z.array(templateBlockSchema).optional(),
  presets: z.array(templateBlockSchema).optional(),
  extra: z.array(templateBlockSchema).optional(),
});

export type TemplateFile = z.infer<typeof templateFileSchema>;
export type TemplateBlock = z.infer<typeof templateBlockSchema>;
export type TemplateRegistry = z.infer<typeof templateRegistrySchema>;

// ============================================================================
// Module Schemas
// ============================================================================

export const moduleBlockSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  framework: z.string().optional(),
  version: z.string().optional(),
  dependencies: z.array(z.string()),
  devDependencies: z.array(z.string()),
  scripts: z.record(z.string()).optional(),
  envVars: z.array(z.string()).optional(),
  files: z.array(templateFileSchema),
});

export const modulesRegistrySchema = z.object({
  categories: z.array(z.string()),
  modules: z.record(z.array(moduleBlockSchema)),
});

export type ModuleBlock = z.infer<typeof moduleBlockSchema>;
export type ModulesRegistry = z.infer<typeof modulesRegistrySchema>;
