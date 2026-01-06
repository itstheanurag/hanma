import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";
import { VERSION } from "../constants";
import { getUserPkgManager } from "../utils";

async function fetchLatestVersion(): Promise<string | null> {
  try {
    const response = await fetch("https://registry.npmjs.org/hanma/latest");
    const data = (await response.json()) as { version: string };
    return data.version;
  } catch {
    return null;
  }
}

export const update = new Command()
  .name("update")
  .description("Update Hanma CLI to the latest version")
  .option("--check", "Only check for updates without installing")
  .action(async (options) => {
    const spinner = ora("Checking for updates...").start();

    const latestVersion = await fetchLatestVersion();

    if (!latestVersion) {
      spinner.fail("Failed to check for updates");
      return;
    }

    if (latestVersion === VERSION) {
      spinner.succeed(`Already on the latest version (${VERSION})`);
      return;
    }

    spinner.succeed(
      `New version available: ${latestVersion} (current: ${VERSION})`,
    );

    if (options.check) {
      console.log(chalk.blue(`\nRun 'hanma update' to update.`));
      return;
    }

    // Detect package manager and update
    const pm = getUserPkgManager();
    const updateSpinner = ora(`Updating with ${pm}...`).start();

    try {
      const cmd =
        pm === "npm"
          ? "npm install -g hanma@latest"
          : pm === "pnpm"
            ? "pnpm add -g hanma@latest"
            : pm === "yarn"
              ? "yarn global add hanma@latest"
              : "bun add -g hanma@latest";

      execSync(cmd, { stdio: "pipe" });
      updateSpinner.succeed(`Updated to ${latestVersion}`);
    } catch {
      updateSpinner.fail("Failed to update. Try running manually:");
      console.log(chalk.cyan(`  npm install -g hanma@latest`));
    }
  });
