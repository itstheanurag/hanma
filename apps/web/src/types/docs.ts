export interface SnippetDoc {
  id: string;
  name: string;
  displayName?: string;
  path?: string;
  description: string;
  purpose?: string;
  features?: string[];
  output: string;
  dependencies: string[];
  devDependencies?: string[];
  envVars?: Array<{
    name: string;
    default?: string;
    required?: boolean;
    description?: string;
  }>;
  usage?: string;
  command: string;
  related?: string[];
}

export interface SnippetSubcategory {
  id: string;
  title: string;
  description: string;
  snippets: SnippetDoc[];
}

export interface SnippetCategory {
  id: string;
  title: string;
  description: string;
  subcategories: SnippetSubcategory[];
}

export interface SnippetConcept {
  whatIsASnippet: string;
  whenToUseSnippets: string[];
  snippetsVsPackages: {
    snippets: string;
    packages: string;
    benefit: string;
  };
}

export interface SnippetExample {
  title: string;
  description: string;
  command: string;
}

export interface SnippetFramework {
  framework: string;
  version: string;
  title: string;
  description: string;
  installNote?: string;
  concept?: SnippetConcept;
  examples?: SnippetExample[];
  categories: SnippetCategory[];
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  purpose?: string;
  features?: string[];
  includes?: string[];
  command: string;
  dependencies?: string[];
  devDependencies?: string[];
  scripts?: Record<string, string>;
  envVars?:
    | Array<{
        name: string;
        default?: string;
        required?: boolean;
        example?: string;
      }>
    | string[];
  nextSteps?: string[];
  recommended?: boolean;
  structure?: string[];
}

export interface TemplateSubcategory {
  id: string;
  title: string;
  description?: string;
  templates: Template[];
}

export interface TemplateCategory {
  id: string;
  title: string;
  description: string;
  templates?: Template[];
  subcategories?: TemplateSubcategory[];
}

export interface TemplatesData {
  title: string;
  description: string;
  categories: TemplateCategory[];
  examples?: Array<{ title: string; description: string; command: string }>;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  purpose: string;
  features: string[];
  files: Array<{ name: string; description: string }>;
  usage: { add: string; example: string };
}

export interface UpcomingModule {
  id: string;
  name: string;
  description: string;
  status: string;
}

export interface ModulesData {
  title: string;
  description: string;
  concept: {
    whatIsAModule: string;
    whenToUseModules: string[];
  };
  modules: Module[];
  upcomingModules: UpcomingModule[];
}

export type TabType =
  | "snippets"
  | "addons"
  | "templates"
  | "modules"
  | "tooling";

export type FrameworkType = "express" | "hono" | "elysia" | "fastify" | "nest";

export interface DocsState {
  activeTab: TabType;
  activeCategory: string;
  snippetsData: SnippetFramework | null;
  templatesData: TemplatesData | null;
  modulesData: ModulesData | null;
  loading: boolean;
}
