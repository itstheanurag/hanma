import { z } from "zod";

/**
 * Schema for a file within a template or module
 */
export const templateFileSchema = z.object({
  path: z.string(),
  content: z.string(),
});

/**
 * Schema for template blocks (base, database, auth, features, etc.)
 */
export const templateBlockSchema = z.object({
  name: z.string(),
  category: z.string(), // Flexible: "base", "database", "auth", "feature", "mailer", "upload", etc.
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

/**
 * Schema for the template registry structure
 */
export const templateRegistrySchema = z.object({
  base: z.array(templateBlockSchema),
  database: z.array(templateBlockSchema).optional(),
  auth: z.array(templateBlockSchema).optional(),
  features: z.array(templateBlockSchema).optional(),
  presets: z.array(templateBlockSchema).optional(),
  extra: z.array(templateBlockSchema).optional(),
});

/**
 * A file within a template or module
 */
export type TemplateFile = z.infer<typeof templateFileSchema>;

/**
 * A template block (base, feature, preset, etc.)
 */
export type TemplateBlock = z.infer<typeof templateBlockSchema>;

/**
 * The template registry structure
 */
export type TemplateRegistry = z.infer<typeof templateRegistrySchema>;
