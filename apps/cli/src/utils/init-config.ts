import prompts from "prompts";
import chalk from "chalk";
import { createConfig, HanmaConfig } from "./config";

/**
 * Common initialization logic for Hanma config
 * Returns the created config or null if cancelled
 */
export async function initHanmaConfig(): Promise<HanmaConfig | null> {
  console.log(chalk.bold.blue("Initializing Hanma..."));

  const response = await prompts([
    {
      type: "text",
      name: "componentsPath",
      message: "Where would you like to store your snippets?",
      initial: "src",
    },
    {
      type: "text",
      name: "utilsPath",
      message: "Where would you like to store utils?",
      initial: "src/utils",
    },
  ]);

  if (!response.componentsPath || !response.utilsPath) {
    return null;
  }

  const config: HanmaConfig = {
    componentsPath: response.componentsPath,
    utilsPath: response.utilsPath,
  };

  await createConfig(config);

  console.log(chalk.green(`\nConfiguration saved to hanma.json`));
  return config;
}
