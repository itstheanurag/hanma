import { Command } from "commander";
import prompts from "prompts";
import { createConfig } from "../utils/config";
import chalk from "chalk";

export const init = new Command()
  .name("init")
  .description("Initialize Hanma configuration")
  .action(async () => {
    console.log(chalk.bold.blue("Initializing Hanma..."));

    const response = await prompts([
      {
        type: "text",
        name: "componentsPath",
        message: "Where would you like to store your snippets?",
        initial: "src/hanma",
      },
      {
        type: "text",
        name: "utilsPath",
        message: "Where would you like to store utils?",
        initial: "src/utils",
      },
    ]);

    if (!response.componentsPath || !response.utilsPath) {
      console.log(chalk.red("Initialization cancelled."));
      process.exit(1);
    }

    await createConfig({
      componentsPath: response.componentsPath,
      utilsPath: response.utilsPath,
    });

    console.log(chalk.green(`\n✔ Configuration saved to hanma.json`));
    console.log(
      "You can now add snippets using " + chalk.cyan("hanma add <snippet>")
    );
  });
