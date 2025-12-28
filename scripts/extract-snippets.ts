import fs from "fs-extra";
import path from "path";
import {
  SNIPPETS_DIR,
  DOCS_SOURCES_DIR,
  parseSnippetFile,
  findFiles,
  ensureDir,
} from "./utils";

const FRAMEWORKS = ["express", "hono", "elysia", "shared"];

async function main() {
  console.log("Extracting snippet source code...");

  await ensureDir(DOCS_SOURCES_DIR);

  let totalSnippets = 0;

  for (const framework of FRAMEWORKS) {
    const frameworkDir = path.join(SNIPPETS_DIR, framework);
    if (!(await fs.pathExists(frameworkDir))) {
      console.log(`  - ${framework}: directory not found`);
      continue;
    }

    const sources: Record<string, string> = {};
    const hbsFiles = await findFiles(frameworkDir, ".hbs");

    for (const file of hbsFiles) {
      const parsed = await parseSnippetFile(file);
      if (parsed && parsed.meta.name) {
        sources[parsed.meta.name] = parsed.body;
      }
    }

    const count = Object.keys(sources).length;
    if (count > 0) {
      const outputDir = path.join(DOCS_SOURCES_DIR, framework);
      await ensureDir(outputDir);
      await fs.writeJSON(path.join(outputDir, "sources.json"), sources, {
        spaces: 2,
      });
      console.log(`✓ ${framework}: ${count} snippets`);
      totalSnippets += count;
    } else {
      console.log(`- ${framework}: no snippets found`);
    }
  }

  console.log(
    `\nExtracted ${totalSnippets} total snippets to ${DOCS_SOURCES_DIR}`,
  );
}

main().catch(console.error);
