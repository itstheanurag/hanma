import fs from "fs-extra";
import path from "path";
import yaml from "js-yaml";

import {
  MODULES_DIR,
  SNIPPETS_DIR,
  SHARED_DIR,
  DOCS_REGISTRY_DIR,
  parseSnippetFile,
  normalizeDependencies,
} from "./utils";

const MODULES_OUTPUT_DIR = path.join(
  path.dirname(DOCS_REGISTRY_DIR),
  "modules",
);

/**
 * Resolve a snippet reference path to its actual filesystem path.
 * Handles shared/... paths to SHARED_DIR and all others to SNIPPETS_DIR
 */
function resolveSnippetPath(snippetRef: string): string {
  if (snippetRef.startsWith("shared/")) {
    const relativePath = snippetRef.replace("shared/", "");
    return path.join(SHARED_DIR, relativePath);
  }
  return path.join(SNIPPETS_DIR, snippetRef);
}

interface ModuleBlock {
  name: string;
  description: string;
  category: string;
  framework?: string;
  version?: string;
  dependencies: string[];
  devDependencies: string[];
  scripts?: Record<string, string>;
  envVars?: string[];
  files: Array<{ path: string; content: string }>;
}

interface ModulesRegistry {
  categories: string[];
  modules: Record<string, ModuleBlock[]>;
}

/**
 * Recursively find directories containing _meta.yaml files
 */
async function findMetaFiles(dir: string): Promise<string[]> {
  const results: string[] = [];
  const entries = await fs.readdir(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      const metaPath = path.join(fullPath, "_meta.yaml");
      if (await fs.pathExists(metaPath)) {
        results.push(fullPath);
      } else {
        results.push(...(await findMetaFiles(fullPath)));
      }
    }
  }
  return results;
}

/**
 * Build a module block from a directory containing _meta.yaml
 */
async function buildModuleBlock(
  modulePath: string,
  category: string,
): Promise<ModuleBlock | null> {
  const metaPath = path.join(modulePath, "_meta.yaml");

  if (!(await fs.pathExists(metaPath))) {
    return null;
  }

  const metaContent = await fs.readFile(metaPath, "utf-8");
  const meta = yaml.load(metaContent) as any;

  const moduleBlock: ModuleBlock = {
    name: meta.name || path.basename(modulePath),
    description: meta.description || "",
    category,
    framework: meta.framework,
    version: meta.version,
    dependencies: normalizeDependencies(meta.dependencies),
    devDependencies: normalizeDependencies(meta.devDependencies),
    scripts: meta.scripts,
    envVars: [...(meta.envVars || [])],
    files: [],
  };

  // Process included snippets
  if (meta.includes && Array.isArray(meta.includes)) {
    for (const include of meta.includes) {
      const snippetRef =
        typeof include === "string"
          ? { snippet: include, path: null }
          : include;
      const snippetPath = resolveSnippetPath(snippetRef.snippet);
      const parsed = await parseSnippetFile(snippetPath);

      if (!parsed) {
        console.warn(`  ⚠ Snippet not found: ${snippetRef.snippet}`);
        continue;
      }

      // Merge snippet dependencies
      if (parsed.meta.dependencies) {
        for (const dep of parsed.meta.dependencies) {
          if (!moduleBlock.dependencies.includes(dep))
            moduleBlock.dependencies.push(dep);
        }
      }
      if (parsed.meta.devDependencies) {
        for (const dep of parsed.meta.devDependencies) {
          if (!moduleBlock.devDependencies.includes(dep))
            moduleBlock.devDependencies.push(dep);
        }
      }

      // Determine output path
      let outputPath: string;
      if (snippetRef.path) {
        outputPath = snippetRef.path;
      } else if (parsed.meta.files && parsed.meta.files[0]) {
        outputPath = parsed.meta.files[0].name;
      } else {
        outputPath = path.basename(snippetRef.snippet, ".hbs") + ".ts";
      }

      moduleBlock.files.push({ path: outputPath, content: parsed.body });
      console.log(
        `    ↳ Included snippet: ${snippetRef.snippet} → ${outputPath}`,
      );
    }
  }

  // Collect module's own files
  const collectFiles = async (dir: string, base: string = "") => {
    const entries = await fs.readdir(dir);
    for (const entry of entries) {
      if (entry === "_meta.yaml") continue;
      const full = path.join(dir, entry);
      let rel = path.join(base, entry);
      const stat = await fs.stat(full);
      if (stat.isDirectory()) {
        await collectFiles(full, rel);
      } else {
        // Strip .hbs extension from file paths
        if (rel.endsWith(".hbs")) {
          rel = rel.slice(0, -4);
        }
        moduleBlock.files.push({
          path: rel,
          content: await fs.readFile(full, "utf-8"),
        });
      }
    }
  };
  await collectFiles(modulePath);

  return moduleBlock;
}

async function main() {
  console.log("Building modules registry...\n");

  await fs.ensureDir(MODULES_OUTPUT_DIR);

  if (!(await fs.pathExists(MODULES_DIR))) {
    console.log("No modules directory found.");
    const emptyRegistry: ModulesRegistry = { categories: [], modules: {} };
    await fs.writeJSON(
      path.join(MODULES_OUTPUT_DIR, "index.json"),
      emptyRegistry,
      {
        spaces: 2,
      },
    );
    return;
  }

  const registry: ModulesRegistry = {
    categories: [],
    modules: {},
  };

  // Get category directories (auth, database, i18n, etc.)
  const categoryDirs = await fs.readdir(MODULES_DIR);

  for (const categoryName of categoryDirs) {
    const categoryPath = path.join(MODULES_DIR, categoryName);
    if (!(await fs.stat(categoryPath)).isDirectory()) continue;

    registry.categories.push(categoryName);
    registry.modules[categoryName] = [];
    console.log(`📁 Processing category: ${categoryName}`);

    // Find all module directories with _meta.yaml
    const modulePaths = await findMetaFiles(categoryPath);

    for (const modulePath of modulePaths) {
      const moduleBlock = await buildModuleBlock(modulePath, categoryName);

      if (moduleBlock) {
        registry.modules[categoryName].push(moduleBlock);
        console.log(
          `  ✓ ${categoryName}/${moduleBlock.name} (${moduleBlock.files.length} files)`,
        );
      }
    }
  }

  // Write the full registry
  await fs.writeJSON(path.join(MODULES_OUTPUT_DIR, "index.json"), registry, {
    spaces: 2,
  });

  // Also write per-category files for easier fetching
  for (const category of registry.categories) {
    await fs.writeJSON(
      path.join(MODULES_OUTPUT_DIR, `${category}.json`),
      registry.modules[category],
      { spaces: 2 },
    );
  }

  console.log(`\n✓ Modules registry built successfully!`);
  console.log(`  Categories: ${registry.categories.join(", ")}`);
}

main().catch(console.error);
