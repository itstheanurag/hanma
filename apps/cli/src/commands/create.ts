import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import fs from "fs-extra";
import path from "path";
import { TemplateBlock, CollectedBlockData, ModuleBlock } from "../types";
import {
  promptProjectName,
  promptBlockSelection,
  promptPackageManager,
  collectBlockData,
  writeProjectFiles,
} from "../helpers";
import {
  fetchTemplatesRegistry,
  fetchModulesRegistry,
  fetchFrameworkWithPrompt,
} from "../utils";

async function validateProjectPath(projectName: string): Promise<string> {
  const projectPath = path.join(process.cwd(), projectName);
  if (await fs.pathExists(projectPath)) {
    console.log(chalk.red(`Directory ${projectName} already exists.`));
    process.exit(1);
  }
  return projectPath;
}

function buildPackageJson(projectName: string, data: CollectedBlockData) {
  return {
    name: projectName,
    version: "1.0.0",
    type: "module",
    scripts: data.scripts,
    dependencies: data.dependencies,
    devDependencies: data.devDependencies,
  };
}

function findBlockByName<T extends { name: string }>(
  blocks: T[],
  name?: string,
): T | undefined {
  if (!name) return undefined;
  return blocks.find((block) => block.name === name);
}

async function runPackageInstall(projectPath: string, packageManager: string) {
  try {
    const { execSync } = await import("child_process");
    process.chdir(projectPath);
    execSync(`${packageManager} install`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

export const create = new Command()
  .name("create")
  .description("Create a new project from composable templates")
  .argument("[name]", "Project name")
  .option("--framework <framework>", "Base framework")
  .option("--template <template>", "Base template")
  .option("--server <template>", "Base template")
  .option("--db <database>", "Database module")
  .option("--database <database>", "Database module")
  .option("--auth <auth>", "Authentication module")
  .option("--preset <preset>", "Preset template")
  .option("--security <preset>", "Preset template")
  .option("--mailer <mailer>", "Mailer feature")
  .option("--upload <upload>", "Upload feature")
  .option("--cache <cache>", "Cache feature")
  .option("--tooling <tooling>", "Tooling feature")
  .option("--features <features>", "Comma-separated feature templates")
  .option("--pm <pm>", "Package manager")
  .option("--skip-install", "Skip package installation")
  .action(async (projectNameArg, options) => {
    console.log(chalk.blue("\nHanma Project Creator\n"));

    const projectName = await promptProjectName(projectNameArg);
    if (!projectName) process.exit(0);

    const projectPath = await validateProjectPath(projectName);

    // Fetch registries
    const spinner = ora("Fetching templates and modules...").start();
    const [templateRegistry, modulesRegistry] = await Promise.all([
      fetchTemplatesRegistry(""),
      fetchModulesRegistry(),
    ]);

    if (!templateRegistry || !modulesRegistry) {
      spinner.fail("Failed to fetch registries");
      process.exit(1);
    }
    spinner.succeed("Registries loaded");

    // Framework selection
    const selectedTemplateName = options.template || options.server;
    const preselectedBase = findBlockByName(
      templateRegistry.base,
      selectedTemplateName,
    );
    const selectedFramework = await fetchFrameworkWithPrompt(
      options.framework || preselectedBase?.framework,
    );
    if (!selectedFramework) process.exit(0);

    // Template selection
    const frameworkTemplates = templateRegistry.base.filter(
      (b) => b.framework === selectedFramework,
    );
    if (frameworkTemplates.length === 0) {
      console.log(chalk.red(`No templates found for ${selectedFramework}`));
      process.exit(1);
    }

    const selectedBase =
      preselectedBase ??
      (await promptBlockSelection(
        frameworkTemplates,
        `Select ${selectedFramework} template:`,
        selectedTemplateName,
      ));
    if (!selectedBase) process.exit(0);

    // Module selection (DB & Auth)
    const selectModule = async (
      category: string,
      message: string,
      cliOption?: string,
    ) => {
      const mods = modulesRegistry.modules[category] || [];
      if (mods.length === 0) return undefined;
      if (cliOption) {
        if (cliOption.toLowerCase() === "none") return undefined;
        return findBlockByName(mods, cliOption);
      }

      const { selected } = await prompts({
        type: "select",
        name: "selected",
        message,
        choices: [
          { title: "None", value: null, description: `Skip ${category} setup` },
          ...mods.map((m) => ({
            title: m.name,
            value: m,
            description: m.description,
          })),
        ],
      });
      return selected || undefined;
    };

    const selectedDatabase = await selectModule(
      "database",
      "Select database:",
      options.database || options.db,
    );
    const selectedAuth = await selectModule(
      "auth",
      "Select authentication:",
      options.auth,
    );
    const selectedPreset = findBlockByName(
      templateRegistry.presets ?? [],
      options.preset || options.security,
    );

    // Feature selection
    const selectedFeatures: TemplateBlock[] = [];
    const featureCategories = [
      { type: "mailer", msg: "Select mailer:" },
      { type: "upload", msg: "Select upload provider:" },
      { type: "cache", msg: "Select cache:" },
      { type: "tooling", msg: "Select tooling:" },
    ];

    for (const { type, msg } of featureCategories) {
      const catFeatures =
        templateRegistry.features?.filter((f) => f.featureType === type) || [];
      if (catFeatures.length > 0) {
        const selected = await promptBlockSelection(
          catFeatures,
          msg,
          options[type],
          true,
        );
        if (selected) selectedFeatures.push(selected);
      }
    }

    if (options.features) {
      const featureNames = String(options.features)
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);
      const extraFeatures = featureNames
        .map((name) => findBlockByName(templateRegistry.features ?? [], name))
        .filter(Boolean) as TemplateBlock[];
      selectedFeatures.push(...extraFeatures);
    }

    // Tools & PM
    const packageManager = await promptPackageManager(options.pm);
    if (!packageManager) process.exit(0);

    console.log(chalk.blue("\nCreating project...\n"));
    await fs.ensureDir(projectPath);

    const blocks = [
      selectedBase,
      selectedDatabase,
      selectedAuth,
      selectedPreset,
      ...selectedFeatures,
    ].filter((block): block is TemplateBlock | ModuleBlock => Boolean(block));
    const blockData = collectBlockData(blocks);
    const packageJson = buildPackageJson(projectName, blockData);

    const writeSpinner = ora("Writing files...").start();
    await writeProjectFiles(
      projectPath,
      projectName,
      blockData.files,
      packageJson,
      blockData.envVars,
    );

    // hanma.json
    await fs.writeJSON(
      path.join(projectPath, "hanma.json"),
      {
        componentsPath: "src",
        utilsPath: "src/utils",
        framework: selectedFramework,
      },
      { spaces: 2 },
    );
    writeSpinner.succeed("Files written");

    if (!options.skipInstall) {
      const installSpinner = ora(
        `Installing dependencies with ${packageManager}...`,
      ).start();
      if (await runPackageInstall(projectPath, packageManager)) {
        installSpinner.succeed("Dependencies installed");
      } else {
        installSpinner.fail("Failed to install dependencies");
      }
    }

    // Success Message
    console.log(
      chalk.green(`\nProject ${projectName} created successfully!\n`),
    );

    console.log(chalk.blue("Next steps:"));
    console.log(chalk.cyan(`cd ${projectName}`));

    if (options.skipInstall) {
      console.log(chalk.cyan(`${packageManager} install`));
    }

    if (blockData.envVars.length > 0) {
      console.log(chalk.cyan("cp .env.example .env"));
    }

    console.log(chalk.cyan(`${packageManager} run dev\n`));
  });
