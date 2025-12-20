import prompts from "prompts";
import { RegistryItem, TemplateBlock } from "../types";

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
 * Prompt for framework selection (string based, for add/module)
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
  );

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
 * Prompt for category selection
 */
export async function promptCategory(
  items: RegistryItem[],
): Promise<RegistryItem[] | null> {
  const categories = Array.from(
    new Set(items.map((item) => item.category || "uncategorized")),
  ).sort();

  if (categories.length <= 1) {
    return items;
  }

  const { category } = await prompts({
    type: "select",
    name: "category",
    message: "Select a category",
    choices: [
      { title: "All categories", value: "all" },
      ...categories.map((c) => ({ title: c, value: c })),
    ],
  });

  if (!category) return null;
  if (category === "all") return items;

  return items.filter(
    (item) => (item.category || "uncategorized") === category,
  );
}

/**
 * Prompt for multi-select features
 */
export async function promptMultiSelect(
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
 * Prompt for package manager selection
 */
export async function promptPackageManager(
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
