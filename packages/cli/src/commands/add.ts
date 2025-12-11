import { Command } from "commander";
import { getConfig } from "../utils/config";
import { fetchRegistry } from "../utils/registry";
import { installDependencies } from "../utils/install";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";

export const add = new Command()
  .name("add")
  .description("Add a snippet to your project")
  .argument("[snippet]", "The snippet to add")
  .action(async (snippetName) => {
    const config = await getConfig();
    if (!config) {
      console.log(
        chalk.red("Configuration not found. Please run 'hanma init' first.")
      );
      process.exit(1);
    }

    let selectedSnippet = snippetName;

    const spinner = ora("Fetching registry...").start();
    let registry;
    try {
      registry = await fetchRegistry();
      spinner.succeed("Registry fetched");
    } catch (error) {
      spinner.fail("Failed to fetch registry");
      console.error(error);
      process.exit(1);
    }

    if (!selectedSnippet) {
      const response = await prompts({
        type: "autocomplete",
        name: "snippet",
        message: "Select a snippet to add",
        choices: registry.map((item) => ({
          title: item.name,
          value: item.name,
        })),
      });
      selectedSnippet = response.snippet;
    }

    if (!selectedSnippet) {
      console.log("No snippet selected.");
      process.exit(0);
    }

    const item = registry.find((i) => i.name === selectedSnippet);
    if (!item) {
      console.log(
        chalk.red(`Snippet '${selectedSnippet}' not found in registry.`)
      );
      process.exit(1);
    }

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
        config.componentsPath,
        file.name
      );
      await fs.ensureDir(path.dirname(targetPath));
      await fs.writeFile(targetPath, file.content);
    }
    writeSpinner.succeed(`Files written to ${config.componentsPath}`);

    console.log(chalk.green(`\n✔ Successfully added ${item.name}!`));
  });
