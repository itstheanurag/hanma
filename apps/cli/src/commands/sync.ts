import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { refreshAllRegistries, clearCache, getCacheInfo } from "../utils";

export const sync = new Command()
  .name("sync")
  .description("Sync local registry cache with remote")
  .option("--clear", "Clear the local cache instead of refreshing")
  .option("--info", "Show cache information")
  .action(async (options) => {
    // Show cache info
    if (options.info) {
      const info = await getCacheInfo();

      if (!info.exists) {
        console.log(chalk.yellow("\nNo cache exists yet."));
        console.log(
          chalk.dim(
            "Run any command to create the cache, or use 'hanma sync' to populate it.\n",
          ),
        );
        return;
      }

      console.log(chalk.bold("\nCache Information\n"));
      console.log(chalk.dim("Directory:"), info.directory);
      console.log(chalk.dim("Total Size:"), formatBytes(info.totalSize));
      console.log(chalk.dim("Files:"), info.fileCount);
      console.log(
        chalk.dim("Last Updated:"),
        info.lastUpdate ? info.lastUpdate.toLocaleString() : "Unknown",
      );

      if (info.entries.length > 0) {
        console.log(chalk.bold("\nCached Registries:"));
        for (const entry of info.entries) {
          console.log(
            `  ${chalk.cyan(entry.key.padEnd(25))} ${chalk.dim(formatBytes(entry.size).padEnd(10))} ${chalk.dim(entry.age)}`,
          );
        }
      }

      console.log();
      return;
    }

    // Clear cache
    if (options.clear) {
      const spinner = ora("Clearing cache...").start();
      try {
        await clearCache();
        spinner.succeed("Cache cleared");
      } catch (error) {
        spinner.fail("Failed to clear cache");
        console.error(error);
      }
      return;
    }

    // Refresh all registries
    const spinner = ora("Syncing registries...").start();

    try {
      const results = await refreshAllRegistries();

      if (results.failed.length === 0) {
        spinner.succeed(`Synced ${results.success.length} registries`);
      } else if (results.success.length === 0) {
        spinner.fail("Failed to sync any registries");
      } else {
        spinner.warn(
          `Synced ${results.success.length} registries, ${results.failed.length} failed`,
        );
      }

      // Show details
      if (results.success.length > 0) {
        console.log(chalk.green("\nSynced:"));
        for (const name of results.success) {
          console.log(chalk.dim(`  ✓ ${name}`));
        }
      }

      if (results.failed.length > 0) {
        console.log(chalk.red("\nFailed:"));
        for (const name of results.failed) {
          console.log(chalk.dim(`  ✗ ${name}`));
        }
      }

      console.log();
    } catch (error) {
      spinner.fail("Failed to sync registries");
      console.error(error);
    }
  });

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
