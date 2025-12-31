import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import {
  getConfig,
  initHanmaConfig,
  fetchFrameworks,
  fetchRegistry,
  createConfig,
} from "../utils";

import {
  findItemsByName,
  installRegistryItems,
  promptMultiSelectRegistry,
  promptCategoryFilter,
  promptFramework,
  promptVersion,
} from "../helpers";

import { RegistryItem } from "../types";

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

    let selectedFramework = options.framework || config.framework;

    if (!selectedFramework) {
      // Fetch and select framework
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

      const selected = await promptFramework(frameworks);
      if (!selected) {
        console.log("Operation cancelled.");
        process.exit(0);
      }
      selectedFramework = selected;

      // Update config with the selected framework
      config.framework = selectedFramework;
      await createConfig(config);
    }

    // Fetch registry
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

    // Select version
    const selectedVersion = await promptVersion(registry, options.version);
    if (selectedVersion === "") {
      console.log("Operation cancelled.");
      process.exit(0);
    }

    // Filter snippets only
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

    // Handle different modes
    if (options.all) {
      if (options.category) {
        selectedSnippets = snippets.filter(
          (s) => (s.category || "uncategorized") === options.category,
        );
        if (selectedSnippets.length === 0) {
          console.log(
            chalk.yellow(`No snippets found in category: ${options.category}`),
          );
          process.exit(0);
        }
      } else {
        selectedSnippets = snippets;
      }
    } else if (snippetNames.length > 0) {
      const { found, notFound } = findItemsByName(snippetNames, snippets);
      if (notFound.length > 0) {
        console.log(
          chalk.yellow(
            `Snippets not found in framework '${selectedFramework}': ${notFound.join(", ")}`,
          ),
        );
      }
      if (found.length === 0) {
        console.log(
          chalk.red(
            `No valid snippets to install for framework '${selectedFramework}'.`,
          ),
        );
        process.exit(1);
      }
      selectedSnippets = found;
    } else {
      const categoryFiltered = await promptCategoryFilter(snippets);
      if (!categoryFiltered) {
        console.log("Operation cancelled.");
        process.exit(0);
      }
      selectedSnippets = await promptMultiSelectRegistry(
        categoryFiltered,
        "Select snippets to add (space to select, enter to confirm)",
      );
      if (selectedSnippets.length === 0) {
        console.log("No snippets selected.");
        process.exit(0);
      }
    }

    // Install snippets
    await installRegistryItems(
      selectedSnippets,
      options.path || config.componentsPath,
      "snippet",
    );
  });
