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
    ${chalk.yellow("init")}                    Initialize Hanma in your project (creates hanma.json)
    ${chalk.yellow("create")} [name]           Scaffold a new backend project from templates
    ${chalk.yellow("add")} [snippets...]       Add snippet(s) to your project
    ${chalk.yellow("module")} [modules...]     Add multi-file module(s) to your project
    ${chalk.yellow("addons")} [snippets...]    Add cross-framework shared snippets (addons)
    ${chalk.yellow("tooling")} [configs...]    Add development tooling configurations
    ${chalk.yellow("show")} <type>             View snippets, templates, addons, or tooling
    ${chalk.yellow("docs")}                    Display documentation and guides
    ${chalk.yellow("help")}                    Display this help message

  ${chalk.bold("ALIASES")}
    ${chalk.dim("mod")} → module
    ${chalk.dim("mod add")} → addons

  ${chalk.bold("ADD OPTIONS")}
    ${chalk.dim("-a, --all")}             Add all snippets (use with --category)
    ${chalk.dim("-c, --category <cat>")}  Filter by category
    ${chalk.dim("-f, --framework <fw>")}  Framework to use
    ${chalk.dim("-v, --version <ver>")}   Version to use
    ${chalk.dim("-p, --path <path>")}     Destination path

  ${chalk.bold("SHOW OPTIONS")}
    ${chalk.dim("-f, --framework <fw>")}  Framework to use
    ${chalk.dim("--json")}                Output in JSON format

  ${chalk.bold("EXAMPLES")}
    ${chalk.dim("# Initialize Hanma in your project")}
    $ hanma init

    ${chalk.dim("# Create a new project")}
    $ hanma create my-api --framework express --pm pnpm

    ${chalk.dim("# Add snippets interactively (multi-select)")}
    $ hanma add

    ${chalk.dim("# Add multiple specific snippets")}
    $ hanma add cors jwt rate-limiter

    ${chalk.dim("# Add all snippets in a category")}
    $ hanma add --all --category middleware

    ${chalk.dim("# Add modules interactively (multi-select)")}
    $ hanma module

    ${chalk.dim("# Add specific modules")}
    $ hanma mod i18n billing

    ${chalk.dim("# Show available snippets for a framework")}
    $ hanma show snippets --framework express

    ${chalk.dim("# Show details for a specific snippet")}
    $ hanma show snippets cors --framework express

    ${chalk.dim("# Show available templates")}
    $ hanma show templates --framework hono

    ${chalk.bold("DOCS")}
    ${chalk.underline("https://hanma-a2n.pages.dev/docs")}

    ${chalk.bold("GITHUB")}
    ${chalk.underline("https://github.com/itstheanurag/hanma")}
    `);
  });
