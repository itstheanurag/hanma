import { Command } from "commander";
import { getConfig, HanmaConfig } from "../utils/config";
import { initHanmaConfig } from "../utils/init-config";
import { fetchFrameworks, fetchRegistry } from "../utils/registry";
import { batchInstallDependencies } from "../utils/install";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { RegistryItem } from "../schema";

// ============================================================================
// User Prompts
// ============================================================================

/**
 * Prompt for framework selection
 */
async function promptFramework(
  frameworks: string[],
  preselected?: string,
): Promise<string | null> {
  if (preselected && frameworks.includes(preselected)) {
    return preselected;
  }

  const { framework } = await prompts({
    type: "autocomplete",
    name: "framework",
    message: "Select a framework",
    choices: frameworks.map((f) => ({ title: f, value: f })),
  });

  return framework || null;
}

/**
 * Prompt for version selection or default to latest
 */
async function promptVersion(
  registry: RegistryItem[],
  preselected?: string,
): Promise<string> {
  const versions = Array.from(
    new Set(
      registry.map((item) => item.version).filter((v): v is string => !!v),
    ),
  );

  if (preselected && versions.includes(preselected)) {
    return preselected;
  }

  if (versions.length > 1) {
    const { version } = await prompts({
      type: "select",
      name: "version",
      message: "Select a version",
      choices: versions.map((v) => ({ title: v, value: v })),
    });
    if (!version) {
      return "";
    }
    return version;
  }

  if (versions.length === 1) {
    return versions[0]!;
  }

  return "latest";
}

/**
 * Filter registry items by version (snippets only)
 */
function filterSnippets(
  registry: RegistryItem[],
  version: string,
): RegistryItem[] {
  return registry.filter((item) => {
    const versionMatch =
      !version || version === "latest" || item.version === version;
    const isSnippet = item.type === "snippet";
    return versionMatch && isSnippet;
  });
}

/**
 * Filter snippets by category
 */
function filterByCategory(
  items: RegistryItem[],
  category: string,
): RegistryItem[] {
  return items.filter(
    (item) => (item.category || "uncategorized") === category,
  );
}

/**
 * Get unique categories from items
 */
function getCategories(items: RegistryItem[]): string[] {
  return Array.from(
    new Set(items.map((item) => item.category || "uncategorized")),
  ).sort();
}

/**
 * Prompt for category selection and filter items
 */
async function promptCategory(
  items: RegistryItem[],
): Promise<RegistryItem[] | null> {
  const categories = getCategories(items);

  if (categories.length <= 1) {
    return items;
  }

  const { category } = await prompts({
    type: "select",
    name: "category",
    message: "Select a category",
    choices: [
      { title: "All categories", value: "all" },
      ...categories.map((c) => ({ title: c, value: c })),
    ],
  });

  if (!category) {
    return null;
  }

  if (category === "all") {
    return items;
  }

  return filterByCategory(items, category);
}

/**
 * Prompt for multi-snippet selection from filtered list
 */
async function promptSnippets(items: RegistryItem[]): Promise<RegistryItem[]> {
  const { snippets } = await prompts({
    type: "multiselect",
    name: "snippets",
    message: "Select snippets to add (space to select, enter to confirm)",
    choices: items.map((item) => ({
      title: item.name,
      value: item,
      description: item.description,
    })),
    hint: "- Space to select. Return to submit",
  });

  return snippets || [];
}

/**
 * Find snippets by name from the registry
 */
function findSnippetsByName(
  names: string[],
  snippets: RegistryItem[],
): { found: RegistryItem[]; notFound: string[] } {
  const found: RegistryItem[] = [];
  const notFound: string[] = [];

  for (const name of names) {
    const snippet = snippets.find(
      (s) => s.name.toLowerCase() === name.toLowerCase(),
    );
    if (snippet) {
      found.push(snippet);
    } else {
      notFound.push(name);
    }
  }

  return { found, notFound };
}

// ============================================================================
// Installation
// ============================================================================

/**
 * Install multiple snippets with batched dependencies
 */
async function installSnippets(
  items: RegistryItem[],
  destinationPath: string | undefined,
  config: HanmaConfig,
): Promise<void> {
  console.log(chalk.blue(`\nInstalling ${items.length} snippet(s)...`));

  // Collect all dependencies
  const allDeps: string[] = [];
  const allDevDeps: string[] = [];

  for (const item of items) {
    if (item.dependencies?.length) {
      allDeps.push(...item.dependencies);
    }
    if (item.devDependencies?.length) {
      allDevDeps.push(...item.devDependencies);
    }
  }

  // Batch install dependencies
  if (allDeps.length > 0 || allDevDeps.length > 0) {
    const installSpinner = ora(
      `Installing dependencies: ${[...new Set([...allDeps, ...allDevDeps])].join(", ")}...`,
    ).start();
    await batchInstallDependencies(allDeps, allDevDeps);
    installSpinner.succeed("Dependencies installed");
  }

  // Write files
  const targetDir = destinationPath || config.componentsPath;
  const writeSpinner = ora("Writing files...").start();

  for (const item of items) {
    for (const file of item.files) {
      const targetPath = path.join(process.cwd(), targetDir, file.name);
      await fs.ensureDir(path.dirname(targetPath));
      await fs.writeFile(targetPath, file.content);
    }
  }

  writeSpinner.succeed(`Files written to ${targetDir}`);

  const snippetNames = items.map((i) => i.name).join(", ");
  console.log(
    chalk.green(
      `\n✓ Successfully added ${items.length} snippet(s): ${snippetNames}`,
    ),
  );
}

// ============================================================================
// Main Command
// ============================================================================

export const add = new Command()
  .name("add")
  .description("Add snippet(s) to your project")
  .argument(
    "[snippets...]",
    "Snippet name(s) to add (optional, use interactive mode if omitted)",
  )
  .option("-a, --all", "Add all snippets (use with --category to filter)")
  .option("-c, --category <category>", "Filter by category (use with --all)")
  .option("-f, --framework <framework>", "Framework to use")
  .option("-v, --version <version>", "Version to use")
  .option(
    "-p, --path <path>",
    "Destination path (defaults to config.componentsPath)",
  )
  .action(async (snippetNames: string[], options) => {

    let config = await getConfig();
    if (!config) {
      config = await initHanmaConfig();
      if (!config) {
        console.log(chalk.red("Initialization required to add snippets."));
        process.exit(1);
      }
    }

    // 2. Fetch and select framework
    const frameworksSpinner = ora("Fetching frameworks...").start();
    let frameworks: string[] = [];
    try {
      frameworks = await fetchFrameworks();
      frameworksSpinner.succeed("Frameworks fetched");
    } catch (error) {
      frameworksSpinner.fail("Failed to fetch frameworks");
      console.error(error);
      process.exit(1);
    }

    const selectedFramework = await promptFramework(
      frameworks,
      options.framework,
    );
    if (!selectedFramework) {
      console.log("Operation cancelled.");
      process.exit(0);
    }

    // 3. Fetch registry
    const registrySpinner = ora(
      `Fetching registry for ${selectedFramework}...`,
    ).start();
    let registry: RegistryItem[] = [];
    try {
      registry = await fetchRegistry(selectedFramework);
      registrySpinner.succeed("Registry fetched");
    } catch (error) {
      registrySpinner.fail("Failed to fetch registry");
      console.error(error);
      process.exit(1);
    }

    // 4. Select version
    const selectedVersion = await promptVersion(registry, options.version);
    if (selectedVersion === "") {
      console.log("Operation cancelled.");
      process.exit(0);
    }

    // 5. Filter snippets only
    const snippets = filterSnippets(registry, selectedVersion);

    if (snippets.length === 0) {
      console.log(
        chalk.yellow(
          "No snippets found for the selected framework and version.",
        ),
      );
      process.exit(0);
    }

    let selectedSnippets: RegistryItem[] = [];

    // 6. Handle different modes
    if (options.all) {
      // --all mode: add all snippets, optionally filtered by category
      if (options.category) {
        selectedSnippets = filterByCategory(snippets, options.category);
        if (selectedSnippets.length === 0) {
          console.log(
            chalk.yellow(`No snippets found in category: ${options.category}`),
          );
          console.log(
            chalk.dim(
              `Available categories: ${getCategories(snippets).join(", ")}`,
            ),
          );
          process.exit(0);
        }
        console.log(
          chalk.blue(
            `Found ${selectedSnippets.length} snippet(s) in category: ${options.category}`,
          ),
        );
      } else {
        selectedSnippets = snippets;
        console.log(chalk.blue(`Adding all ${snippets.length} snippets...`));
      }
    } else if (snippetNames.length > 0) {
      // Variadic mode: add specific snippets by name
      const { found, notFound } = findSnippetsByName(snippetNames, snippets);

      if (notFound.length > 0) {
        console.log(chalk.yellow(`Snippets not found: ${notFound.join(", ")}`));
      }

      if (found.length === 0) {
        console.log(chalk.red("No valid snippets to install."));
        process.exit(1);
      }

      console.log(
        chalk.blue(
          `Found ${found.length} snippet(s): ${found.map((s) => s.name).join(", ")}`,
        ),
      );
      selectedSnippets = found;
    } else {
      // Interactive mode: multi-select
      const categoryFiltered = await promptCategory(snippets);
      if (!categoryFiltered) {
        console.log("Operation cancelled.");
        process.exit(0);
      }

      selectedSnippets = await promptSnippets(categoryFiltered);
      if (selectedSnippets.length === 0) {
        console.log("No snippets selected.");
        process.exit(0);
      }
    }

    // 7. Install snippets
    await installSnippets(selectedSnippets, options.path, config);
  });
