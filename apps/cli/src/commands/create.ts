import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import path from "path";
import fs from "fs-extra";

const TEMPLATES_BASE_URL = "http://localhost:5173/templates";

//types

interface TemplateBlock {
  name: string;
  category: string;
  description: string;
  dependencies?: string[];
  devDependencies?: string[];
  scripts?: Record<string, string>;
  envVars?: string[];
  files: Array<{ path: string; content: string }>;
  featureType?:
    | "mailer"
    | "upload"
    | "cache"
    | "queue"
    | "logging"
    | "monitoring";
}

interface TemplateRegistry {
  base: TemplateBlock[];
  database: TemplateBlock[];
  auth: TemplateBlock[];
  features?: TemplateBlock[];
  presets?: TemplateBlock[];
}

interface CollectedBlockData {
  files: Array<{ path: string; content: string }>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  envVars: string[];
}

// ============================================================================
// Template Registry
// ============================================================================

async function fetchTemplateRegistry(): Promise<TemplateRegistry> {
  const res = await fetch(`${TEMPLATES_BASE_URL}/index.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch template registry: ${res.statusText}`);
  }
  return res.json() as Promise<TemplateRegistry>;
}

// ============================================================================
// User Prompts
// ============================================================================

/**
 * Prompt for project name if not provided via CLI argument
 */
async function promptProjectName(initial?: string): Promise<string | null> {
  if (initial) return initial;

  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "Project name:",
    initial: "my-api",
  });

  return name || null;
}

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
 * Prompt for framework selection
 */
async function promptFramework(
  bases: TemplateBlock[],
  cliOption?: string,
): Promise<TemplateBlock | undefined> {
  if (cliOption) {
    return bases.find((b) => b.name === cliOption);
  }

  const { base } = await prompts({
    type: "select",
    name: "base",
    message: "Select framework:",
    choices: bases.map((b) => ({
      title: b.name,
      value: b,
      description: b.description,
    })),
  });

  return base;
}

/**
 * Prompt for database selection
 */
async function promptDatabase(
  databases: TemplateBlock[],
  cliOption?: string,
): Promise<TemplateBlock | undefined> {
  if (cliOption) {
    return databases.find((d) => d.name === cliOption);
  }

  const { database } = await prompts({
    type: "select",
    name: "database",
    message: "Select database:",
    choices: [
      { title: "None", value: null },
      ...databases.map((d) => ({
        title: d.name,
        value: d,
        description: d.description,
      })),
    ],
  });

  return database;
}

/**
 * Prompt for auth selection
 */
async function promptAuth(
  auths: TemplateBlock[],
  cliOption?: string,
): Promise<TemplateBlock | undefined> {
  if (cliOption) {
    return auths.find((a) => a.name === cliOption);
  }

  const { auth } = await prompts({
    type: "select",
    name: "auth",
    message: "Select authentication:",
    choices: [
      { title: "None", value: null },
      ...auths.map((a) => ({
        title: a.name,
        value: a,
        description: a.description,
      })),
    ],
  });

  return auth;
}

/**
 * Prompt for package manager selection
 */
async function promptPackageManager(
  cliOption?: string,
): Promise<string | null> {
  if (cliOption) return cliOption;

  const { pm } = await prompts({
    type: "select",
    name: "pm",
    message: "Select package manager:",
    choices: [
      { title: "npm", value: "npm" },
      { title: "pnpm", value: "pnpm" },
      { title: "yarn", value: "yarn" },
      { title: "bun", value: "bun" },
    ],
    initial: 0,
  });

  return pm || null;
}

/**
 * Prompt for features selection (multi-select)
 */
async function promptFeatures(
  features: TemplateBlock[],
  cliOptions?: {
    mailer?: string;
    upload?: string;
    cache?: string;
    logging?: string;
    monitoring?: string;
  },
): Promise<TemplateBlock[]> {
  const selectedFeatures: TemplateBlock[] = [];

  // If CLI options provided, find matching features
  if (cliOptions) {
    for (const [type, value] of Object.entries(cliOptions)) {
      if (value) {
        const feature = features.find(
          (f) => f.featureType === type && f.name.includes(value),
        );
        if (feature) selectedFeatures.push(feature);
      }
    }
    if (selectedFeatures.length > 0) return selectedFeatures;
  }

  // Group features by type for organized display
  const featuresByType = features.reduce(
    (acc, f) => {
      const type = f.featureType || "other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(f);
      return acc;
    },
    {} as Record<string, TemplateBlock[]>,
  );

  const { selected } = await prompts({
    type: "multiselect",
    name: "selected",
    message: "Select additional features (space to select, enter to confirm):",
    choices: Object.entries(featuresByType)
      .flatMap(([type, items]) => [
        { title: `── ${type.toUpperCase()} ──`, value: null, disabled: true },
        ...items.map((f) => ({
          title: `  ${f.name}`,
          value: f,
          description: f.description,
        })),
      ])
      .filter((c) => c.value !== null),
    hint: "- Space to select. Enter to submit",
  });

  return selected || [];
}

/**
 * Prompt for security preset selection
 */
async function promptPreset(
  presets: TemplateBlock[],
  cliOption?: string,
): Promise<TemplateBlock | undefined> {
  if (cliOption) {
    return presets.find(
      (p) => p.name === cliOption || p.name.includes(cliOption),
    );
  }

  const { preset } = await prompts({
    type: "select",
    name: "preset",
    message: "Select security preset:",
    choices: [
      { title: "None", value: null },
      ...presets.map((p) => ({
        title: p.name,
        value: p,
        description: p.description,
      })),
    ],
  });

  return preset;
}

// ============================================================================
// Dependency Parsing
// ============================================================================

/**
 * Parse a dependency string like "express@4.18.0" or "@types/node@20.0.0"
 * Handles scoped packages correctly
 */
function parseDependencyString(dep: string): { name: string; version: string } {
  if (dep.startsWith("@")) {
    // Scoped package: @scope/name or @scope/name@version
    const lastAtIndex = dep.lastIndexOf("@");
    if (lastAtIndex > 0) {
      return {
        name: dep.substring(0, lastAtIndex),
        version: dep.substring(lastAtIndex + 1),
      };
    }
    return { name: dep, version: "*" };
  }

  if (dep.includes("@")) {
    // Regular package with version: name@version
    const [name, version] = dep.split("@");
    return { name: name!, version: version || "*" };
  }

  // Package without version
  return { name: dep, version: "*" };
}

/**
 * Parse an array of dependency strings into a dependencies object
 */
function parseDependencies(deps: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const dep of deps) {
    const { name, version } = parseDependencyString(dep);
    result[name] = version;
  }
  return result;
}

// ============================================================================
// Template Block Processing
// ============================================================================

/**
 * Collect all data from selected template blocks
 */
function collectBlockData(blocks: TemplateBlock[]): CollectedBlockData {
  const result: CollectedBlockData = {
    files: [],
    dependencies: {},
    devDependencies: {},
    scripts: {},
    envVars: [],
  };

  for (const block of blocks) {
    if (block.dependencies) {
      Object.assign(result.dependencies, parseDependencies(block.dependencies));
    }
    if (block.devDependencies) {
      Object.assign(
        result.devDependencies,
        parseDependencies(block.devDependencies),
      );
    }
    if (block.scripts) {
      Object.assign(result.scripts, block.scripts);
    }
    if (block.envVars) {
      result.envVars.push(...block.envVars);
    }
    if (block.files) {
      result.files.push(...block.files);
    }
  }

  return result;
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

// ============================================================================
// File Operations
// ============================================================================

/**
 * Write all project files to disk
 */
async function writeProjectFiles(
  projectPath: string,
  projectName: string,
  files: Array<{ path: string; content: string }>,
  packageJson: Record<string, unknown>,
  envVars: string[],
): Promise<void> {
  // Write package.json
  await fs.writeJSON(path.join(projectPath, "package.json"), packageJson, {
    spaces: 2,
  });

  // Write template files (skip package.json - we generate it ourselves)
  for (const file of files) {
    if (file.path === "package.json.hbs" || file.path === "package.json") {
      continue;
    }

    const filePath = path.join(projectPath, file.path.replace(/\.hbs$/, ""));
    await fs.ensureDir(path.dirname(filePath));

    // Replace template variables
    const content = file.content.replace(/\{\{projectName\}\}/g, projectName);
    await fs.writeFile(filePath, content);
  }

  // Write .env.example
  if (envVars.length > 0) {
    const envContent = envVars.map((v) => `${v}=`).join("\n");
    await fs.writeFile(path.join(projectPath, ".env.example"), envContent);
  }

  // Write .gitignore
  await fs.writeFile(
    path.join(projectPath, ".gitignore"),
    `node_modules\ndist\n.env\n.env.local\n*.log\n`,
  );
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

// ============================================================================
// Output Messages
// ============================================================================

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

// ============================================================================
// Main Command
// ============================================================================

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

    // 3. Fetch template registry
    const spinner = ora("Fetching templates...").start();
    let registry: TemplateRegistry;
    try {
      registry = await fetchTemplateRegistry();
      spinner.succeed("Templates loaded");
    } catch (error) {
      spinner.fail("Failed to fetch templates");
      console.error(error);
      process.exit(1);
    }

    // 4. Select framework
    const selectedBase = await promptFramework(
      registry.base,
      options.framework,
    );
    if (!selectedBase) {
      console.log("Operation cancelled.");
      process.exit(0);
    }

    // 5. Select database
    const selectedDatabase = await promptDatabase(
      registry.database,
      options.database,
    );

    // 6. Select auth
    const selectedAuth = await promptAuth(registry.auth, options.auth);

    // 7. Select features (optional)
    let selectedFeatures: TemplateBlock[] = [];
    if (registry.features && registry.features.length > 0) {
      selectedFeatures = await promptFeatures(registry.features, {
        mailer: options.mailer,
        upload: options.upload,
        cache: options.cache,
        logging: options.logging,
        monitoring: options.monitoring,
      });
    }

    // 8. Select security preset (optional)
    let selectedPreset: TemplateBlock | undefined;
    if (registry.presets && registry.presets.length > 0) {
      selectedPreset = await promptPreset(registry.presets, options.preset);
    }

    // 9. Select package manager
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
