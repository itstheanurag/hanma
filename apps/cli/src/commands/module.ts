import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import { ModuleBlock, ModulesRegistry } from "../types";
import {
  fetchModulesRegistry,
  getConfig,
  batchInstallDependencies,
  mergePackageScripts,
  appendEnvVars,
  writeFile,
} from "../utils";

/**
 * Install a module to the project
 */
async function installModule(
  module: ModuleBlock,
  componentsPath: string,
): Promise<void> {
  console.log(chalk.blue(`\nInstalling module: ${module.name}`));

  // 1. Write files
  const writeSpinner = ora("Writing files...").start();
  for (const file of module.files) {
    let targetPath: string;
    if (file.path.startsWith("src/")) {
      const relativePath = file.path.replace(/^src\//, "");
      targetPath = path.join(process.cwd(), componentsPath, relativePath);
    } else {
      targetPath = path.join(process.cwd(), file.path);
    }
    await writeFile(targetPath, file.content);
    console.log(
      chalk.dim(
        `  → ${file.path.startsWith("src/") ? path.join(componentsPath, file.path.replace(/^src\//, "")) : file.path}`,
      ),
    );
  }
  writeSpinner.succeed(`${module.files.length} file(s) written`);

  // 2. Install dependencies
  if (module.dependencies?.length || module.devDependencies?.length) {
    const depsSpinner = ora("Installing dependencies...").start();
    try {
      await batchInstallDependencies(
        module.dependencies || [],
        module.devDependencies || [],
      );
      depsSpinner.succeed("Dependencies installed");
    } catch {
      depsSpinner.fail("Failed to install dependencies");
    }
  }

  // 3. Merge scripts
  if (module.scripts && Object.keys(module.scripts).length > 0) {
    const scriptsSpinner = ora("Adding scripts to package.json...").start();
    try {
      await mergePackageScripts(module.scripts);
      scriptsSpinner.succeed("Scripts added to package.json");
    } catch {
      scriptsSpinner.fail("Failed to update package.json");
    }
  }

  // 4. Append env vars
  if (module.envVars?.length) {
    const envSpinner = ora("Adding env vars to .env.example...").start();
    try {
      const newVars = await appendEnvVars(module.envVars);
      envSpinner.succeed(
        newVars.length > 0
          ? "Env vars added to .env.example"
          : "Env vars already exist",
      );
    } catch {
      envSpinner.fail("Failed to update .env.example");
    }
  }

  console.log(chalk.green(`\n✓ Module ${module.name} installed successfully`));
}

export const module = new Command()
  .name("module")
  .alias("mod")
  .description("Add a module (auth, database, etc.) to your project")
  .argument(
    "[name]",
    "Module name to add (e.g., drizzle-postgres, better-auth)",
  )
  .option("-c, --category <category>", "Filter by category (auth, database)")
  .option(
    "-p, --path <path>",
    "Destination path (defaults to config.componentsPath)",
  )
  .action(async (moduleName: string | undefined, options) => {
    const config = await getConfig();
    if (!config || !config.framework) {
      console.log(
        chalk.red("Initialization required. Please run 'hanma init' first."),
      );
      process.exit(1);
    }

    const framework = config.framework;
    console.log(chalk.dim(`Framework: ${framework} (from hanma.json)\n`));

    const registrySpinner = ora("Fetching modules...").start();
    const registry = await fetchModulesRegistry();
    if (!registry) {
      registrySpinner.fail("Failed to fetch modules registry");
      process.exit(1);
    }
    registrySpinner.succeed("Modules loaded");

    // Flatten and filter
    let allModules: ModuleBlock[] = [];
    const categories = options.category
      ? [options.category]
      : registry.categories;
    for (const cat of categories) {
      if (registry.modules[cat]) {
        allModules.push(
          ...registry.modules[cat].filter(
            (m) => !m.framework || m.framework === framework,
          ),
        );
      }
    }

    if (allModules.length === 0) {
      console.log(chalk.yellow("No modules available for your framework."));
      process.exit(0);
    }

    let selectedModule: ModuleBlock | undefined;
    if (moduleName) {
      selectedModule = allModules.find(
        (m) => m.name.toLowerCase() === moduleName.toLowerCase(),
      );
      if (!selectedModule) {
        console.log(chalk.red(`Module '${moduleName}' not found.`));
        process.exit(1);
      }
    } else {
      const prompts = (await import("prompts")).default;
      const choices = categories.flatMap((cat) => {
        const mods =
          registry.modules[cat]?.filter(
            (m) => !m.framework || m.framework === framework,
          ) || [];
        if (mods.length === 0) return [];
        return [
          {
            title: chalk.bold(`── ${cat.toUpperCase()} ──`),
            value: null,
            disabled: true,
          },
          ...mods.map((m) => ({
            title: `  ${m.name}`,
            value: m,
            description: m.description,
          })),
        ];
      });

      const { selected } = await prompts({
        type: "select",
        name: "selected",
        message: "Select a module:",
        choices,
      });
      if (!selected) process.exit(0);
      selectedModule = selected;
    }

    await installModule(selectedModule!, options.path || config.componentsPath);
  });
