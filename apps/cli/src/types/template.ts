/**
 * CLI-specific template types
 *
 * These extend or complement the shared types from @repo/schemas
 */

import type { TemplateFile, TemplateBlock, ModuleBlock } from "@repo/schemas";

// Re-export shared types for convenience
export type { TemplateFile, TemplateBlock, ModuleBlock } from "@repo/schemas";

/**
 * Collected data from processing template/module blocks
 * Used during project scaffolding
 */
export interface CollectedBlockData {
  files: TemplateFile[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  envVars: string[];
}
