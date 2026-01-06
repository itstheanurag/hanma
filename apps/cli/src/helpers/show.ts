import chalk from "chalk";
import { RegistryItem, TemplateRegistry } from "../types";
import { createBox, createTable, padEnd } from "./console";

/**
 * Display snippets in a table format
 */
export function displaySnippetsTable(snippets: RegistryItem[]): void {
  console.log();
  createTable({
    columns: [
      { key: "name", header: "Name", color: chalk.cyan },
      { key: "description", header: "Description", maxWidth: 50 },
      { key: "category", header: "Category", color: chalk.yellow },
    ],
    data: snippets.map((s) => ({
      name: s.name,
      description: s.description,
      category: s.category || "uncategorized",
    })),
  }).forEach((line) => console.log(line));

  console.log("\n", chalk.dim(`  Total: ${snippets.length} snippets`), "\n");
}

/**
 * Display detailed info for a single snippet
 */
export function displaySnippetDetails(snippet: RegistryItem): void {
  const box = createBox();

  console.log("\n", box.top());
  console.log(
    box.row(
      chalk.bold.white(snippet.name) +
        chalk.dim(" - ") +
        snippet.description.slice(0, 50),
    ),
  );
  console.log(box.divider());

  // Basic info
  console.log(box.labelValue("Category:", snippet.category || "uncategorized"));
  console.log(box.labelValue("Framework:", snippet.framework || "unknown"));
  console.log(box.labelValue("Version:", snippet.version || "latest"));

  // Dependencies
  if (snippet.dependencies && snippet.dependencies.length > 0) {
    console.log(box.empty());
    console.log(box.section("Dependencies:"));
    for (const dep of snippet.dependencies) {
      console.log(box.listItem(dep, chalk.green));
    }
  }

  // Dev Dependencies
  if (snippet.devDependencies && snippet.devDependencies.length > 0) {
    console.log(box.empty());
    console.log(box.section("Dev Dependencies:"));
    for (const dep of snippet.devDependencies) {
      console.log(box.listItem(dep, chalk.blue));
    }
  }

  // Files
  if (snippet.files && snippet.files.length > 0) {
    console.log(box.empty());
    console.log(box.section("Files:"));
    for (const file of snippet.files) {
      console.log(box.listItem(file.name, chalk.cyan));
    }
  }

  console.log(box.bottom());
  console.log();
}

/**
 * Display templates in a categorized list format
 */
export function displayTemplatesList(
  registry: TemplateRegistry,
  framework: string,
): void {
  console.log();
  console.log(
    chalk.bold.hex("#ea580c")(
      `Available Templates for ${framework.charAt(0).toUpperCase() + framework.slice(1)}`,
    ),
  );
  console.log(chalk.dim("─".repeat(40)));
  console.log();

  const displayCategory = (
    name: string,
    items: { name: string; description: string }[] | undefined,
  ) => {
    if (!items || items.length === 0) return;
    console.log(chalk.bold.yellow(`${name.toUpperCase()}:`));
    for (const item of items) {
      console.log(
        `  ${chalk.cyan("•")} ${chalk.white(item.name)} ${chalk.dim("-")} ${chalk.dim(item.description)}`,
      );
    }
    console.log();
  };

  displayCategory("Base", registry.base);
  displayCategory("Features", registry.features);
  displayCategory("Presets", registry.presets);
}

/**
 * Display detailed info for a single template block
 */
export function displayTemplateDetails(template: {
  name: string;
  description: string;
  category: string;
  dependencies?: string[];
  devDependencies?: string[];
  scripts?: Record<string, string>;
  envVars?: string[];
  files: { path: string }[];
}): void {
  const box = createBox();

  console.log();
  console.log(box.top());
  console.log(
    box.row(
      chalk.bold.white(template.name) +
        chalk.dim(" - ") +
        template.description.slice(0, 45),
    ),
  );
  console.log(box.divider());
  console.log(box.labelValue("Category:", template.category));

  // Files structure
  if (template.files && template.files.length > 0) {
    console.log(box.empty());
    console.log(box.section("Structure:"));

    const sortedFiles = template.files.map((f) => f.path).sort();
    for (const filePath of sortedFiles) {
      const indent = filePath.split("/").length - 1;
      const fileName = filePath.split("/").pop() || filePath;
      const isDir = filePath.endsWith("/");
      const icon = isDir ? "📁" : "📄";
      const display = "  ".repeat(indent) + icon + " " + fileName;
      console.log(box.listItem(display, chalk.white, 0));
    }
  }

  // Dependencies
  if (template.dependencies && template.dependencies.length > 0) {
    console.log(box.empty());
    console.log(box.section("Dependencies:"));
    for (const dep of template.dependencies) {
      console.log(box.listItem(dep, chalk.green));
    }
  }

  // Dev Dependencies
  if (template.devDependencies && template.devDependencies.length > 0) {
    console.log(box.empty());
    console.log(box.section("Dev Dependencies:"));
    for (const dep of template.devDependencies) {
      console.log(box.listItem(dep, chalk.blue));
    }
  }

  // Scripts
  if (template.scripts && Object.keys(template.scripts).length > 0) {
    console.log(box.empty());
    console.log(box.section("Scripts:"));
    for (const [name, cmd] of Object.entries(template.scripts)) {
      console.log(box.listItem(`${name}: ${cmd}`, chalk.magenta));
    }
  }

  console.log(box.bottom());
  console.log();
}
