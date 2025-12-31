import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getConfig, initHanmaConfig, fetchAddonsRegistry } from "../utils";
import {
  findItemsByName,
  installRegistryItems,
  promptMultiSelectRegistry,
  promptCategoryFilter,
} from "../helpers";
import { RegistryItem } from "../types";

// ============================================================================
// Main Command
// ============================================================================

export const addons = new Command()
  .name("addons")
  .description("Add cross-framework addon snippets to your project")
  .argument(
    "[snippets...]",
    "Addon name(s) to add (optional, use interactive mode if omitted)",
  )
  .option("-a, --all", "Add all addons")
  .option(
    "-c, --category <category>",
    "Filter by category (db, libs, mailers, etc.)",
  )
  .option(
    "-p, --path <path>",
    "Destination path (defaults to config.componentsPath)",
  )
  .action(async (addonNames: string[], options) => {
    let config = await getConfig();
    if (!config) {
      config = await initHanmaConfig();
      if (!config) {
        console.log(chalk.red("Initialization required to add addons."));
        process.exit(1);
      }
    }

    // Fetch addons registry
    const registrySpinner = ora("Fetching addons...").start();
    let registry: RegistryItem[] = [];
    try {
      registry = await fetchAddonsRegistry();
      registrySpinner.succeed("Addons fetched");
    } catch (error) {
      registrySpinner.fail("Failed to fetch addons registry");
      console.error(error);
      process.exit(1);
    }

    if (registry.length === 0) {
      console.log(chalk.yellow("No addons available."));
      process.exit(0);
    }

    let selectedAddons: RegistryItem[] = [];

    // Handle different modes
    if (options.all) {
      if (options.category) {
        selectedAddons = registry.filter(
          (item) => item.category === options.category,
        );
        if (selectedAddons.length === 0) {
          console.log(
            chalk.yellow(`No addons found in category: ${options.category}`),
          );
          process.exit(0);
        }
      } else {
        selectedAddons = registry;
      }
    } else if (addonNames.length > 0) {
      const { found, notFound } = findItemsByName(addonNames, registry);
      if (notFound.length > 0) {
        console.log(chalk.yellow(`Addons not found: ${notFound.join(", ")}`));
      }
      if (found.length === 0) {
        console.log(chalk.red("No valid addons to install."));
        console.log(chalk.dim("Available addons:"));
        registry.forEach((item) => console.log(chalk.dim(`  • ${item.name}`)));
        process.exit(1);
      }
      selectedAddons = found;
    } else {
      // Interactive mode with category filter
      const categoryFiltered = await promptCategoryFilter(registry);
      if (!categoryFiltered) {
        console.log("Operation cancelled.");
        process.exit(0);
      }

      selectedAddons = await promptMultiSelectRegistry(
        categoryFiltered,
        "Select addons to add (space to select, enter to confirm)",
      );
      if (selectedAddons.length === 0) {
        console.log("No addons selected.");
        process.exit(0);
      }
    }

    // Install addons
    await installRegistryItems(
      selectedAddons,
      options.path || config.componentsPath,
      "addon",
    );
  });
