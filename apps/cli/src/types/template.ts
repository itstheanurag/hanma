/**
 * CLI-specific template types
 */

import type { TemplateFile, TemplateBlock, ModuleBlock } from "./schemas";

// Re-export shared types for convenience
export type { TemplateFile, TemplateBlock, ModuleBlock } from "./schemas";

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
