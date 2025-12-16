import { z } from "zod";

// Template Block Schema (for _meta.yaml files)
export const templateBlockSchema = z.object({
  name: z.string(),
  category: z.enum(["base", "database", "auth", "feature", "preset", "extra"]),
  description: z.string(),
  framework: z.string().optional(),
  version: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  scripts: z.record(z.string()).optional(),
  envVars: z.array(z.string()).optional(),
  // Feature-specific fields
  featureType: z
    .enum(["mailer", "upload", "cache", "queue", "logging", "monitoring"])
    .optional(),
  merge: z
    .array(
      z.object({
        file: z.string(),
        strategy: z.enum(["deep", "replace", "append"]).default("replace"),
      }),
    )
    .optional(),
  // Include snippets from snippets directory
  includes: z
    .array(
      z.object({
        snippet: z.string(),
        path: z.string(),
      }),
    )
    .optional(),
});

export type TemplateBlock = z.infer<typeof templateBlockSchema>;

// Template Registry (available blocks by category)
export const templateRegistrySchema = z.object({
  base: z.array(templateBlockSchema),
  database: z.array(templateBlockSchema),
  auth: z.array(templateBlockSchema),
  features: z.array(templateBlockSchema).optional(),
  presets: z.array(templateBlockSchema).optional(),
  extra: z.array(templateBlockSchema).optional(),
});

export type TemplateRegistry = z.infer<typeof templateRegistrySchema>;
