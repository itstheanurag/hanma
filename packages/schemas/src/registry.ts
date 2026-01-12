import { z } from "zod";

/**
 * Schema for individual registry items (snippets, addons, tooling)
 */
export const registryItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(["snippet", "module", "addon", "tooling"]).default("snippet"),
  category: z.string().optional(),
  dependencies: z.array(z.string()).nullish(),
  devDependencies: z.array(z.string()).nullish(),
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

/**
 * Schema for a collection of registry items
 */
export const registrySchema = z.array(registryItemSchema);

/**
 * A single registry item (snippet, addon, tooling)
 */
export type RegistryItem = z.infer<typeof registryItemSchema>;

/**
 * Collection of registry items
 */
export type Registry = z.infer<typeof registrySchema>;
