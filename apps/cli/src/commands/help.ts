import { Command } from "commander";
import chalk from "chalk";

export const help = new Command()
  .name("help")
  .description("Display help for Hanma")
  .action(() => {
    console.log(`
  ${chalk.bold.hex("#ea580c")("HANMA")} - Grapple your backend into shape

  ${chalk.bold("USAGE")}
    ${chalk.cyan("hanma")} <command> [options]

  ${chalk.bold("COMMANDS")}
    ${chalk.yellow("init")}              Initialize Hanma in your project (creates hanma.json)
    ${chalk.yellow("create")} [name]     Scaffold a new backend project from templates
    ${chalk.yellow("add")} [snippet]     Add a single-file snippet to your project
    ${chalk.yellow("module")} [module]   Add a multi-file module to your project
    ${chalk.yellow("help")}              Display this help message

  ${chalk.bold("ALIASES")}
    ${chalk.dim("mod")} → module

  ${chalk.bold("OPTIONS")}
    ${chalk.dim("-V, --version")}     Output the version number
    ${chalk.dim("-h, --help")}        Display help for command

  ${chalk.bold("EXAMPLES")}
    ${chalk.dim("# Initialize Hanma in your project")}
    $ hanma init

    ${chalk.dim("# Create a new project with interactive prompts")}
    $ hanma create my-api

    ${chalk.dim("# Create with specific options")}
    $ hanma create my-api --framework express --pm pnpm

    ${chalk.dim("# Add a snippet interactively")}
    $ hanma add

    ${chalk.dim("# Add a module interactively")}
    $ hanma module
    $ hanma mod

  ${chalk.bold("DOCUMENTATION")}
    ${chalk.underline("https://github.com/itstheanurag/hanma")}
    `);
  });
