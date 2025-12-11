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

    const files = await fs.readdir(frameworkPath);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const metaPath = path.join(frameworkPath, file);
        const meta = await fs.readJSON(metaPath);

        // Enhance meta with raw content and copy files
        const registryItem = { ...meta, files: [] };

        for (const f of meta.files) {
          const sourcePath = path.join(frameworkPath, f.source || f.name);
          const content = await fs.readFile(sourcePath, "utf-8");

          registryItem.files.push({
            name: f.name,
            content: content,
          });

          // Copy to public/snippets for static hosting if needed (optional, since we embed content in registry for now)
          const targetPath = path.join(SNIPPETS_PUBLIC_DIR, framework, f.name);
          await fs.ensureDir(path.dirname(targetPath));
          await fs.writeFile(targetPath, content);
        }

        // Add framework prefix to name if not present? Or just use name from json
        // Currently assuming name in json is unique e.g. "express-cors"

        registry.push(registryItem);
      }
    }
  }

  await fs.writeJSON(REGISTRY_FILE, registry, { spaces: 2 });
  console.log(`Registry built with ${registry.length} items.`);
}

main().catch(console.error);
