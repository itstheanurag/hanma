import { Command } from "commander";
import { initHanmaConfig } from "../utils";
import chalk from "chalk";

export const init = new Command()
  .name("init")
  .description("Initialize Hanma configuration")
  .action(async () => {
    const config = await initHanmaConfig();

    if (!config) {
      console.log(chalk.red("Initialization cancelled."));
      process.exit(1);
    }

    console.log(
      "You can now add snippets using " + chalk.cyan("hanma add <snippet>"),
    );
  });
