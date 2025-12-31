import { z } from "zod";

export const registryItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(["snippet", "module", "addon", "tooling"]).default("snippet"),
  category: z.string().optional(), // e.g., "libs", "middleware", "utils"
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  files: z.array(
    z.object({
      name: z.string(),
      path: z.string().optional(), // For modules: relative path within the module
      content: z.string(),
    }),
  ),
  framework: z.string().optional(),
  version: z.string().optional(),
});

export const registrySchema = z.array(registryItemSchema);

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type Registry = z.infer<typeof registrySchema>;
