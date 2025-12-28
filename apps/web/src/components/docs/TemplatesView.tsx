import { useState } from "react";
import type { TemplatesData, Template } from "@/types/docs";
import { TemplateCard } from "./TemplateCard";
import { CodeBlock } from "./CodeBlock";

interface TemplatesViewProps {
  data: TemplatesData;
  activeCategory: string;
}

// Compact card for feature templates with purpose and features
const FeatureTemplateCard = ({ template }: { template: Template }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="border border-border rounded-lg p-4 bg-surface hover:border-foreground/20 transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-foreground">{template.name}</h4>
          <p className="text-sm text-muted mt-1">{template.description}</p>
        </div>
        <span className="text-muted text-xs">{expanded ? "▲" : "▼"}</span>
      </div>
      <code className="text-xs text-primary mt-2 block">
        {template.command}
      </code>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          {template.purpose && (
            <p className="text-sm text-muted">{template.purpose}</p>
          )}
          {template.features && template.features.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-foreground mb-1">
                Features:
              </h5>
              <ul className="text-xs text-muted space-y-0.5">
                {template.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>
          )}
          {template.dependencies && template.dependencies.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {template.dependencies.map((dep) => (
                <span
                  key={dep}
                  className="text-xs bg-background px-1.5 py-0.5 rounded text-muted"
                >
                  {dep}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const TemplatesView = ({ data, activeCategory }: TemplatesViewProps) => {
  // Show overview when no category is selected
  const showOverview = activeCategory === "";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {data.title}
        </h1>
        <p className="text-muted text-lg">{data.description}</p>
      </div>

      {/* Overview - show when no category selected */}
      {showOverview && (
        <div className="space-y-6">
          <p className="text-muted">
            Select a category from the sidebar to view detailed documentation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.categories.map((category) => (
              <div
                key={category.id}
                className="p-4 border border-border rounded-lg bg-surface hover:border-foreground/20 transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-1">
                  {category.title}
                </h3>
                <p className="text-sm text-muted">{category.description}</p>
                {category.templates && (
                  <span className="text-xs text-primary mt-2 block">
                    {category.templates.length} templates
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Example Commands */}
      {data.examples && activeCategory === "base" && (
        <div className="mb-12 p-6 bg-surface rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Quick Examples
          </h3>
          <div className="space-y-4">
            {data.examples.map((example, idx) => (
              <div key={idx}>
                <p className="text-sm text-muted mb-2">{example.description}</p>
                <CodeBlock command={example.command} />
              </div>
            ))}
          </div>
        </div>
      )}

      {data.categories
        .filter((cat) => cat.id === activeCategory)
        .map((category) => (
          <div key={category.id}>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {category.title}
            </h2>
            <p className="text-muted mb-6">{category.description}</p>

            {category.templates && (
              <div className="space-y-4">
                {category.templates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}

            {category.subcategories && (
              <div className="space-y-8">
                {category.subcategories.map((subcat) => (
                  <div key={subcat.id}>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {subcat.title}
                    </h3>
                    {subcat.description && (
                      <p className="text-muted text-sm mb-4">
                        {subcat.description}
                      </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subcat.templates.map((template) => (
                        <FeatureTemplateCard
                          key={template.id}
                          template={template}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
