import { useUIStore } from "@/stores";
import type { Template } from "@/types/docs";

export const FeatureTemplateCard = ({ template }: { template: Template }) => {
  const { toggleCardExpanded, isCardExpanded } = useUIStore();
  const expanded = isCardExpanded(template.id);

  return (
    <div
      className="border border-border rounded-lg p-4 bg-surface hover:border-foreground/20 transition-colors cursor-pointer"
      onClick={() => toggleCardExpanded(template.id)}
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
