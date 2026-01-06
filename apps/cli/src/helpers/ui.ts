import prompts from "prompts";
import chalk from "chalk";
import { RegistryItem, TemplateBlock } from "../types";
import { getInstalledPackageManagers, PackageManager } from "../utils";

/**
 * Prompt for project name if not provided via CLI argument
 */
export async function promptProjectName(
  initial?: string,
): Promise<string | null> {
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
 * Generic prompt for selecting a template block
 */
export async function promptBlockSelection(
  blocks: TemplateBlock[],
  message: string,
  cliOption?: string,
  allowNone: boolean = false,
): Promise<TemplateBlock | undefined> {
  if (cliOption) {
    return blocks.find(
      (b) => b.name === cliOption || b.name.includes(cliOption),
    );
  }

  const choices = blocks.map((b) => ({
    title: b.name,
    value: b,
    description: b.description,
  }));

  if (allowNone) {
    choices.unshift({
      title: "None",
      value: null as any,
      description: "Skip this step",
    });
  }

  const { selected } = await prompts({
    type: "select",
    name: "selected",
    message,
    choices,
  });

  return selected;
}

/**
 * Prompt for framework selection (string based)
 */
export async function promptFramework(
  frameworks: string[],
  preselected?: string,
): Promise<string | null> {
  if (preselected && frameworks.includes(preselected)) {
    return preselected;
  }

  const { framework } = await prompts({
    type: "autocomplete",
    name: "framework",
    message: "Select a framework",
    choices: frameworks.map((f) => ({ title: f, value: f })),
  });

  return framework || null;
}

/**
 * Prompt for version selection
 */
export async function promptVersion(
  registry: RegistryItem[],
  preselected?: string,
): Promise<string> {
  const versions = Array.from(
    new Set(
      registry.map((item) => item.version).filter((v): v is string => !!v),
    ),
  ).sort();

  if (preselected && versions.includes(preselected)) {
    return preselected;
  }

  if (versions.length > 1) {
    const { version } = await prompts({
      type: "select",
      name: "version",
      message: "Select a version",
      choices: versions.map((v) => ({ title: v, value: v })),
    });
    return version || "";
  }

  if (versions.length === 1) {
    return versions[0]!;
  }

  return "latest";
}

/**
 * Prompt for multi-item selection from a list of registry items
 */
export async function promptMultiSelectRegistry(
  items: RegistryItem[],
  message: string = "Select items to add (space to select, enter to confirm)",
): Promise<RegistryItem[]> {
  const { selected } = await prompts({
    type: "multiselect",
    name: "selected",
    message,
    choices: items.map((item) => ({
      title: item.name,
      value: item,
      description: item.description,
    })),
    hint: "- Space to select. Return to submit",
  });

  return selected || [];
}

/**
 * Prompt for category selection and return filtered items
 */
export async function promptCategoryFilter(
  items: RegistryItem[],
  message: string = "Select a category",
): Promise<RegistryItem[] | null> {
  const categories = Array.from(
    new Set(items.map((i) => i.category || "uncategorized")),
  ).sort();

  if (categories.length <= 1) {
    return items;
  }

  const { category } = await prompts({
    type: "select",
    name: "category",
    message,
    choices: [
      { title: "All categories", value: "all" },
      ...categories.map((c) => ({ title: c, value: c })),
    ],
  });

  if (category === undefined) return null;
  if (category === "all") return items;

  return items.filter((i) => (i.category || "uncategorized") === category);
}

/**
 * Prompt for multi-select features (TemplateBlocks)
 */
export async function promptMultiSelectFeatures(
  items: TemplateBlock[],
  message: string,
  cliOptions?: Record<string, string>,
): Promise<TemplateBlock[]> {
  const selectedFeatures: TemplateBlock[] = [];

  if (cliOptions) {
    for (const [type, value] of Object.entries(cliOptions)) {
      if (value) {
        const item = items.find(
          (f) => f.featureType === type && f.name.includes(value),
        );
        if (item) selectedFeatures.push(item);
      }
    }
    if (selectedFeatures.length > 0) return selectedFeatures;
  }

  const featuresByType = items.reduce(
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
    message,
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
 * Prompt for package manager selection - only shows installed package managers
 */
export async function promptPackageManager(
  cliOption?: string,
): Promise<string | null> {
  const installed = getInstalledPackageManagers();

  // If CLI option provided, validate it's installed
  if (cliOption) {
    if (installed.includes(cliOption as PackageManager)) {
      return cliOption;
    }
    console.log(
      chalk.yellow(`⚠ ${cliOption} is not installed on your system.`),
    );
    // Fall through to prompt
  }

  if (installed.length === 0) {
    console.log(
      chalk.red(
        "No package managers found. Please install npm, pnpm, yarn, or bun.",
      ),
    );
    return null;
  }

  const { pm } = await prompts({
    type: "select",
    name: "pm",
    message: "Select package manager:",
    choices: installed.map((pm) => ({
      title: pm,
      value: pm,
    })),
    initial: 0,
  });

  return pm || null;
}

/**
 * Prompt for initial Hanma configuration
 */
export async function promptInitConfig(): Promise<{
  componentsPath: string;
  utilsPath: string;
} | null> {
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

  return response;
}
