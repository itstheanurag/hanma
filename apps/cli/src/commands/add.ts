import { Command } from "commander";
import { getConfig } from "../utils/config";
import { fetchFrameworks, fetchRegistry } from "../utils/registry";
import { installDependencies } from "../utils/install";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { RegistryItem } from "../schema";

export const add = new Command()
  .name("add")
  .description("Add a snippet to your project")
  .argument(
    "[snippet]",
    "The snippet to add (optional, use interactive mode if omitted)"
  )
  .argument(
    "[path]",
    "The destination path (optional, defaults to config.componentsPath)"
  )
  .action(async (snippetName, destinationPath) => {
    const config = await getConfig();
    if (!config) {
      console.log(
        chalk.red("Configuration not found. Please run 'hanma init' first.")
      );
      process.exit(1);
    }

    // 1. Select Framework
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

    let selectedFramework = "";
    let selectedVersion = "";
    let selectedSnippet: RegistryItem | undefined;

    const { framework } = await prompts({
      type: "autocomplete",
      name: "framework",
      message: "Select a framework",
      choices: frameworks.map((f) => ({ title: f, value: f })),
    });

    if (!framework) {
      console.log("Operation cancelled.");
      process.exit(0);
    }
    selectedFramework = framework;

    // 2. Fetch Registry for Framework
    const registrySpinner = ora(
      `Fetching registry for ${selectedFramework}...`
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

    // 3. Select Version (if applicable)
    // Extract unique versions
    const versions = Array.from(
      new Set(
        registry.map((item) => item.version).filter((v): v is string => !!v)
      )
    );

    if (versions.length > 1) {
      const { version } = await prompts({
        type: "select",
        name: "version",
        message: "Select a version",
        choices: versions.map((v) => ({ title: v, value: v })),
      });
      if (!version) {
        console.log("Operation cancelled.");
        process.exit(0);
      }
      selectedVersion = version;
    } else if (versions.length === 1) {
      selectedVersion = versions[0]!;
    } else {
      selectedVersion = "latest"; // Default/Unknown
    }

    // 4. Select Snippet
    // Filter registry by version if we selected one (and if items have version)
    // If selectedVersion is "latest" (no version found), show all?
    // If items correspond to versions, filter.

    const filteredSnippets = registry.filter((item) => {
      if (!selectedVersion || selectedVersion === "latest") return true;
      return item.version === selectedVersion;
    });

    const { snippet } = await prompts({
      type: "autocomplete",
      name: "snippet",
      message: "Select a snippet to add",
      choices: filteredSnippets.map((item) => ({
        title: item.name,
        value: item,
        description: item.description,
      })),
    });

    if (!snippet) {
      console.log("Operation cancelled.");
      process.exit(0);
    }
    selectedSnippet = snippet;

    // Install Flow
    if (!selectedSnippet) {
      // Should be unreachable due to exit above, but keeps TS happy
      process.exit(1);
    }
    const item = selectedSnippet;

    console.log(chalk.blue(`\nInstalling ${item.name}...`));

    // Install dependencies
    if (item.dependencies?.length) {
      const installSpinner = ora(
        `Installing dependencies: ${item.dependencies.join(", ")}...`
      ).start();
      await installDependencies(item.dependencies);
      installSpinner.succeed("Dependencies installed");
    }

    if (item.devDependencies?.length) {
      const devInstallSpinner = ora(
        `Installing devDependencies: ${item.devDependencies.join(", ")}...`
      ).start();
      await installDependencies(item.devDependencies, true);
      devInstallSpinner.succeed("Dev dependencies installed");
    }
    // Write files
    const writeSpinner = ora("Writing files...").start();
    for (const file of item.files) {
      const targetPath = path.join(
        process.cwd(),
        destinationPath || config.componentsPath, // Modified line
        file.name
      );
      await fs.ensureDir(path.dirname(targetPath));
      await fs.writeFile(targetPath, file.content);
    }
    writeSpinner.succeed(
      `Files written to ${destinationPath || config.componentsPath}`
    );
    // ...

    console.log(chalk.green(`\n✔ Successfully added ${item.name}!`));
  });
