import {
  LuArrowRight,
  LuLayers,
} from "react-icons/lu";
import { frameworks } from "@/data/frameworks.data";

const SupportedFrameworks = () => {
  return (
    <section className="py-24 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Built for your stack
          </h2>
          <p className="text-muted max-w-md">
            Native implementations for the modern TypeScript ecosystem. No
            wrappers, just idiomatic code.
          </p>
        </div>
        <button className="text-sm font-medium text-foreground hover:text-muted transition-colors flex items-center gap-2">
          View all integrations <LuArrowRight size={16} />
        </button>
      </div>

      {/* Data-driven grid */}
      <div className="grid md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
        {frameworks.map((fw) => (
          <div
            key={fw.id}
            className="bg-background p-8 group hover:bg-surface-hover transition-colors relative"
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-${fw.accent}-500/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-${fw.accent}-500/10`}
            />

            <div className="relative z-10">
              <div
                className={`w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center mb-6 ${fw.iconColor}`}
              >
                <fw.icon size={24} />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">
                {fw.name}
              </h3>

              <p className="text-sm text-muted mb-8 min-h-[40px]">
                {fw.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-muted font-mono border-t border-border pt-4">
                <span className={fw.command.prefixColor}>$</span>
                {fw.command.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-xs font-medium text-muted">
          <LuLayers size={14} />
          <span>NestJS support coming soon</span>
        </div>
      </div>
    </section>
  );
};

export default SupportedFrameworks;
