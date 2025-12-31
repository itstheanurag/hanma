import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, "..");
export const CLI_CONTENT_DIR = path.join(ROOT_DIR, "apps/cli/content");
export const SNIPPETS_DIR = path.join(CLI_CONTENT_DIR, "snippets");
export const TEMPLATES_DIR = path.join(CLI_CONTENT_DIR, "templates");
export const MODULES_DIR = path.join(CLI_CONTENT_DIR, "modules");
export const SHARED_DIR = path.join(CLI_CONTENT_DIR, "shared");
export const TOOLING_DIR = path.join(CLI_CONTENT_DIR, "tooling");
export const PUBLIC_DIR = path.join(ROOT_DIR, "apps/web/public");
export const WEB_SRC_DIR = path.join(ROOT_DIR, "apps/web/src");
export const DOCS_REGISTRY_DIR = path.join(PUBLIC_DIR, "registry");
export const DOCS_SOURCES_DIR = path.join(WEB_SRC_DIR, "docs/sources");

export interface SnippetMeta {
  name: string;
  id?: string;
  displayName?: string;
  description?: string;
  purpose?: string;
  features?: string[];
  usage?: string;
  output?: string;
  dependencies?: string[];
  devDependencies?: string[];
  files?: Array<{ name: string; source?: string; path?: string }>;
  version?: string;
  framework?: string;
  category?: string;
  type?: "snippet" | "module" | "addon" | "tooling";
  [key: string]: any;
}

export interface ParsedSnippet {
  meta: SnippetMeta;
  body: string;
}

/**
 * Parses a snippet .hbs file and extracts frontmatter + body
 */
export async function parseSnippetFile(
  filePath: string,
): Promise<ParsedSnippet | null> {
  if (!(await fs.pathExists(filePath))) {
    return null;
  }

  const content = await fs.readFile(filePath, "utf-8");
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    return {
      meta: { name: path.basename(filePath, ".hbs") } as SnippetMeta,
      body: content,
    };
  }

  const metadataRaw = frontmatterMatch[1];
  const bodyContent = frontmatterMatch[2];

  try {
    const meta = yaml.load(metadataRaw) as SnippetMeta;
    return { meta, body: bodyContent };
  } catch (e) {
    console.error(`  ⚠ Error parsing snippet ${filePath}:`, e);
    return null;
  }
}

/**
 * Recursively finds all files matching a filter in a directory
 */
export async function findFiles(
  dir: string,
  extension: string = ".hbs",
): Promise<string[]> {
  const results: string[] = [];

  if (!(await fs.pathExists(dir))) {
    return results;
  }

  const entries = await fs.readdir(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      results.push(...(await findFiles(fullPath, extension)));
    } else if (entry.endsWith(extension)) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Ensures a directory exists
 */
export async function ensureDir(dir: string) {
  await fs.ensureDir(dir);
}
