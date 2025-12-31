import fs from "fs-extra";
import path from "path";
import {
  SNIPPETS_DIR,
  SHARED_DIR,
  TOOLING_DIR,
  DOCS_SOURCES_DIR,
  parseSnippetFile,
  findFiles,
  ensureDir,
} from "./utils";

// Framework snippets only - shared and tooling handled separately
const FRAMEWORKS = ["express", "hono", "elysia", "fastify"];

/**
 * Extract sources from a directory
 */
async function extractSources(
  sourceDir: string,
  outputName: string,
): Promise<number> {
  if (!(await fs.pathExists(sourceDir))) {
    console.log(`  - ${outputName}: directory not found`);
    return 0;
  }

  const sources: Record<string, string> = {};
  const hbsFiles = await findFiles(sourceDir, ".hbs");

  for (const file of hbsFiles) {
    const parsed = await parseSnippetFile(file);
    if (parsed && parsed.meta.name) {
      sources[parsed.meta.name] = parsed.body;
    }
  }

  const count = Object.keys(sources).length;
  if (count > 0) {
    const outputDir = path.join(DOCS_SOURCES_DIR, outputName);
    await ensureDir(outputDir);
    await fs.writeJSON(path.join(outputDir, "sources.json"), sources, {
      spaces: 2,
    });
    console.log(`  ✓ ${outputName}: ${count} items`);
  } else {
    console.log(`  - ${outputName}: no items found`);
  }

  return count;
}

async function main() {
  console.log("Extracting snippet source code...\n");

  await ensureDir(DOCS_SOURCES_DIR);

  let totalItems = 0;

  // ============================================================================
  // Extract Framework Snippets
  // ============================================================================
  console.log("📦 Framework snippets:");

  for (const framework of FRAMEWORKS) {
    const frameworkDir = path.join(SNIPPETS_DIR, framework);
    totalItems += await extractSources(frameworkDir, framework);
  }

  // ============================================================================
  // Extract Addons (shared)
  // ============================================================================
  console.log("\n🔧 Addons (shared):");
  totalItems += await extractSources(SHARED_DIR, "shared");

  // ============================================================================
  // Extract Tooling
  // ============================================================================
  console.log("\n⚙️  Tooling:");
  totalItems += await extractSources(TOOLING_DIR, "tooling");

  console.log(
    `\n✅ Extracted ${totalItems} total items to ${DOCS_SOURCES_DIR}`,
  );
}

main().catch(console.error);
