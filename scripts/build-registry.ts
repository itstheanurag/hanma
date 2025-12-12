import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SNIPPETS_DIR = path.resolve(__dirname, "../packages/snippets");
const PUBLIC_DIR = path.resolve(__dirname, "../apps/web/public");
const REGISTRY_FILE = path.join(PUBLIC_DIR, "registry.json");
const SNIPPETS_PUBLIC_DIR = path.join(PUBLIC_DIR, "snippets");

async function main() {
  console.log("Building registry...");

  await fs.ensureDir(PUBLIC_DIR);
  await fs.ensureDir(SNIPPETS_PUBLIC_DIR);

  const registry = [];

  // Find all framework folders
  const frameworks = await fs.readdir(SNIPPETS_DIR);

  for (const framework of frameworks) {
    const frameworkPath = path.join(SNIPPETS_DIR, framework);
    if (!(await fs.stat(frameworkPath)).isDirectory()) continue;

    // Recursive function to find json files
    async function findSnippetConfigs(dir: string) {
      const entries = await fs.readdir(dir);
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
          await findSnippetConfigs(fullPath);
        } else if (entry.endsWith(".json")) {
          // Process snippet config
          const meta = await fs.readJSON(fullPath);
          const registryItem = { ...meta, files: [] };

          // Construct relative path for source resolution
          // The JSON file is at fullPath. The sources in it are relative to this JSON file.
          const configDir = path.dirname(fullPath);

          for (const f of meta.files) {
            const sourcePath = path.join(configDir, f.source || f.name);

            try {
              const content = await fs.readFile(sourcePath, "utf-8");

              registryItem.files.push({
                name: f.name,
                content: content,
              });

              // Copy to public/snippets preserving structure if needed
              // For now, let's flat map to framework/name ?? Or should we preserve version path?
              // The user requirement said "maintain version directory for each framework".
              // Let's stick to framework/name for the registry output path for now as per previous logic,
              // BUT we might get collisions if we have v4/cors and v5/cors.
              // Ideally the registry item 'name' should be unique like "express-v5-cors".
              // Let's assume the JSON 'name' field handles uniqueness.

              const targetPath = path.join(
                SNIPPETS_PUBLIC_DIR,
                framework,
                f.name
              );
              await fs.ensureDir(path.dirname(targetPath));
              await fs.writeFile(targetPath, content);
            } catch (err) {
              console.error(
                `Error reading source file for ${meta.name}: ${sourcePath}`,
                err
              );
            }
          }
          registry.push(registryItem);
        }
      }
    }

    await findSnippetConfigs(frameworkPath);
  }

  await fs.writeJSON(REGISTRY_FILE, registry, { spaces: 2 });
  console.log(`Registry built with ${registry.length} items.`);
}

main().catch(console.error);
