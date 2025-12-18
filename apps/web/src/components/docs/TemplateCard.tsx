import { useState } from "react";
import { CgChevronRight } from "react-icons/cg";
import type { Template } from "../../types/docs";
import { CodeBlock } from "./CodeBlock";

interface TemplateCardProps {
  template: Template;
}

export const TemplateCard = ({ template }: TemplateCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border rounded-xl bg-surface overflow-hidden transition-colors ${template.recommended ? 'border-primary' : 'border-border hover:border-foreground/20'}`}>
      <div 
        className="p-6 border-b border-border bg-background cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            {template.name}
            {template.recommended && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                Recommended
              </span>
            )}
          </h3>
          <CgChevronRight 
            className={`text-muted transition-transform ${expanded ? 'rotate-90' : ''}`} 
            size={20} 
          />
        </div>
        <p className="text-muted text-sm leading-relaxed mt-2">{template.description}</p>
      </div>

      {expanded && (
        <div className="p-6 space-y-6">
          {template.purpose && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Purpose</h4>
              <p className="text-muted text-sm">{template.purpose}</p>
            </div>
          )}

          {template.features && template.features.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Features</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {template.features.map((feature, idx) => (
                  <li key={idx} className="text-muted text-sm flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Quick Start</h4>
            <CodeBlock command={template.command} />
          </div>

          {template.structure && template.structure.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Project Structure</h4>
              <div className="bg-[#0c0c0e] rounded-lg p-4 font-mono text-sm text-zinc-400">
                {template.structure.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>
          )}

          {template.envVars && template.envVars.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Environment Variables</h4>
              <div className="flex flex-wrap gap-2">
                {template.envVars.map((env, idx) => {
                  const envName = typeof env === 'string' ? env : env.name;
                  const isRequired = typeof env === 'string' ? false : env.required;
                  return (
                    <span key={envName ?? idx} className="text-xs bg-surface px-2 py-1 rounded font-mono">
                      {envName}
                      {isRequired && <span className="text-red-400 ml-1">*</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {template.nextSteps && template.nextSteps.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Next Steps</h4>
              <ul className="space-y-1">
                {template.nextSteps.map((step, idx) => (
                  <li key={idx} className="text-muted text-sm flex items-start gap-2">
                    <span className="text-primary">{idx + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
