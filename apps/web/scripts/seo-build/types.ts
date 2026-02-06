/**
 * Type definitions for SEO page generation
 */

export interface Framework {
  id: string;
  name: string;
  description: string;
}

export interface Snippet {
  id: string;
  name: string;
  displayName: string;
  description: string;
  purpose: string;
  features: string[];
  usage: string;
  output: string;
  dependencies: string[];
  command: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  snippets: Snippet[];
}

export interface FrameworkContent {
  framework: string;
  version: string;
  title: string;
  description: string;
  installNote: string;
  categoryFiles: CategoryFile[];
}

export interface CategoryFile {
  id: string;
  file: string;
  title: string;
  description: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  purpose: string;
  features: string[];
  files: Array<{ name: string; description: string }>;
  usage: {
    add: string;
    example: string;
  };
}

export interface PageMetadata {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noindex?: boolean;
}

export interface PageContext {
  framework?: string;
  category?: string;
  snippet?: string;
  useCase?: string;
  guide?: string;
  pattern?: string;
  tag?: string;
  query?: string;
}

export interface GeneratedPage {
  path: string;
  content: string;
  metadata: PageMetadata;
}

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

export interface BuildStats {
  totalPages: number;
  pagesByType: Record<string, number>;
  buildTime: number;
}
