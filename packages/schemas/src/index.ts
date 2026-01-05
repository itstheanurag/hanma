/**
 * @repo/schemas
 *
 * Shared Zod schemas and TypeScript types for the Hanma monorepo.
 * Used by both CLI and Web applications.
 */

// Registry schemas and types (snippets, addons, tooling)
export {
  registryItemSchema,
  registrySchema,
  type RegistryItem,
  type Registry,
} from "./registry";

// Template schemas and types
export {
  templateFileSchema,
  templateBlockSchema,
  templateRegistrySchema,
  type TemplateFile,
  type TemplateBlock,
  type TemplateRegistry,
} from "./template";

// Module schemas and types
export {
  moduleBlockSchema,
  modulesRegistrySchema,
  type ModuleBlock,
  type ModulesRegistry,
} from "./module";
