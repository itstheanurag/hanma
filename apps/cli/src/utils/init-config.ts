import chalk from "chalk";
import ora from "ora";
import { createConfig, HanmaConfig } from "./config";
import { fetchFrameworks } from "./registry";
import { promptFramework, promptInitConfig } from "../helpers";

/**
 * Common initialization logic for Hanma config
 * Returns the created config or null if cancelled
 */
export async function initHanmaConfig(): Promise<HanmaConfig | null> {
  console.log(chalk.bold.blue("Initializing Hanma..."));

  const response = await promptInitConfig();
  if (!response) {
    return null;
  }

  // Fetch and select framework
  const frameworksSpinner = ora("Fetching frameworks...").start();
  let frameworks: string[] = [];
  try {
    frameworks = await fetchFrameworks();
    frameworksSpinner.succeed("Frameworks fetched");
  } catch (error) {
    frameworksSpinner.fail("Failed to fetch frameworks");
    console.error(error);
    process.exit(1);
  }

  const framework = await promptFramework(frameworks);
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
