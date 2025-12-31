import { memo, useState, useEffect, useCallback } from "react";
import { LuCopy, LuCheck, LuChevronDown, LuChevronUp } from "react-icons/lu";
import { highlightCode, countLines } from "@/utils/shiki-highlighter";
import { useUIStore } from "@/stores";
import clsx from "clsx";
import type { FrameworkType } from "@/types/docs";
import { getSnippetSource, getToolingSource } from "@/utils/docsLoader";

interface CodeViewerProps {
  snippetId: string;
  framework: FrameworkType | "shared" | "tooling";
}

const MAX_COLLAPSED_LINES = 10;

const CodeViewerComponent = ({ snippetId, framework }: CodeViewerProps) => {
  const [sourceCode, setSourceCode] = useState<string | null>(null);
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { setCopied, isCopied } = useUIStore();
  const copied = isCopied(snippetId + "-code");

  const totalLines = sourceCode ? countLines(sourceCode) : 0;
  const needsExpansion = totalLines > MAX_COLLAPSED_LINES;

  // Fetch + highlight source
  useEffect(() => {
    const loadSource = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use static import from docsLoader
        let code: string | null = null;

        if (framework === "tooling") {
          code = getToolingSource(snippetId);
        } else {
          code = getSnippetSource(framework, snippetId);
        }

        if (!code) {
          throw new Error("Snippet source not found");
        }

        setSourceCode(code);

        // Highlighting logic stays exactly the same
        const html = await highlightCode(code, "typescript", "github-dark");
        setHighlightedHtml(html);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load source");
      } finally {
        setLoading(false);
      }
    };

    loadSource();
  }, [snippetId, framework]);

  const handleCopy = useCallback(async () => {
    if (!sourceCode) return;
    await navigator.clipboard.writeText(sourceCode);
    setCopied(snippetId + "-code");
  }, [sourceCode, snippetId, setCopied]);

  // Loading
  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-border rounded w-3/4" />
        <div className="h-4 bg-border rounded w-1/2" />
        <div className="h-4 bg-border rounded w-5/6" />
        <div className="h-4 bg-border rounded w-2/3" />
        <div className="h-4 bg-border rounded w-4/5" />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-muted">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted font-mono">{totalLines} lines</span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <LuCheck size={14} className="text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <LuCopy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code container */}
      <div
        className={clsx(
          "relative overflow-hidden transition-all duration-300 rounded-lg border border-border bg-transparent",
          !isExpanded && needsExpansion && "max-h-[280px]",
        )}
      >
        {/* Highlighted code (Shiki owns the background) */}
        <div
          className="overflow-x-auto text-sm [&_pre]:p-4 [&_pre]:m-0 [&_pre]:rounded-lg"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />

        {/* Gradient fade — MUST match Shiki background */}
        {!isExpanded && needsExpansion && (
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" />
        )}
      </div>

      {/* Expand / Collapse */}
      {needsExpansion && (
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mx-auto"
        >
          {isExpanded ? (
            <>
              <LuChevronUp size={16} />
              <span>Show Less</span>
            </>
          ) : (
            <>
              <LuChevronDown size={16} />
              <span>
                Show More ({totalLines - MAX_COLLAPSED_LINES} more lines)
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export const CodeViewer = memo(CodeViewerComponent);
