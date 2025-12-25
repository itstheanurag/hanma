import { BiPackage } from "react-icons/bi";
import type { ModulesData } from "@/types/docs";
import { CodeBlock } from "./CodeBlock";

interface ModulesViewProps {
  data: ModulesData;
}

export const ModulesView = ({ data }: ModulesViewProps) => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{data.title}</h1>
        <p className="text-muted text-lg">{data.description}</p>
      </div>

      {/* Concept Explanation */}
      <div className="mb-12 p-6 bg-surface rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">What is a Module?</h3>
        <p className="text-muted mb-4">{data.concept.whatIsAModule}</p>
        <h4 className="text-sm font-semibold text-foreground mb-2">When to use modules:</h4>
        <ul className="space-y-1">
          {data.concept.whenToUseModules.map((reason, idx) => (
            <li key={idx} className="text-muted text-sm flex items-start gap-2">
              <span className="text-green-500">✓</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Available Modules */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Available Modules</h2>
        <div className="space-y-6">
          {data.modules.map((module) => (
            <div key={module.id} className="border border-border rounded-xl bg-surface overflow-hidden">
              <div className="p-6 border-b border-border bg-background">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <BiPackage size={20} />
                  {module.name}
                </h3>
                <p className="text-muted mt-2">{module.description}</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Purpose</h4>
                  <p className="text-muted text-sm">{module.purpose}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Features</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="text-muted text-sm flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Installation</h4>
                  <CodeBlock command={module.usage.add} />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Included Files</h4>
                  <div className="flex flex-wrap gap-2">
                    {module.files.map((file) => (
                      <span key={file.name} className="text-xs bg-surface px-2 py-1 rounded border border-border">
                        {file.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Modules */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Coming Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.upcomingModules.map((module) => (
            <div key={module.id} className="border border-border rounded-lg p-4 bg-surface/50 opacity-60">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                {module.name}
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                  {module.status}
                </span>
              </h4>
              <p className="text-sm text-muted mt-1">{module.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
