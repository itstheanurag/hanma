import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { RegistryItem } from "../types";
import {
  getConfig,
  fetchFrameworks,
  fetchRegistry,
  fetchTemplatesRegistry,
  fetchToolingRegistry,
  fetchAddonsRegistry,
} from "../utils";
import {
  displaySnippetDetails,
  displaySnippetsTable,
  displayTemplateDetails,
  displayTemplatesList,
  promptFramework,
} from "../helpers";


const showSnippets = new Command()
  .name("snippets")
  .description("Show available snippets for a framework")
  .argument("[name]", "Snippet name to show details for")
  .option("-f, --framework <framework>", "Framework to use")
  .option("--json", "Output in JSON format")
  .action(async (snippetName: string | undefined, options) => {
    const config = await getConfig();
    let selectedFramework = options.framework || config?.framework;

    // Prompt for framework if not provided
    if (!selectedFramework) {
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
        console.log(
          chalk.red(
            `Snippet '${snippetName}' not found for ${selectedFramework}`,
          ),
        );
        console.log(chalk.dim("Available snippets:"));
        snippets
          .slice(0, 10)
          .forEach((s) => console.log(chalk.dim(`  • ${s.name}`)));
        if (snippets.length > 10) {
          console.log(chalk.dim(`  ... and ${snippets.length - 10} more`));
        }
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
        console.log();
        console.log(
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
    let selectedFramework = options.framework || config?.framework;

    // Prompt for framework if not provided
    if (!selectedFramework) {
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
        ...(registry.database || []),
        ...(registry.auth || []),
        ...(registry.features || []),
        ...(registry.presets || []),
        ...(registry.extra || []),
      ];

      const template = allTemplates.find(
        (t) => t.name.toLowerCase() === templateName.toLowerCase(),
      );

      if (!template) {
        console.log(
          chalk.red(
            `Template '${templateName}' not found for ${selectedFramework}`,
          ),
        );
        console.log(chalk.dim("Available templates:"));
        allTemplates
          .slice(0, 10)
          .forEach((t) => console.log(chalk.dim(`  • ${t.name}`)));
        if (allTemplates.length > 10) {
          console.log(chalk.dim(`  ... and ${allTemplates.length - 10} more`));
        }
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

// ============================================================================
// Tooling Subcommand
// ============================================================================

const showTooling = new Command()
  .name("tooling")
  .description("Show available tooling configurations")
  .argument("[name]", "Tooling config name to show details for")
  .option("--json", "Output in JSON format")
  .action(async (toolingName: string | undefined, options) => {
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

    if (toolingName) {
      const tooling = registry.find(
        (t) => t.name.toLowerCase() === toolingName.toLowerCase(),
      );

      if (!tooling) {
        console.log(chalk.red(`Tooling config '${toolingName}' not found`));
        console.log(chalk.dim("Available configs:"));
        registry
          .slice(0, 10)
          .forEach((t) => console.log(chalk.dim(`  • ${t.name}`)));
        process.exit(1);
      }

      if (options.json) {
        console.log(JSON.stringify(tooling, null, 2));
      } else {
        displaySnippetDetails(tooling);
      }
    } else {
      if (options.json) {
        console.log(JSON.stringify(registry, null, 2));
      } else {
        console.log();
        console.log(chalk.bold.hex("#ea580c")("Tooling Configurations"));
        displaySnippetsTable(registry);
      }
    }
  });

// ============================================================================
// Addons Subcommand
// ============================================================================

const showAddons = new Command()
  .name("addons")
  .description("Show available addons (cross-framework snippets)")
  .argument("[name]", "Addon name to show details for")
  .option("--json", "Output in JSON format")
  .action(async (addonName: string | undefined, options) => {
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

    if (addonName) {
      const addon = registry.find(
        (a) => a.name.toLowerCase() === addonName.toLowerCase(),
      );

      if (!addon) {
        console.log(chalk.red(`Addon '${addonName}' not found`));
        console.log(chalk.dim("Available addons:"));
        registry
          .slice(0, 10)
          .forEach((a) => console.log(chalk.dim(`  • ${a.name}`)));
        process.exit(1);
      }

      if (options.json) {
        console.log(JSON.stringify(addon, null, 2));
      } else {
        displaySnippetDetails(addon);
      }
    } else {
      if (options.json) {
        console.log(JSON.stringify(registry, null, 2));
      } else {
        console.log();
        console.log(
          chalk.bold.hex("#ea580c")("Addons (Cross-Framework Snippets)"),
        );
        displaySnippetsTable(registry);
      }
    }
  });

// ============================================================================
// Main Command
// ============================================================================

export const show = new Command()
  .name("show")
  .description("Show details about snippets, templates, tooling, or addons")
  .addCommand(showSnippets)
  .addCommand(showTemplates)
  .addCommand(showTooling)
  .addCommand(showAddons);
