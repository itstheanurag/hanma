import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getConfig, initHanmaConfig, fetchToolingRegistry } from "../utils";
import {
  findItemsByName,
  installRegistryItems,
  promptMultiSelectRegistry,
} from "../helpers";
import { RegistryItem } from "../types";

// ============================================================================
// Main Command
// ============================================================================

export const tooling = new Command()
  .name("tooling")
  .description("Add development tooling configuration to your project")
  .argument(
    "[configs...]",
    "Tooling config name(s) to add (optional, use interactive mode if omitted)",
  )
  .option("-a, --all", "Add all tooling configs")
  .option(
    "-c, --category <category>",
    "Filter by category (biome, eslint, prettier, tsconfig)",
  )
  .option(
    "-p, --path <path>",
    "Destination path (defaults to project root)",
    ".",
  )
  .action(async (configNames: string[], options) => {
    let config = await getConfig();
    if (!config) {
      config = await initHanmaConfig();
      if (!config) {
        console.log(chalk.red("Initialization required to add tooling."));
        process.exit(1);
      }
    }

    // Fetch tooling registry
    const registrySpinner = ora("Fetching tooling configurations...").start();
    let registry: RegistryItem[] = [];
    try {
      registry = await fetchToolingRegistry();
      registrySpinner.succeed("Tooling configurations fetched");
    } catch (error) {
      registrySpinner.fail("Failed to fetch tooling registry");
      console.error(error);
      process.exit(1);
    }

    if (registry.length === 0) {
      console.log(chalk.yellow("No tooling configurations available."));
      process.exit(0);
    }

    let selectedConfigs: RegistryItem[] = [];

    // Handle different modes
    if (options.all) {
      if (options.category) {
        selectedConfigs = registry.filter(
          (item) => item.category === options.category,
        );
        if (selectedConfigs.length === 0) {
          console.log(
            chalk.yellow(
              `No tooling configs found in category: ${options.category}`,
            ),
          );
          process.exit(0);
        }
      } else {
        selectedConfigs = registry;
      }
    } else if (configNames.length > 0) {
      const { found, notFound } = findItemsByName(configNames, registry);
      if (notFound.length > 0) {
        console.log(
          chalk.yellow(`Tooling configs not found: ${notFound.join(", ")}`),
        );
      }
      if (found.length === 0) {
        console.log(chalk.red("No valid tooling configs to install."));
        console.log(chalk.dim("Available configs:"));
        registry.forEach((item) => console.log(chalk.dim(`  • ${item.name}`)));
        process.exit(1);
      }
      selectedConfigs = found;
    } else {
      // Interactive mode
      let filteredRegistry = registry;
      if (options.category) {
        filteredRegistry = registry.filter(
          (item) => item.category === options.category,
        );
      }

      selectedConfigs = await promptMultiSelectRegistry(
        filteredRegistry,
        "Select tooling configs to add (space to select, enter to confirm)",
      );
      if (selectedConfigs.length === 0) {
        console.log("No tooling configs selected.");
        process.exit(0);
      }
    }

    // Install tooling configs
    await installRegistryItems(selectedConfigs, options.path, "tooling");
  });
