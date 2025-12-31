import fs from "fs-extra";
import path from "path";
import yaml from "js-yaml";
import {
  TEMPLATES_DIR,
  SNIPPETS_DIR,
  SHARED_DIR,
  TOOLING_DIR,
  MODULES_DIR,
  DOCS_REGISTRY_DIR,
  parseSnippetFile,
} from "./utils";

const TEMPLATES_OUTPUT_DIR = path.join(
  path.dirname(DOCS_REGISTRY_DIR),
  "templates",
);

/**
 * Resolve a snippet reference path to its actual filesystem path.
 * Handles:
 * - shared/... → SHARED_DIR (cross-framework snippets/addons)
 * - tooling/... → TOOLING_DIR (dev tool configs)
 * - framework/... → SNIPPETS_DIR (framework-specific)
 */
function resolveSnippetPath(snippetRef: string): string {
  if (snippetRef.startsWith("shared/")) {
    // shared/db/prisma-client.hbs → SHARED_DIR/db/prisma-client.hbs
    const relativePath = snippetRef.replace("shared/", "");
    return path.join(SHARED_DIR, relativePath);
  } else if (snippetRef.startsWith("tooling/")) {
    // tooling/biome/config.hbs → TOOLING_DIR/biome/config.hbs
    const relativePath = snippetRef.replace("tooling/", "");
    return path.join(TOOLING_DIR, relativePath);
  } else {
    // Default: framework-specific snippets
    return path.join(SNIPPETS_DIR, snippetRef);
  }
}

interface TemplateBlock {
  name: string;
  category: string;
  description: string;
  framework?: string;
  version?: string;
  dependencies?: string[];
  devDependencies?: string[];
  scripts?: Record<string, string>;
  envVars?: string[];
  files: Array<{ path: string; content: string }>;
  featureType?: string;
}

/**
 * Build a template block from a directory containing _meta.yaml
 */
async function buildTemplateBlock(
  blockPath: string,
  category: string,
  blockName: string,
): Promise<TemplateBlock | null> {
  const metaPath = path.join(blockPath, "_meta.yaml");

  if (!(await fs.pathExists(metaPath))) {
    return null;
  }

  const metaContent = await fs.readFile(metaPath, "utf-8");
  const meta = yaml.load(metaContent) as any;

  const block: TemplateBlock = {
    name: meta.name || blockName,
    category,
    description: meta.description || "",
    framework: meta.framework,
    version: meta.version,
    dependencies: [...(meta.dependencies || [])],
    devDependencies: [...(meta.devDependencies || [])],
    scripts: meta.scripts,
    envVars: [...(meta.envVars || [])],
    files: [],
    featureType: meta.featureType,
  };

  // Process includes (snippets to import)
  if (meta.includes && Array.isArray(meta.includes)) {
    for (const include of meta.includes) {
      const snippetRef =
        typeof include === "string"
          ? { snippet: include, path: null }
          : include;
      const snippetPath = resolveSnippetPath(snippetRef.snippet);
      const parsed = await parseSnippetFile(snippetPath);

      if (!parsed) {
        console.warn(`⚠ Snippet not found: ${snippetRef.snippet}`);
        continue;
      }

      // Merge snippet dependencies
      if (parsed.meta.dependencies) {
        for (const dep of parsed.meta.dependencies) {
          if (!block.dependencies!.includes(dep)) block.dependencies!.push(dep);
        }
      }
      if (parsed.meta.devDependencies) {
        for (const dep of parsed.meta.devDependencies) {
          if (!block.devDependencies!.includes(dep))
            block.devDependencies!.push(dep);
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

      block.files.push({ path: outputPath, content: parsed.body });
      console.log(`↳ Included snippet: ${snippetRef.snippet} → ${outputPath}`);
    }
  }

  // Process modules
  if (meta.modules && Array.isArray(meta.modules)) {
    for (const moduleRef of meta.modules) {
      const moduleName =
        typeof moduleRef === "string" ? moduleRef : moduleRef.module;
      const modulePath = path.join(MODULES_DIR, moduleName);
      const moduleMetaPath = path.join(modulePath, "_meta.yaml");

      if (!(await fs.pathExists(moduleMetaPath))) {
        console.warn(`⚠ Module not found: ${moduleName}`);
        continue;
      }

      const moduleMetaContent = await fs.readFile(moduleMetaPath, "utf-8");
      const moduleMeta = yaml.load(moduleMetaContent) as any;

      console.log(`↳ Including module: ${moduleName}`);

      if (moduleMeta.snippets && Array.isArray(moduleMeta.snippets)) {
        for (const snippetRef of moduleMeta.snippets) {
          const snippetSubPath =
            typeof snippetRef === "string" ? snippetRef : snippetRef.snippet;
          const snippetFullPath = path.join(SNIPPETS_DIR, snippetSubPath);
          const parsed = await parseSnippetFile(snippetFullPath);
          if (!parsed) continue;

          if (parsed.meta.dependencies) {
            for (const dep of parsed.meta.dependencies) {
              if (!block.dependencies!.includes(dep))
                block.dependencies!.push(dep);
            }
          }
          if (parsed.meta.devDependencies) {
            for (const dep of parsed.meta.devDependencies) {
              if (!block.devDependencies!.includes(dep))
                block.devDependencies!.push(dep);
            }
          }

          let outputPath: string;
          if (typeof snippetRef !== "string" && snippetRef.path) {
            outputPath = snippetRef.path;
          } else if (parsed.meta.files && parsed.meta.files[0]) {
            outputPath = parsed.meta.files[0].name;
          } else {
            outputPath = path.basename(snippetSubPath, ".hbs") + ".ts";
          }

          block.files.push({ path: outputPath, content: parsed.body });
        }
      }

      // Merge module's own dependencies
      if (moduleMeta.dependencies) {
        for (const dep of moduleMeta.dependencies) {
          if (!block.dependencies!.includes(dep)) block.dependencies!.push(dep);
        }
      }

      // Collect module files
      const collectFiles = async (dir: string, base: string = "") => {
        const entries = await fs.readdir(dir);
        for (const entry of entries) {
          if (entry === "_meta.yaml") continue;
          const full = path.join(dir, entry);
          const rel = path.join(base, entry);
          const stat = await fs.stat(full);
          if (stat.isDirectory()) {
            await collectFiles(full, rel);
          } else {
            block.files.push({
              path: rel,
              content: await fs.readFile(full, "utf-8"),
            });
          }
        }
      };
      await collectFiles(modulePath);
    }
  }

  // Collect block files
  const collectBlockFiles = async (dir: string, base: string = "") => {
    const entries = await fs.readdir(dir);
    for (const entry of entries) {
      if (entry === "_meta.yaml") continue;
      const full = path.join(dir, entry);
      const rel = path.join(base, entry);
      const stat = await fs.stat(full);
      if (stat.isDirectory()) {
        await collectBlockFiles(full, rel);
      } else {
        block.files.push({
          path: rel,
          content: await fs.readFile(full, "utf-8"),
        });
      }
    }
  };
  await collectBlockFiles(blockPath);

  return block;
}

async function main() {
  console.log("Building template registry...");

  await fs.ensureDir(TEMPLATES_OUTPUT_DIR);

  const registry: Record<string, TemplateBlock[]> = {
    base: [],
    database: [],
    auth: [],
    features: [],
    presets: [],
    extra: [],
  };

  // Framework directories that may contain base templates
  const FRAMEWORK_DIRS = ["express", "hono", "elysia"];

  // First, look for base templates inside framework directories (e.g., express/base, hono/base)
  for (const framework of FRAMEWORK_DIRS) {
    const frameworkBasePath = path.join(TEMPLATES_DIR, framework, "base");
    if (!(await fs.pathExists(frameworkBasePath))) continue;

    const metaPath = path.join(frameworkBasePath, "_meta.yaml");
    if (!(await fs.pathExists(metaPath))) continue;

    const block = await buildTemplateBlock(
      frameworkBasePath,
      "base",
      framework,
    );
    if (block) {
      registry.base.push(block);
      console.log(`✓ base/${framework} (${block.files.length} files)`);
    }

    // Also check for variants in subdirectories (e.g., express/graphql, express/trpc)
    const entries = await fs.readdir(path.join(TEMPLATES_DIR, framework));
    for (const entry of entries) {
      if (entry === "base") continue; // Already processed
      const variantPath = path.join(TEMPLATES_DIR, framework, entry);
      const stat = await fs.stat(variantPath);
      if (!stat.isDirectory()) continue;

      const variantMetaPath = path.join(variantPath, "_meta.yaml");
      if (!(await fs.pathExists(variantMetaPath))) continue;

      const variantBlock = await buildTemplateBlock(
        variantPath,
        "base",
        `${framework}-${entry}`,
      );
      if (variantBlock) {
        registry.base.push(variantBlock);
        console.log(
          `✓ base/${framework}-${entry} (${variantBlock.files.length} files)`,
        );
      }
    }
  }

  const categories = Object.keys(registry) as (keyof typeof registry)[];

  for (const category of categories) {
    if (category === "base") continue; // Already handled above
    const categoryPath = path.join(TEMPLATES_DIR, category);
    if (!(await fs.pathExists(categoryPath))) continue;

    // Recursive function to find directories containing _meta.yaml
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

    const blockPaths = await findMetaFiles(categoryPath);

    for (const blockPath of blockPaths) {
      const blockName = path
        .relative(categoryPath, blockPath)
        .replace(/\//g, "-");

      const block = await buildTemplateBlock(blockPath, category, blockName);
      if (block) {
        registry[category].push(block);
        console.log(`✓ ${category}/${blockName} (${block.files.length} files)`);
      }
    }
  }

  await fs.writeJSON(path.join(TEMPLATES_OUTPUT_DIR, "index.json"), registry, {
    spaces: 2,
  });
  console.log(`\nTemplate registry built successfully!`);
}

main().catch(console.error);
