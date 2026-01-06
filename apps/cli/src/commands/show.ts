import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { RegistryItem, ModulesRegistry, ModuleBlock } from "../types";

import {
  getConfig,
  fetchRegistry,
  fetchTemplatesRegistry,
  fetchToolingRegistry,
  fetchAddonsRegistry,
  fetchModulesRegistry,
  fetchFrameworkWithPrompt,
  displayNotFound,
} from "../utils";

import {
  displaySnippetDetails,
  displaySnippetsTable,
  displayTemplateDetails,
  displayTemplatesList,
  createShowSubcommand,
} from "../helpers";

const showSnippets = new Command()
  .name("snippets")
  .description("Show available snippets for a framework")
  .argument("[name]", "Snippet name to show details for")
  .option("-f, --framework <framework>", "Framework to use")
  .option("--json", "Output in JSON format")
  .action(async (snippetName: string | undefined, options) => {
    const config = await getConfig();

    // Use shared helper for framework selection
    const selectedFramework = await fetchFrameworkWithPrompt(
      options.framework || config?.framework,
    );
    if (!selectedFramework) {
      console.log("Operation cancelled.");
      process.exit(0);
    }

    // Fetch registry
    const registrySpinner = ora(
      `Fetching snippets for ${selectedFramework}...`,
    ).start();
    let registry: RegistryItem[] = [];
    try {
      registry = await fetchRegistry(selectedFramework);
      registrySpinner.succeed("Snippets fetched");
    } catch (error) {
      registrySpinner.fail("Failed to fetch snippets");
      console.error(error);
      process.exit(1);
    }

    // Filter to snippets only
    const snippets = registry.filter((item) => item.type === "snippet");

    if (snippets.length === 0) {
      console.log(
        chalk.yellow(`No snippets found for framework: ${selectedFramework}`),
      );
      process.exit(0);
    }

    // If specific snippet requested
    if (snippetName) {
      const snippet = snippets.find(
        (s) => s.name.toLowerCase() === snippetName.toLowerCase(),
      );

      if (!snippet) {
        displayNotFound("Snippet", snippetName, snippets);
        process.exit(1);
      }

      if (options.json) {
        console.log(JSON.stringify(snippet, null, 2));
      } else {
        displaySnippetDetails(snippet);
      }
    } else {
      // List all snippets
      if (options.json) {
        console.log(JSON.stringify(snippets, null, 2));
      } else {
        console.log(
          "\n",
          chalk.bold.hex("#ea580c")(
            `Snippets for ${selectedFramework.charAt(0).toUpperCase() + selectedFramework.slice(1)}`,
          ),
        );
        displaySnippetsTable(snippets);
      }
    }
  });

const showTemplates = new Command()
  .name("templates")
  .description("Show available templates for a framework")
  .argument("[name]", "Template name to show details for")
  .option("-f, --framework <framework>", "Framework to use")
  .option("--json", "Output in JSON format")
  .action(async (templateName: string | undefined, options) => {
    const config = await getConfig();

    // Use shared helper for framework selection
    const selectedFramework = await fetchFrameworkWithPrompt(
      options.framework || config?.framework,
    );
    if (!selectedFramework) {
      console.log("Operation cancelled.");
      process.exit(0);
    }

    // Fetch template registry
    const registrySpinner = ora(
      `Fetching templates for ${selectedFramework}...`,
    ).start();
    const registry = await fetchTemplatesRegistry(selectedFramework);

    if (!registry) {
      registrySpinner.fail(`No templates found for ${selectedFramework}`);
      process.exit(1);
    }
    registrySpinner.succeed("Templates fetched");

    // If specific template requested
    if (templateName) {
      // Search in all categories
      const allTemplates = [
        ...(registry.base || []),
        ...(registry.features || []),
        ...(registry.presets || []),
        ...(registry.extra || []),
      ];

      const template = allTemplates.find(
        (t) => t.name.toLowerCase() === templateName.toLowerCase(),
      );

      if (!template) {
        displayNotFound("Template", templateName, allTemplates);
        process.exit(1);
      }

      if (options.json) {
        console.log(JSON.stringify(template, null, 2));
      } else {
        displayTemplateDetails(template as any);
      }
    } else {
      // List all templates
      if (options.json) {
        console.log(JSON.stringify(registry, null, 2));
      } else {
        displayTemplatesList(registry, selectedFramework);
      }
    }
  });

const showTooling = createShowSubcommand({
  name: "tooling",
  description: "Show available tooling configurations",
  itemType: "Tooling config",
  fetchRegistry: fetchToolingRegistry,
  headerTitle: "Tooling Configurations",
});

const showAddons = createShowSubcommand({
  name: "addons",
  description: "Show available addons (cross-framework snippets)",
  itemType: "Addon",
  fetchRegistry: fetchAddonsRegistry,
  headerTitle: "Addons (Cross-Framework Snippets)",
});

const showModules = new Command()
  .name("modules")
  .description("Show available modules (auth, database, etc.)")
  .argument("[name]", "Module name to show details for")
  .option("-c, --category <category>", "Filter by category (auth, database)")
  .option("--json", "Output in JSON format")
  .action(async (moduleName: string | undefined, options) => {
    const registrySpinner = ora("Fetching modules...").start();
    let registry: ModulesRegistry | null;
    try {
      registry = await fetchModulesRegistry();
      if (!registry) throw new Error("Modules registry is empty");
      registrySpinner.succeed("Modules fetched");
    } catch (error) {
      registrySpinner.fail("Failed to fetch modules registry");
      console.error(error);
      process.exit(1);
    }

    // Flatten all modules or filter by category
    let allModules: ModuleBlock[] = [];
    const categoriesToShow = options.category
      ? [options.category]
      : registry.categories;

    for (const category of categoriesToShow) {
      if (registry.modules[category]) {
        allModules.push(...registry.modules[category]);
      }
    }

    if (allModules.length === 0) {
      console.log(chalk.yellow("No modules available."));
      process.exit(0);
    }

    if (moduleName) {
      const module = allModules.find(
        (m) => m.name.toLowerCase() === moduleName.toLowerCase(),
      );

      if (!module) {
        displayNotFound("Module", moduleName, allModules);
        process.exit(1);
      }

      if (options.json) {
        console.log(JSON.stringify(module, null, 2));
      } else {
        console.log(
          "\n",
          chalk.bold.hex("#ea580c")(module.name),
          "\n",
          chalk.dim(module.description),
          "\n",
          chalk.bold("Category:"),
          module.category,
          "\n",
        );
        if (module.framework) {
          console.log(chalk.bold("Framework:"), module.framework);
        }
        if (module.dependencies?.length) {
          console.log(
            chalk.bold("Dependencies:"),
            module.dependencies.join(", "),
          );
        }
        if (module.devDependencies?.length) {
          console.log(
            chalk.bold("Dev Dependencies:"),
            module.devDependencies.join(", "),
          );
        }
        if (module.envVars?.length) {
          console.log(chalk.bold("Env Variables:"), module.envVars.join(", "));
        }
        console.log(chalk.bold("Files:"), module.files.length);
        for (const file of module.files) {
          console.log(chalk.dim(`  • ${file.path}`));
        }
      }
    } else {
      // List all modules grouped by category
      if (options.json) {
        console.log(JSON.stringify(registry, null, 2));
      } else {
        console.log("\n", chalk.bold.hex("#ea580c")("Available Modules"), "\n");
        for (const category of categoriesToShow) {
          const modules = registry.modules[category] || [];
          if (modules.length === 0) continue;

          console.log(chalk.bold.underline(category.toUpperCase()));
          for (const mod of modules) {
            console.log(
              `  ${chalk.cyan(mod.name.padEnd(25))} ${chalk.dim(mod.description || "")}`,
            );
          }
          console.log();
        }
      }
    }
  });

// ============================================================================
// Main Command
// ============================================================================

export const show = new Command()
  .name("show")
  .description(
    "Show details about snippets, templates, modules, tooling, or addons",
  )
  .addCommand(showSnippets)
  .addCommand(showTemplates)
  .addCommand(showModules)
  .addCommand(showTooling)
  .addCommand(showAddons);
