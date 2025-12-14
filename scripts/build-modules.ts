import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULES_DIR = path.resolve(__dirname, "../apps/cli/content/modules");
const SNIPPETS_DIR = path.resolve(__dirname, "../apps/cli/content/snippets");
const PUBLIC_DIR = path.resolve(__dirname, "../apps/web/public");

interface ModuleBlock {
  name: string;
  description: string;
  framework: string;
  version: string;
  category?: string;
  dependencies: string[];
  devDependencies: string[];
  snippets: string[]; // References to snippets
  files: Array<{ path: string; content: string }>;
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
  console.log("Building modules registry...");

  const REGISTRY_DIR = path.join(PUBLIC_DIR, "modules");
  await fs.ensureDir(REGISTRY_DIR);

  // Registry grouped by framework
  const registry: Record<string, ModuleBlock[]> = {};
  const frameworks: string[] = [];

  // Check if modules directory exists
  if (!(await fs.pathExists(MODULES_DIR))) {
    console.log("No modules directory found. Creating empty registry.");
    await fs.writeJSON(path.join(REGISTRY_DIR, "index.json"), [], {
      spaces: 2,
    });
    return;
  }

  // Find all framework folders
  const frameworkDirs = await fs.readdir(MODULES_DIR);

  for (const frameworkName of frameworkDirs) {
    const frameworkPath = path.join(MODULES_DIR, frameworkName);
    if (!(await fs.stat(frameworkPath)).isDirectory()) continue;

    frameworks.push(frameworkName);
    registry[frameworkName] = [];
    console.log(`Processing framework: ${frameworkName}`);

    // Recursively find all _meta.yaml files
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

    const modulePaths = await findMetaFiles(frameworkPath);

    for (const modulePath of modulePaths) {
      const metaPath = path.join(modulePath, "_meta.yaml");
      const metaContent = await fs.readFile(metaPath, "utf-8");
      const meta = yaml.load(metaContent) as any;

      // Infer version from path
      const relativePath = path.relative(frameworkPath, modulePath);
      const pathParts = relativePath.split(path.sep);
      const version = pathParts[0] || "v1";

      const moduleBlock: ModuleBlock = {
        name: meta.name || path.basename(modulePath),
        description: meta.description || "",
        framework: frameworkName,
        version: meta.version || version,
        category: meta.category,
        dependencies: [...(meta.dependencies || [])],
        devDependencies: [...(meta.devDependencies || [])],
        snippets: [],
        files: [],
      };

      // Process snippet references
      if (meta.snippets && Array.isArray(meta.snippets)) {
        for (const snippetPath of meta.snippets) {
          moduleBlock.snippets.push(snippetPath);

          const parsed = await parseSnippetFile(snippetPath);
          if (!parsed) continue;

          // Merge snippet dependencies
          if (parsed.meta.dependencies) {
            for (const dep of parsed.meta.dependencies) {
              if (!moduleBlock.dependencies.includes(dep)) {
                moduleBlock.dependencies.push(dep);
              }
            }
          }
          if (parsed.meta.devDependencies) {
            for (const dep of parsed.meta.devDependencies) {
              if (!moduleBlock.devDependencies.includes(dep)) {
                moduleBlock.devDependencies.push(dep);
              }
            }
          }

          // Determine output path
          let outputPath: string;
          if (parsed.meta.files && parsed.meta.files[0]) {
            outputPath = parsed.meta.files[0].name;
          } else {
            outputPath = path.basename(snippetPath, ".hbs") + ".ts";
          }

          moduleBlock.files.push({
            path: outputPath,
            content: parsed.body,
          });

          console.log(`    ↳ Included snippet: ${snippetPath} → ${outputPath}`);
        }
      }

      // Collect module-specific files (excluding _meta.yaml)
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
            moduleBlock.files.push({
              path: relativePath,
              content,
            });
          }
        }
      }

      await collectFiles(modulePath);

      registry[frameworkName].push(moduleBlock);
      console.log(
        `  ✓ ${frameworkName}/${moduleBlock.name} (${moduleBlock.files.length} files)`,
      );
    }

    // Write per-framework registry
    await fs.writeJSON(
      path.join(REGISTRY_DIR, `${frameworkName}.json`),
      registry[frameworkName],
      { spaces: 2 },
    );
  }

  // Write index.json
  await fs.writeJSON(path.join(REGISTRY_DIR, "index.json"), frameworks, {
    spaces: 2,
  });

  console.log(`\nModules registry built successfully!`);
  console.log(`Frameworks: ${frameworks.join(", ") || "(none)"}`);
  for (const fw of frameworks) {
    console.log(`  ${fw}: ${registry[fw].length} modules`);
  }
}

main().catch(console.error);
