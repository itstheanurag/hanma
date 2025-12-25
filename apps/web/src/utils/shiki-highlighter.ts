import {
  createHighlighter,
  type Highlighter,
  type BundledLanguage,
  type BundledTheme,
} from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Get a singleton Shiki highlighter instance.
 * Lazy-loads on first call.
 */
export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["typescript", "javascript", "json", "bash", "shell"],
    });
  }
  return highlighterPromise;
}

/**
 * Highlight code with Shiki.
 * Returns HTML string with syntax highlighting.
 */
export async function highlightCode(
  code: string,
  lang: BundledLanguage = "typescript",
  theme?: BundledTheme,
): Promise<string> {
  const highlighter = await getHighlighter();

  // Detect theme from document
  const isDark =
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : true;

  const selectedTheme = theme || (isDark ? "github-dark" : "github-light");

  return highlighter.codeToHtml(code, {
    lang,
    theme: selectedTheme,
  });
}

/**
 * Count lines in a code string
 */
export function countLines(code: string): number {
  return code.split("\n").length;
}
