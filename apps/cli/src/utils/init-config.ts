import chalk from "chalk";
import { createConfig, HanmaConfig } from "./config";
import { fetchFrameworkWithPrompt } from "./shared";
import { promptInitConfig } from "../helpers";

/**
 * Common initialization logic for Hanma config
 * Returns the created config or null if cancelled
 */
export async function initHanmaConfig(): Promise<HanmaConfig | null> {
  if (!process.stdin.isTTY) {
    console.error(
      chalk.red("Initialization requires an interactive terminal."),
    );
    return null;
  }

  console.log(chalk.bold.blue("Initializing Hanma..."));

  const response = await promptInitConfig();
  if (!response) {
    return null;
  }

  // Use shared helper for framework selection
  const framework = await fetchFrameworkWithPrompt();
  if (!framework) {
    return null;
  }

  const config: HanmaConfig = {
    componentsPath: response.componentsPath,
    utilsPath: response.utilsPath,
    framework: framework,
  };

  await createConfig(config);

  console.log(chalk.green(`\nConfiguration saved to hanma.json`));
  return config;
}
