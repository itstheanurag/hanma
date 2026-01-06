import chalk, { ChalkInstance } from "chalk";

/**
 * Strip ANSI escape codes from a string to get its visible length
 */
function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
}

/**
 * Get visible length of a string (excluding ANSI codes)
 */
export function visibleLength(str: string): number {
  return stripAnsi(str).length;
}

/**
 * Pad a string to a target visible length
 */
export function padEnd(str: string, targetLength: number): string {
  const currentLength = visibleLength(str);
  if (currentLength >= targetLength) return str;
  return str + " ".repeat(targetLength - currentLength);
}

// ============================================================================
// Box Builder - Creates styled boxes with borders
// ============================================================================

export interface BoxOptions {
  width?: number;
  borderColor?: string;
}

export interface BoxBuilder {
  top: () => string;
  bottom: () => string;
  divider: () => string;
  row: (content: string) => string;
  labelValue: (label: string, value: string, labelWidth?: number) => string;
  empty: () => string;
  title: (text: string) => string;
  section: (label: string) => string;
  listItem: (text: string, color?: ChalkInstance, indent?: number) => string;
}

export function createBox(options: BoxOptions = {}): BoxBuilder {
  const width = options.width || 68;
  const color = chalk.hex(options.borderColor || "#ea580c");

  return {
    top: () => color("╔") + color("═".repeat(width)) + color("╗"),

    bottom: () => color("╚") + color("═".repeat(width)) + color("╝"),

    divider: () => color("╠") + color("═".repeat(width)) + color("╣"),

    row: (content: string) => {
      const padding = width - visibleLength(content) - 2;
      return (
        color("║ ") + content + " ".repeat(Math.max(0, padding)) + color("║")
      );
    },

    labelValue: (label: string, value: string, labelWidth = 14) => {
      const content = chalk.dim(label.padEnd(labelWidth)) + " " + value;
      const padding = width - visibleLength(content) - 2;
      return (
        color("║ ") + content + " ".repeat(Math.max(0, padding)) + color("║")
      );
    },

    empty: () => color("║") + " ".repeat(width) + color("║"),

    title: (text: string) => {
      const padding = width - visibleLength(text) - 4;
      return (
        color("║  ") +
        chalk.bold.white(text) +
        " ".repeat(Math.max(0, padding)) +
        color("  ║")
      );
    },

    section: (label: string) => {
      const padding = width - visibleLength(label) - 2;
      return (
        color("║ ") +
        chalk.dim(label) +
        " ".repeat(Math.max(0, padding)) +
        color("║")
      );
    },

    listItem: (
      text: string,
      itemColor: ChalkInstance = chalk.white,
      indent = 2,
    ) => {
      const prefix = " ".repeat(indent) + "• ";
      const content = prefix + text;
      const padding = width - visibleLength(content) - 2;
      return (
        color("║ ") +
        itemColor(content) +
        " ".repeat(Math.max(0, padding)) +
        color("║")
      );
    },
  };
}

// ============================================================================
// Table Builder - Creates tables with dynamic column widths
// ============================================================================

export interface Column {
  key: string;
  header: string;
  width?: number;
  color?: ChalkInstance;
  maxWidth?: number;
}

export interface TableOptions {
  columns: Column[];
  data: Record<string, unknown>[];
}

export function createTable(options: TableOptions): string[] {
  const { columns, data } = options;
  const lines: string[] = [];

  // Calculate column widths
  const widths = columns.map((col) => {
    const headerLen = col.header.length;
    const maxData = Math.max(
      ...data.map((row) => String(row[col.key] || "").length),
      0,
    );
    let width = Math.max(headerLen, maxData);
    if (col.maxWidth) width = Math.min(width, col.maxWidth);
    return col.width || width;
  });

  // Build border strings
  const topBorder =
    chalk.dim("┌") +
    widths.map((w) => chalk.dim("─".repeat(w + 2))).join(chalk.dim("┬")) +
    chalk.dim("┐");

  const headerDivider =
    chalk.dim("├") +
    widths.map((w) => chalk.dim("─".repeat(w + 2))).join(chalk.dim("┼")) +
    chalk.dim("┤");

  const bottomBorder =
    chalk.dim("└") +
    widths.map((w) => chalk.dim("─".repeat(w + 2))).join(chalk.dim("┴")) +
    chalk.dim("┘");

  // Header row
  const headerRow =
    chalk.dim("│ ") +
    columns
      .map((col, i) => chalk.bold(col.header.padEnd(widths[i]!)))
      .join(chalk.dim(" │ ")) +
    chalk.dim(" │");

  lines.push(topBorder);
  lines.push(headerRow);
  lines.push(headerDivider);

  // Data rows
  for (const row of data) {
    const cells = columns.map((col, i) => {
      let value = String(row[col.key] || "");
      const maxW = widths[i]!;

      // Truncate if needed
      if (value.length > maxW) {
        value = value.slice(0, maxW - 3) + "...";
      }

      const padded = value.padEnd(maxW);
      return col.color ? col.color(padded) : padded;
    });

    lines.push(
      chalk.dim("│ ") + cells.join(chalk.dim(" │ ")) + chalk.dim(" │"),
    );
  }

  lines.push(bottomBorder);
  return lines;
}

/**
 * Print a table directly to console
 */
export function printTable(options: TableOptions): void {
  const lines = createTable(options);
  for (const line of lines) {
    console.log(line);
  }
}
