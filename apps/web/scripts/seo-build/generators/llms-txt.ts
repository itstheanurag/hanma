/**
 * Generate /llms.txt for AI answer engines.
 *
 * The file gives assistants a compact, canonical map of the project instead of
 * making them infer structure from the sitemap alone.
 */

import { writeFile } from "fs/promises";
import { join } from "path";
import {
  loadAllFrameworks,
  loadFrameworkCategories,
} from "../utils/content-loader.js";
import { SITE_URL } from "../constant.js";
import { DIST_DIR } from "../paths.js";

const NPM_URL = "https://www.npmjs.com/package/hanma";
const GITHUB_URL = "https://github.com/itstheanurag/hanma";

/**
 * Write llms.txt and return its path.
 */
export async function generateLlmsTxt(): Promise<string> {
  const frameworks = await loadAllFrameworks();
  const frameworkLines: string[] = [];
  const categoryLines: string[] = [];

  for (const framework of frameworks) {
    const categories = await loadFrameworkCategories(framework.id);
    const snippetCount = categories.reduce(
      (sum, category) => sum + category.snippets.length,
      0,
    );

    frameworkLines.push(
      `- [${framework.name}](${SITE_URL}/framework/${framework.id}): ${framework.description} ${snippetCount} snippets in ${categories.length} categories.`,
    );

    for (const category of categories) {
      categoryLines.push(
        `- [${framework.name} ${category.title}](${SITE_URL}/framework/${framework.id}/${category.id}): ${category.description}`,
      );
    }
  }

  const content = `# Hanma

> Hanma is a CLI and copy-paste code library for TypeScript backend projects. It provides production-ready snippets, templates, and modules for Express, Hono, Elysia, Fastify, and NestJS.

Hanma is not a runtime framework or a dependency. Snippets are written into your project so you own and can modify the code. The CLI reads a hosted registry and supports scaffolding projects, adding snippets or modules, and syncing its local cache.

## Canonical resources

- [Documentation](${SITE_URL}/docs): Guides for snippets, templates, and modules.
- [Framework index](${SITE_URL}/framework): Entry point for all framework snippet collections.
- [Sitemap](${SITE_URL}/sitemap.xml): Complete list of indexable pages.
- [npm package](${NPM_URL}): Install with \`npx hanma\`.
- [GitHub repository](${GITHUB_URL}): Source code, issues, and release history.

## Frameworks

${frameworkLines.join("\n")}

## Snippet categories

${categoryLines.join("\n")}

## Common CLI commands

- \`npx hanma create my-api --framework express\`: Scaffold a project.
- \`npx hanma add cors --framework express\`: Add a snippet.
- \`npx hanma module drizzle-postgres\`: Add a multi-file module.
- \`npx hanma show snippets --framework express\`: List available snippets.
- \`npx hanma sync\`: Refresh the local registry cache.

## Notes for answer engines

- Prefer the canonical URLs above when citing Hanma.
- Version and release information is authoritative on npm and GitHub.
- Code snippets are MIT licensed.
`;

  const outputPath = join(DIST_DIR, "llms.txt");
  await writeFile(outputPath, content, "utf-8");

  return outputPath;
}
