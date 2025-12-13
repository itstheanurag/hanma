import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SNIPPETS_DIR = path.resolve(__dirname, "../packages/snippets");
const PUBLIC_DIR = path.resolve(__dirname, "../apps/web/public");

async function main() {
  console.log("Building registry...");

  const REGISTRY_DIR = path.join(PUBLIC_DIR, "registry");
  await fs.ensureDir(REGISTRY_DIR);

  const frameworks: string[] = [];

  // Find all framework folders
  const frameworkDirs = await fs.readdir(SNIPPETS_DIR);

  for (const frameworkName of frameworkDirs) {
    const frameworkPath = path.join(SNIPPETS_DIR, frameworkName);
    if (!(await fs.stat(frameworkPath)).isDirectory()) continue;

    frameworks.push(frameworkName);
    const frameworkRegistry: any[] = [];
    console.log(`Processing framework: ${frameworkName}`);

    // Recursive function to find snippet files
    // Use a queue or just simple recursion.
    // We want to capture 'version' which is likely the immediate subdirectory of frameworkDir.
    // e.g. express/v5/libs/server.hbs -> version=v5

    async function findSnippetConfigs(dir: string) {
      const entries = await fs.readdir(dir);
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
          await findSnippetConfigs(fullPath);
        } else if (entry.endsWith(".hbs")) {
          // Identify version and category from path
          // Path relative to snippets dir: express/v5/libs/server.hbs
          const relativePath = path.relative(SNIPPETS_DIR, fullPath);
          const parts = relativePath.split(path.sep);
          // parts[0] is framework, parts[1] is version, parts[2+] are category/subcategory
          const version = parts.length > 1 ? parts[1] : "unknown";

          // Infer category from directory structure (everything after version)
          const categoryParts = parts.slice(2, -1); // Exclude filename
          const category =
            categoryParts.length > 0 ? categoryParts.join("/") : undefined;

          const content = await fs.readFile(fullPath, "utf-8");
          const frontmatterMatch = content.match(
            /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
          );

          if (!frontmatterMatch) {
            continue;
          }

          const metadataRaw = frontmatterMatch[1];
          const bodyContent = frontmatterMatch[2];

          let meta: any;
          try {
            meta = yaml.load(metadataRaw);
          } catch (e) {
            console.error(`Error parsing frontmatter in ${fullPath}`, e);
            continue;
          }

          if (!meta || !meta.name) {
            continue;
          }

          // Injected inferred metadata if missing
          if (!meta.version) meta.version = version;
          if (!meta.framework) meta.framework = frameworkName;
          if (!meta.category && category) meta.category = category;

          // Infer type based on number of files
          // If files array has multiple entries OR if there's a source reference to multiple files, it's a module
          const isModule =
            meta.files && Array.isArray(meta.files) && meta.files.length > 1;
          if (!meta.type) meta.type = isModule ? "module" : "snippet";

          const registryItem = { ...meta, files: [] };
          const configDir = path.dirname(fullPath);

          if (meta.files && Array.isArray(meta.files)) {
            for (const f of meta.files) {
              let fileContent = "";

              if (f.source) {
                const sourcePath = path.join(configDir, f.source);
                try {
                  let rawSource = await fs.readFile(sourcePath, "utf-8");
                  const sourceMatch = rawSource.match(
                    /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
                  );
                  if (sourceMatch) {
                    fileContent = sourceMatch[2];
                  } else {
                    fileContent = rawSource;
                  }
                } catch (err) {
                  console.error(
                    `Error reading source ${f.source} for ${meta.name}`,
                    err
                  );
                  // Skip file or continue? Continue with empty content might break things.
                  continue;
                }
              } else {
                fileContent = bodyContent;
              }

              registryItem.files.push({
                name: f.name,
                path: f.path || f.name, // Use explicit path or default to name
                content: fileContent,
              });
            }
          }

          frameworkRegistry.push(registryItem);
        }
      }
    }

    await findSnippetConfigs(frameworkPath);

    // Write framework registry
    await fs.writeJSON(
      path.join(REGISTRY_DIR, `${frameworkName}.json`),
      frameworkRegistry,
      { spaces: 2 }
    );
  }

  // Write index.json
  await fs.writeJSON(path.join(REGISTRY_DIR, "index.json"), frameworks, {
    spaces: 2,
  });

  console.log(`Registry built. Frameworks: ${frameworks.join(", ")}`);
}

main().catch(console.error);
