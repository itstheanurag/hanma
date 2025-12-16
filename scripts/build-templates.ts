import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.resolve(__dirname, "../apps/cli/content/templates");
const SNIPPETS_DIR = path.resolve(__dirname, "../apps/cli/content/snippets");
const MODULES_DIR = path.resolve(__dirname, "../apps/cli/content/modules");
const PUBLIC_DIR = path.resolve(__dirname, "../apps/web/public");

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

interface SnippetMeta {
  name: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  files?: Array<{ name: string; source?: string }>;
}

/**
 * Parse a snippet .hbs file and extract frontmatter + body
 */
async function parseSnippetFile(snippetPath: string): Promise<{
  meta: SnippetMeta;
  body: string;
} | null> {
  const fullPath = path.join(SNIPPETS_DIR, snippetPath);

  if (!(await fs.pathExists(fullPath))) {
    console.warn(`  ⚠ Snippet not found: ${snippetPath}`);
    return null;
  }

  const content = await fs.readFile(fullPath, "utf-8");
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    return {
      meta: { name: path.basename(snippetPath, ".hbs") },
      body: content,
    };
  }

  const metadataRaw = frontmatterMatch[1];
  const bodyContent = frontmatterMatch[2];

  try {
    const meta = yaml.load(metadataRaw) as SnippetMeta;
    return { meta, body: bodyContent };
  } catch (e) {
    console.error(`  ⚠ Error parsing snippet ${snippetPath}:`, e);
    return null;
  }
}

async function main() {
  console.log("Building template registry...");

  const REGISTRY_DIR = path.join(PUBLIC_DIR, "templates");
  await fs.ensureDir(REGISTRY_DIR);

  const registry: {
    base: TemplateBlock[];
    database: TemplateBlock[];
    auth: TemplateBlock[];
    features: TemplateBlock[];
    presets: TemplateBlock[];
    extra: TemplateBlock[];
  } = {
    base: [],
    database: [],
    auth: [],
    features: [],
    presets: [],
    extra: [],
  };

  // Process each category
  const categories = [
    "base",
    "database",
    "auth",
    "features",
    "presets",
    "extra",
  ] as const;

  for (const category of categories) {
    const categoryPath = path.join(TEMPLATES_DIR, category);
    if (!(await fs.pathExists(categoryPath))) continue;

    // Recursively find all _meta.yaml files in this category
    async function findMetaFiles(dir: string): Promise<string[]> {
      const results: string[] = [];
      const entries = await fs.readdir(dir);

      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
          // Check if this directory has _meta.yaml
          const metaPath = path.join(fullPath, "_meta.yaml");
          if (await fs.pathExists(metaPath)) {
            results.push(fullPath);
          } else {
            // Recursively search subdirectories
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
      const metaPath = path.join(blockPath, "_meta.yaml");

      // Parse metadata
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

          const snippetPath = snippetRef.snippet;
          const parsed = await parseSnippetFile(snippetPath);

          if (!parsed) continue;

          // Merge snippet dependencies
          if (parsed.meta.dependencies) {
            for (const dep of parsed.meta.dependencies) {
              if (!block.dependencies!.includes(dep)) {
                block.dependencies!.push(dep);
              }
            }
          }
          if (parsed.meta.devDependencies) {
            for (const dep of parsed.meta.devDependencies) {
              if (!block.devDependencies!.includes(dep)) {
                block.devDependencies!.push(dep);
              }
            }
          }

          // Determine output path
          let outputPath: string;
          if (snippetRef.path) {
            outputPath = snippetRef.path;
          } else if (parsed.meta.files && parsed.meta.files[0]) {
            outputPath = parsed.meta.files[0].name;
          } else {
            outputPath = path.basename(snippetPath, ".hbs") + ".ts";
          }

          block.files.push({
            path: outputPath,
            content: parsed.body,
          });

          console.log(`    ↳ Included snippet: ${snippetPath} → ${outputPath}`);
        }
      }

      // Process modules (bundles of files that reference snippets)
      if (meta.modules && Array.isArray(meta.modules)) {
        for (const moduleRef of meta.modules) {
          const modulePath =
            typeof moduleRef === "string" ? moduleRef : moduleRef.module;
          const moduleFullPath = path.join(MODULES_DIR, modulePath);
          const moduleMetaPath = path.join(moduleFullPath, "_meta.yaml");

          if (!(await fs.pathExists(moduleMetaPath))) {
            console.warn(`  ⚠ Module not found: ${modulePath}`);
            continue;
          }

          const moduleMetaContent = await fs.readFile(moduleMetaPath, "utf-8");
          const moduleMeta = yaml.load(moduleMetaContent) as any;

          console.log(`    ↳ Including module: ${modulePath}`);

          // Process snippets referenced by the module
          if (moduleMeta.snippets && Array.isArray(moduleMeta.snippets)) {
            for (const snippetPath of moduleMeta.snippets) {
              const parsed = await parseSnippetFile(snippetPath);
              if (!parsed) continue;

              // Merge dependencies
              if (parsed.meta.dependencies) {
                for (const dep of parsed.meta.dependencies) {
                  if (!block.dependencies!.includes(dep)) {
                    block.dependencies!.push(dep);
                  }
                }
              }
              if (parsed.meta.devDependencies) {
                for (const dep of parsed.meta.devDependencies) {
                  if (!block.devDependencies!.includes(dep)) {
                    block.devDependencies!.push(dep);
                  }
                }
              }

              let outputPath: string;
              if (parsed.meta.files && parsed.meta.files[0]) {
                outputPath = parsed.meta.files[0].name;
              } else {
                outputPath = path.basename(snippetPath, ".hbs") + ".ts";
              }

              block.files.push({
                path: outputPath,
                content: parsed.body,
              });

              console.log(
                `      ↳ Module snippet: ${snippetPath} → ${outputPath}`,
              );
            }
          }

          // Merge module's own dependencies
          if (moduleMeta.dependencies) {
            for (const dep of moduleMeta.dependencies) {
              if (!block.dependencies!.includes(dep)) {
                block.dependencies!.push(dep);
              }
            }
          }
          if (moduleMeta.devDependencies) {
            for (const dep of moduleMeta.devDependencies) {
              if (!block.devDependencies!.includes(dep)) {
                block.devDependencies!.push(dep);
              }
            }
          }

          // Collect module's own files
          async function collectModuleFiles(
            dir: string,
            basePath: string = "",
          ) {
            const entries = await fs.readdir(dir);
            for (const entry of entries) {
              if (entry === "_meta.yaml") continue;

              const fullPath = path.join(dir, entry);
              const relativePath = path.join(basePath, entry);
              const stat = await fs.stat(fullPath);

              if (stat.isDirectory()) {
                await collectModuleFiles(fullPath, relativePath);
              } else {
                const content = await fs.readFile(fullPath, "utf-8");
                block.files.push({
                  path: relativePath,
                  content,
                });
              }
            }
          }

          await collectModuleFiles(moduleFullPath);
        }
      }

      // Collect all files (excluding _meta.yaml)
      async function collectFiles(dir: string, basePath: string = "") {
        const entries = await fs.readdir(dir);
        for (const entry of entries) {
          if (entry === "_meta.yaml") continue;

          const fullPath = path.join(dir, entry);
          const relativePath = path.join(basePath, entry);
          const stat = await fs.stat(fullPath);

          if (stat.isDirectory()) {
            await collectFiles(fullPath, relativePath);
          } else {
            const content = await fs.readFile(fullPath, "utf-8");
            block.files.push({
              path: relativePath,
              content,
            });
          }
        }
      }

      await collectFiles(blockPath);

      registry[category].push(block);
      console.log(`  ✓ ${category}/${blockName} (${block.files.length} files)`);
    }
  }

  // Write registry
  await fs.writeJSON(path.join(REGISTRY_DIR, "index.json"), registry, {
    spaces: 2,
  });

  console.log(`\nTemplate registry built successfully!`);
  console.log(`  Base: ${registry.base.length} blocks`);
  console.log(`  Database: ${registry.database.length} blocks`);
  console.log(`  Auth: ${registry.auth.length} blocks`);
  console.log(`  Features: ${registry.features.length} blocks`);
  console.log(`  Presets: ${registry.presets.length} blocks`);
}

main().catch(console.error);
