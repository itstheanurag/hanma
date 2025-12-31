import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { RegistryItem } from "../types";
import { fetchFrameworks, fetchRegistry, getConfig } from "../utils";
import {
  findItemsByName,
  installRegistryItems,
  promptMultiSelectRegistry,
  promptCategoryFilter,
  promptFramework,
  promptVersion,
} from "../helpers";

/**
 * Filter registry items by version (modules only)
 */
function filterModules(
  registry: RegistryItem[],
  version: string,
): RegistryItem[] {
  return registry.filter((item) => {
    const versionMatch =
      !version || version === "latest" || item.version === version;
    const isModule = item.type === "module";
    return versionMatch && isModule;
  });
}

export const module = new Command()
  .name("module")
  .alias("mod")
  .description("Add multi-file module(s) to your project")
  .argument(
    "[modules...]",
    "Module name(s) to add (optional, use interactive mode if omitted)",
  )
  .option("-f, --framework <framework>", "Framework to use")
  .option("-v, --version <version>", "Version to use")
  .option(
    "-p, --path <path>",
    "Destination path (defaults to config.componentsPath)",
  )
  .action(async (moduleNames: string[], options) => {
    // 1. Get config
    const config = await getConfig();
    if (!config) {
      console.log(
        chalk.red("Configuration not found. Please run 'hanma init' first."),
      );
      process.exit(1);
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

    // 5. Filter modules only
    const modules = filterModules(registry, selectedVersion);

    if (modules.length === 0) {
      console.log(
        chalk.yellow(
          "No modules found for the selected framework and version.",
        ),
      );
      process.exit(0);
    }

    let selectedModules: RegistryItem[] = [];

    // 6. Handle different modes
    if (moduleNames.length > 0) {
      const { found, notFound } = findItemsByName(moduleNames, modules);
      if (notFound.length > 0) {
        console.log(chalk.yellow(`Modules not found: ${notFound.join(", ")}`));
      }
      if (found.length === 0) {
        console.log(chalk.red("No valid modules to install."));
        process.exit(1);
      }
      selectedModules = found;
    } else {
      const categoryFiltered = await promptCategoryFilter(modules);
      if (!categoryFiltered) {
        console.log("Operation cancelled.");
        process.exit(0);
      }
      selectedModules = await promptMultiSelectRegistry(
        categoryFiltered,
        "Select modules to add (space to select, enter to confirm)",
      );
      if (selectedModules.length === 0) {
        console.log("No modules selected.");
        process.exit(0);
      }
    }

    // 7. Install modules
    await installRegistryItems(
      selectedModules,
      options.path || config.componentsPath,
      "module",
    );
  });
