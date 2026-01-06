import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { fetchAvailableFrameworks } from "./registry";
import { promptFramework } from "../helpers";

/**
 * Fetch available frameworks and prompt for selection if needed.
 * This consolidates the repeated framework fetching + selection logic.
 *
 * @param preselected - Optional pre-selected framework (from CLI option or config)
 * @returns The selected framework or null if cancelled
 */
export async function fetchFrameworkWithPrompt(
  preselected?: string,
): Promise<string | null> {
  // If already selected, return immediately
  if (preselected) {
    return preselected;
  }

  const spinner = ora("Fetching frameworks...").start();
  let frameworks: string[] = [];

  try {
    frameworks = await fetchAvailableFrameworks();
    spinner.succeed("Frameworks fetched");
  } catch (error) {
    spinner.fail("Failed to fetch frameworks");
    console.error(error);
    process.exit(1);
  }

  const selected = await promptFramework(frameworks);
  if (!selected) {
    return null;
  }

  return selected;
}

/**
 * Display a "not found" message with available items list
 */
export function displayNotFound(
  itemType: string,
  name: string,
  items: { name: string }[],
  maxShow: number = 10,
): void {
  console.log(chalk.red(`${itemType} '${name}' not found`));
  console.log(chalk.dim(`Available ${itemType.toLowerCase()}s:`));
  items.slice(0, maxShow).forEach((item) => {
    console.log(chalk.dim(`  • ${item.name}`));
  });
  if (items.length > maxShow) {
    console.log(chalk.dim(`  ... and ${items.length - maxShow} more`));
  }
}

/**
 * Merge scripts into package.json
 */
export async function mergePackageScripts(
  scripts: Record<string, string>,
): Promise<void> {
  const pkgPath = path.join(process.cwd(), "package.json");
  if (!(await fs.pathExists(pkgPath))) return;

  const pkg = await fs.readJSON(pkgPath);
  pkg.scripts = { ...pkg.scripts, ...scripts };
  await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
}

/**
 * Append environment variables to .env.example
 */
export async function appendEnvVars(envVars: string[]): Promise<string[]> {
  const envPath = path.join(process.cwd(), ".env.example");

  let existingContent = "";
  if (await fs.pathExists(envPath)) {
    existingContent = await fs.readFile(envPath, "utf-8");
  }

  const newVars = envVars.filter((v) => !existingContent.includes(v));
  if (newVars.length > 0) {
    const newContent = newVars
      .map((v) => (v.includes("=") ? v : `${v}=`))
      .join("\n");
    await fs.appendFile(
      envPath,
      (existingContent ? "\n" : "") + newContent + "\n",
    );
  }
  return newVars;
}

/**
 * Ensures a directory exists and writes a file
 */
export async function writeFile(
  targetPath: string,
  content: string,
): Promise<void> {
  await fs.ensureDir(path.dirname(targetPath));
  await fs.writeFile(targetPath, content);
}
