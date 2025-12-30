import { RegistryItem } from "./schema";

export interface TemplateFile {
  path: string;
  content: string;
}

export interface TemplateBlock {
  name: string;
  category: string;
  description: string;
  framework?: string;
  version?: string;
  dependencies?: string[];
  devDependencies?: string[];
  scripts?: Record<string, string>;
  envVars?: string[];
  files: TemplateFile[];
  featureType?:
    | "mailer"
    | "upload"
    | "cache"
    | "queue"
    | "logging"
    | "monitoring"
    | "tooling";
}

export interface TemplateRegistry {
  base: TemplateBlock[];
  database: TemplateBlock[];
  auth: TemplateBlock[];
  features?: TemplateBlock[];
  presets?: TemplateBlock[];
  extra?: TemplateBlock[];
}

export interface CollectedBlockData {
  files: TemplateFile[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  envVars: string[];
}

export { type RegistryItem };
