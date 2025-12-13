import { Command } from "commander";
import chalk from "chalk";

export const help = new Command()
  .name("help")
  .description("Display help for Hanma")
  .action(() => {
    console.log(`
      ${chalk.bold.hex("#ea580c")("HANMA")} - Grapple your backend into shape 🥋

      ${chalk.bold("USAGE")}
      ${chalk.cyan("hanma")} [command] [options]

      ${chalk.bold("COMMANDS")}
      ${chalk.yellow("add")}       Interactive mode to browse and add snippets.
      ${chalk.yellow("init")}      Initialize Hanma in your project.
      ${chalk.yellow("help")}      Display this help message.

      ${chalk.bold("EXAMPLES")}
      Start interactive mode:
      ${chalk.dim("$")} hanma add

      Add a specific snippet (e.g. express server):
      ${chalk.dim("$")} hanma add express

      ${chalk.bold("DOCUMENTATION")}
      https://github.com/itstheanurag/hanma
    `);
 });
