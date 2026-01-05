import { z } from "zod";
import { templateFileSchema } from "./template";

/**
 * Schema for module blocks (database, auth, etc.)
 */
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

/**
 * Schema for the modules registry structure
 */
export const modulesRegistrySchema = z.object({
  categories: z.array(z.string()),
  modules: z.record(z.array(moduleBlockSchema)),
});

/**
 * A module block (database, auth, etc.)
 */
export type ModuleBlock = z.infer<typeof moduleBlockSchema>;

/**
 * The modules registry structure
 */
export type ModulesRegistry = z.infer<typeof modulesRegistrySchema>;
