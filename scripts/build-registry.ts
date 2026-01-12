import fs from "fs-extra";
import path from "path";
import {
  SNIPPETS_DIR,
  SHARED_DIR,
  TOOLING_DIR,
  DOCS_REGISTRY_DIR,
  ensureDir,
  parseSnippetFile,
  findFiles,
} from "./utils";

/**
 * Process a directory of .hbs files and return registry items
 */
async function processDirectory(
  dirPath: string,
  basePath: string,
  type: "snippet" | "addon" | "tooling",
): Promise<any[]> {
  const registry: any[] = [];
  const hbsFiles = await findFiles(dirPath, ".hbs");

  for (const hbsFile of hbsFiles) {
    const parsed = await parseSnippetFile(hbsFile);
    if (!parsed) continue;

    const { meta, body: bodyContent } = parsed;

    // Get relative path for category inference
    const relativePath = path.relative(basePath, hbsFile);
    const parts = relativePath.split(path.sep);

    // For framework snippets: parts[0] is version, parts[1+] are category
    // For addons/tooling: parts[0] is category (no version)
    let version = "v1";
    let category: string | undefined;

    if (type === "snippet") {
      version = parts.length > 1 ? parts[0] : "v1";
      const categoryParts = parts.slice(1, -1);
      category = categoryParts.length > 0 ? categoryParts.join("/") : undefined;
    } else {
      // For addons and tooling - first part is category
      category = parts.length > 1 ? parts[0] : undefined;
    }

    // Inject inferred metadata if missing
    if (!meta.version) meta.version = version;
    if (!meta.category && category) meta.category = category;
    if (!meta.type) meta.type = type;

    const registryItem: any = {
      ...meta,
      files: [] as Array<{ name: string; path: string; content: string }>,
    };
    const configDir = path.dirname(hbsFile);

    if (meta.files && Array.isArray(meta.files)) {
      for (const f of meta.files) {
        let fileContent = "";

        if (f.source) {
          const sourcePath = path.join(configDir, f.source);
          const sourceParsed = await parseSnippetFile(sourcePath);
          fileContent = sourceParsed ? sourceParsed.body : "";
        } else {
          fileContent = bodyContent;
        }

        registryItem.files.push({
          name: f.name,
          path: f.path || f.name,
          content: fileContent,
        });
      }
    }

    // Cleanup empty dependencies to keep JSON clean
    if (registryItem.dependencies === null) delete registryItem.dependencies;
    if (registryItem.devDependencies === null)
      delete registryItem.devDependencies;

    registry.push(registryItem);
  }

  return registry;
}

async function main() {
  console.log("Building registry...");

  await ensureDir(DOCS_REGISTRY_DIR);

  const frameworks: string[] = [];

  // ============================================================================
  // Process Framework Snippets
  // ============================================================================
  console.log("\n Processing framework snippets...");

  const frameworkDirs = await fs.readdir(SNIPPETS_DIR);

  for (const frameworkName of frameworkDirs) {
    const frameworkPath = path.join(SNIPPETS_DIR, frameworkName);
    if (!(await fs.stat(frameworkPath)).isDirectory()) continue;

    frameworks.push(frameworkName);
    console.log(`  → ${frameworkName}`);

    const frameworkRegistry = await processDirectory(
      frameworkPath,
      frameworkPath,
      "snippet",
    );

    // Add framework to each item
    frameworkRegistry.forEach((item) => {
      if (!item.framework) item.framework = frameworkName;
    });

    await fs.writeJSON(
      path.join(DOCS_REGISTRY_DIR, `${frameworkName}.json`),
      frameworkRegistry,
      { spaces: 2 },
    );

    console.log(` ✓ ${frameworkRegistry.length} snippets`);
  }

  // ============================================================================
  // Process Addons (shared cross-framework snippets)
  // ============================================================================
  console.log("\n Processing addons (shared)...");

  if (await fs.pathExists(SHARED_DIR)) {
    const addonsRegistry = await processDirectory(
      SHARED_DIR,
      SHARED_DIR,
      "addon",
    );

    // Mark all as shared/addon type
    addonsRegistry.forEach((item) => {
      item.framework = "shared";
      item.type = "addon";
    });

    await fs.writeJSON(
      path.join(DOCS_REGISTRY_DIR, "shared.json"),
      addonsRegistry,
      { spaces: 2 },
    );

    console.log(`✓ ${addonsRegistry.length} addons`);
  } else {
    console.log("- No shared directory found");
  }

  // ============================================================================
  // Process Tooling Configs
  // ============================================================================
  console.log("\n Processing tooling...");

  if (await fs.pathExists(TOOLING_DIR)) {
    const toolingRegistry = await processDirectory(
      TOOLING_DIR,
      TOOLING_DIR,
      "tooling",
    );

    // Mark all as tooling type
    toolingRegistry.forEach((item) => {
      item.type = "tooling";
    });

    await fs.writeJSON(
      path.join(DOCS_REGISTRY_DIR, "tooling.json"),
      toolingRegistry,
      { spaces: 2 },
    );

    console.log(`✓ ${toolingRegistry.length} tooling configs`);
  } else {
    console.log("- No tooling directory found");
  }

  // ============================================================================
  // Write index.json (frameworks only - addons and tooling are separate)
  // ============================================================================
  await fs.writeJSON(path.join(DOCS_REGISTRY_DIR, "index.json"), frameworks, {
    spaces: 2,
  });

  console.log(`\nRegistry built successfully!`);
  console.log(`Frameworks: ${frameworks.join(", ")}`);
  console.log(`Additional: shared (addons), tooling`);
}

main().catch(console.error);
