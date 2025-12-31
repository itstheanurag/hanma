import type { TemplatesData } from "@/types/docs";
import { TemplateCard } from "./TemplateCard";
import { CodeBlock } from "./CodeBlock";
import { FeatureTemplateCard } from "./FeatureTemplateCard";

interface TemplatesViewProps {
  data: TemplatesData;
  activeCategory: string;
}

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
