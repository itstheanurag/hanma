import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { TemplateBlock, TemplateRegistry, CollectedBlockData } from "../types";
import {
  promptProjectName,
  promptBlockSelection,
  promptMultiSelectFeatures,
  promptPackageManager,
  collectBlockData,
  writeProjectFiles,
} from "../helpers";
import { fetchTemplatesRegistry } from "../utils";


/**
 * Validate project path doesn't already exist
 */
async function validateProjectPath(projectName: string): Promise<string> {
  const projectPath = path.join(process.cwd(), projectName);
  if (await fs.pathExists(projectPath)) {
    console.log(chalk.red(`Directory ${projectName} already exists.`));
    process.exit(1);
  }
  return projectPath;
}

/**
 * Build the final package.json object
 */
function buildPackageJson(
  projectName: string,
  data: CollectedBlockData,
): Record<string, unknown> {
  return {
    name: projectName,
    version: "1.0.0",
    type: "module",
    scripts: data.scripts,
    dependencies: data.dependencies,
    devDependencies: data.devDependencies,
  };
}

/**
 * Install project dependencies
 */
async function runPackageInstall(
  projectPath: string,
  packageManager: string,
): Promise<boolean> {
  try {
    const { execSync } = await import("child_process");
    process.chdir(projectPath);
    execSync(`${packageManager} install`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}


/**
 * Print success message and next steps
 */
function printSuccessMessage(
  projectName: string,
  packageManager: string,
  hasEnvVars: boolean,
  skipInstall: boolean,
): void {
  console.log(chalk.green(`\nProject ${projectName} created successfully!\n`));
  console.log(chalk.blue("Next steps:"));
  console.log(`cd ${projectName}`);
  if (skipInstall) {
    console.log(`${packageManager} install`);
  }
  if (hasEnvVars) {
    console.log("cp .env.example .env");
  }
  console.log(`${packageManager} run dev\n`);
}


export const create = new Command()
  .name("create")
  .description("Create a new project from composable templates")
  .argument("[name]", "Project name")
  .option(
    "--framework <framework>",
    "Base framework (express-minimal, express-rest-api, express-graphql, express-trpc, express-socket)",
  )
  .option(
    "--database <database>",
    "Database setup (drizzle-postgres, drizzle-mysql, drizzle-sqlite, prisma-postgres, mongodb)",
  )
  .option(
    "--auth <auth>",
    "Authentication (better-auth, clerk, jwt-auth, passport-local)",
  )
  .option(
    "--mailer <mailer>",
    "Email provider (nodemailer, resend, sendgrid, aws-ses)",
  )
  .option(
    "--upload <upload>",
    "File upload provider (s3, cloudinary, local, gcp, r2)",
  )
  .option("--cache <cache>", "Cache provider (redis)")
  .option("--logging <logging>", "Logging provider (winston)")
  .option("--monitoring <monitoring>", "Monitoring provider (sentry)")
  .option(
    "--preset <preset>",
    "Security preset (security-basic, security-strict)",
  )
  .option(
    "--tooling <tooling>",
    "Linting & formatting (biome, eslint, prettier)",
  )
  .option("--pm <pm>", "Package manager (npm, pnpm, yarn, bun)")
  .option("--skip-install", "Skip package installation")
  .action(async (projectNameArg, options) => {
    console.log(chalk.blue("\nHanma Project Creator\n"));

    // 1. Get project name
    const projectName = await promptProjectName(projectNameArg);
    if (!projectName) {
      console.log("Operation cancelled.");
      process.exit(0);
    }

    // 2. Validate project path
    const projectPath = await validateProjectPath(projectName);

    // 3. Fetch template registry (fetch empty/generic first to get all options)
    const spinner = ora("Fetching templates...").start();
    let registry: TemplateRegistry | null;
    try {
      registry = await fetchTemplatesRegistry("");
      if (!registry) throw new Error("Registry is empty");
      spinner.succeed("Templates loaded");
    } catch (error) {
      spinner.fail("Failed to fetch templates");
      console.error(error);
      process.exit(1);
    }

    // 4. Select framework
    const selectedBase = await promptBlockSelection(
      registry.base,
      "Select framework:",
      options.framework,
    );
    if (!selectedBase) {
      console.log("Operation cancelled.");
      process.exit(0);
    }

    // 5. Select database
    const selectedDatabase = await promptBlockSelection(
      registry.database,
      "Select database:",
      options.database,
      true,
    );

    // 6. Select auth
    const selectedAuth = await promptBlockSelection(
      registry.auth,
      "Select authentication:",
      options.auth,
      true,
    );

    // 7. Select features (optional)
    let selectedFeatures: TemplateBlock[] = [];
    if (registry.features && registry.features.length > 0) {
      const exclusiveCategories = [
        { type: "mailer", message: "Select mailer provider:" },
        { type: "upload", message: "Select upload provider:" },
        { type: "cache", message: "Select cache provider:" },
        { type: "logging", message: "Select logging provider:" },
        { type: "monitoring", message: "Select monitoring provider:" },
      ];

      for (const { type, message } of exclusiveCategories) {
        const categoryFeatures = registry.features.filter(
          (f) => f.featureType === type,
        );
        if (categoryFeatures.length > 0) {
          const selected = await promptBlockSelection(
            categoryFeatures,
            message,
            (options as any)[type],
            true,
          );
          if (selected) selectedFeatures.push(selected);
        }
      }

      // Any other non-exclusive features
      const otherFeatures = registry.features.filter(
        (f) =>
          !exclusiveCategories.some((ex) => ex.type === f.featureType) &&
          f.featureType !== "tooling",
      );

      if (otherFeatures.length > 0) {
        const selectedOther = await promptMultiSelectFeatures(
          otherFeatures,
          "Select additional features (space to select, enter to confirm):",
        );
        selectedFeatures.push(...selectedOther);
      }
    }

    // 8. Select security preset (optional)
    let selectedPreset: TemplateBlock | undefined;
    if (registry.presets && registry.presets.length > 0) {
      selectedPreset = await promptBlockSelection(
        registry.presets,
        "Select security preset:",
        options.preset,
        true,
      );
    }

    // 9. Select tooling (optional)
    let selectedTooling: TemplateBlock | undefined;
    if (registry.features && registry.features.length > 0) {
      const toolingFeatures = registry.features.filter(
        (f) => f.featureType === "tooling",
      );
      selectedTooling = await promptBlockSelection(
        toolingFeatures,
        "Select linting & formatting:",
        options.tooling,
        true,
      );
    }

    // 10. Select package manager
    const packageManager = await promptPackageManager(options.pm);
    if (!packageManager) {
      console.log("Operation cancelled.");
      process.exit(0);
    }

    console.log(chalk.blue("\nCreating project...\n"));

    // 10. Create project directory
    await fs.ensureDir(projectPath);

    // 11. Collect and process template data
    const blocks = [
      selectedBase,
      selectedDatabase,
      selectedAuth,
      ...selectedFeatures,
      selectedPreset,
      selectedTooling,
    ].filter(Boolean) as TemplateBlock[];

    const blockData = collectBlockData(blocks);
    const packageJson = buildPackageJson(projectName, blockData);

    // 10. Write files
    const writeSpinner = ora("Writing files...").start();
    await writeProjectFiles(
      projectPath,
      projectName,
      blockData.files,
      packageJson,
      blockData.envVars,
    );
    writeSpinner.succeed("Files written");

    // 11. Initialize hanma.json
    const framework = selectedBase.name.split("-")[0]; // Simplistic mapping, e.g., express-minimal -> express
    await fs.writeJSON(
      path.join(projectPath, "hanma.json"),
      {
        componentsPath: "src",
        utilsPath: "src/utils",
        framework: framework,
      },
      { spaces: 2 },
    );

    // 11. Install dependencies
    if (!options.skipInstall) {
      const installSpinner = ora(
        `Installing dependencies with ${packageManager}...`,
      ).start();
      const success = await runPackageInstall(projectPath, packageManager);
      if (success) {
        installSpinner.succeed("Dependencies installed");
      } else {
        installSpinner.fail("Failed to install dependencies");
        console.log(
          chalk.yellow(
            `Run '${packageManager} install' manually in the project directory.`,
          ),
        );
      }
    }

    // 12. Print success message
    printSuccessMessage(
      projectName,
      packageManager,
      blockData.envVars.length > 0,
      options.skipInstall ?? false,
    );
  });
