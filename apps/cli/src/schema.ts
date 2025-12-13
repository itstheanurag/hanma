import { z } from "zod";

export const registryItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  files: z.array(
    z.object({
      name: z.string(),
      content: z.string(),
    })
  ),
  framework: z.string().optional(),
  version: z.string().optional(),
});

export const registrySchema = z.array(registryItemSchema);

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type Registry = z.infer<typeof registrySchema>;
