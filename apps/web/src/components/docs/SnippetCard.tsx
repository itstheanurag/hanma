import { memo } from "react";
import clsx from "clsx";
import type { SnippetDoc, FrameworkType } from "@/types/docs";
import { CodeBlock } from "./CodeBlock";
import { CodeViewer } from "./CodeViewer";
import { useUIStore } from "@/stores";

interface SnippetCardProps {
  snippet: SnippetDoc;
  framework: FrameworkType | "shared" | "tooling";
}

const SnippetCardComponent = ({ snippet, framework }: SnippetCardProps) => {
  const { setSnippetViewMode, getSnippetViewMode } = useUIStore();
  const viewMode = getSnippetViewMode(snippet.name);

  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden">
      <div className="p-6 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            {snippet.displayName || snippet.name}
            {snippet.dependencies && snippet.dependencies.length > 0 && (
              <span className="text-xs bg-border px-2 py-0.5 rounded-full text-muted font-normal">
                {snippet.dependencies.length} deps
              </span>
            )}
          </h3>

          {/* View Mode Toggle */}
          <div className="flex gap-1 bg-border/50 rounded-full p-1">
            <button
              onClick={() => setSnippetViewMode(snippet.name, "about")}
              className={clsx(
                "px-3 py-1 rounded-full text-sm font-medium transition-all",
                viewMode === "about"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted hover:text-foreground",
              )}
            >
              About
            </button>
            <button
              onClick={() => setSnippetViewMode(snippet.name, "code")}
              className={clsx(
                "px-3 py-1 rounded-full text-sm font-medium transition-all",
                viewMode === "code"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted hover:text-foreground",
              )}
            >
              Code
            </button>
          </div>
        </div>
        <p className="text-muted text-sm leading-relaxed mt-2">
          {snippet.description}
        </p>
      </div>

      <div className="p-6">
        {/* Code View */}
        {viewMode === "code" && (
          <CodeViewer snippetId={snippet.name} framework={framework} />
        )}

        {/* About View */}
        {viewMode === "about" && (
          <div className="space-y-6">
            {/* Purpose */}
            {snippet.purpose && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Purpose
                </h4>
                <p className="text-muted text-sm">{snippet.purpose}</p>
              </div>
            )}

            {/* Features */}
            {snippet.features && snippet.features.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Features
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {snippet.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="text-muted text-sm flex items-start gap-2"
                    >
                      <span className="text-green-500">-</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Installation */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Installation
              </h4>
              <CodeBlock command={snippet.command} />
            </div>

            {/* Output */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Output File
              </h4>
              <code className="text-sm bg-primary/10 px-2 py-1 rounded">
                {snippet.output}
              </code>
            </div>

            {/* Dependencies */}
            {(snippet.dependencies?.length > 0 ||
              snippet.devDependencies?.length) && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Dependencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {snippet.dependencies?.map((dep) => (
                    <span
                      key={dep}
                      className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded"
                    >
                      {dep}
                    </span>
                  ))}
                  {snippet.devDependencies?.map((dep) => (
                    <span
                      key={dep}
                      className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded"
                    >
                      {dep} (dev)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Environment Variables */}
            {snippet.envVars && snippet.envVars.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Environment Variables
                </h4>
                <div className="bg-background rounded-lg overflow-hidden border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-surface">
                      <tr>
                        <th className="text-left p-2 text-muted font-medium">
                          Variable
                        </th>
                        <th className="text-left p-2 text-muted font-medium">
                          Default
                        </th>
                        <th className="text-left p-2 text-muted font-medium">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {snippet.envVars.map((env) => (
                        <tr key={env.name} className="border-t border-border">
                          <td className="p-2 font-mono text-primary">
                            {env.name}
                          </td>
                          <td className="p-2 text-muted">
                            {env.default ||
                              (env.required ? (
                                <span className="text-red-400">required</span>
                              ) : (
                                "-"
                              ))}
                          </td>
                          <td className="p-2 text-muted">
                            {env.description || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Usage Example */}
            {snippet.usage && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Usage Example
                </h4>
                <div className="bg-neutral-100 dark:bg-neutral-900 border border-border rounded-lg overflow-hidden">
                  <pre className="p-4 text-sm text-neutral-800 dark:text-neutral-200 overflow-x-auto">
                    <code>{snippet.usage}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Related Snippets */}
            {snippet.related && snippet.related.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Related Snippets
                </h4>
                <div className="flex flex-wrap gap-2">
                  {snippet.related.map((rel) => (
                    <span
                      key={rel}
                      className="text-sm text-muted hover:text-foreground cursor-pointer"
                    >
                      #{rel}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const SnippetCard = memo(SnippetCardComponent);
