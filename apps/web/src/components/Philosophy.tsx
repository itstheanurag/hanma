import { LuCopy, LuTerminal, LuSparkles } from "react-icons/lu";
import { painPoints } from "@/data/philosophy.data";

const Philosophy = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-medium text-muted mb-6">
            <LuSparkles size={12} />
            Why Hanma?
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
            Tired of writing the same code
            <br />
            <span className="text-muted">over and over again?</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed">
            Every backend project needs the same things—configurable CORS, database initialization, 
            loggers, auth middleware. The only differences are a few environment variables 
            and minor tweaks.
          </p>
        </div>

        {/* Pain Points Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border rounded-xl overflow-hidden mb-16">
          {painPoints.map((point, idx) => (
            <div
              key={idx}
              className="bg-surface p-6 text-center hover:bg-surface-hover transition-colors"
            >
              <div className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center mb-4 mx-auto">
                <point.icon className="text-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                {point.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* The Solution */}
        <div className="border border-border rounded-xl overflow-hidden bg-surface">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Left: The Problem */}
            <div className="p-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
                The Problem
              </div>
              <p className="text-foreground leading-relaxed">
                You've built these utilities before. They're sitting in old projects, 
                scattered across repos, or lost in your notes. Every new project means 
                hunting them down and adapting them all over again.
              </p>
            </div>

            {/* Right: The Solution */}
            <div className="p-8 bg-background">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
                The Solution
              </div>
              <p className="text-foreground leading-relaxed">
                Keep your battle-tested templates in one place. Download them with a 
                single command. Make your tweaks and ship. No more copy-pasting from 
                old projects.
              </p>
            </div>
          </div>

          {/* Command Preview */}
          <div className="border-t border-border p-6 bg-background/50">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted">
                <LuTerminal size={16} />
                <code className="font-mono">hanma add</code>
              </div>
              <span className="text-border">→</span>
              <div className="flex items-center gap-2 text-muted">
                <LuCopy size={16} />
                <span>Make changes</span>
              </div>
              <span className="text-border">→</span>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <LuSparkles size={16} />
                <span>Ship it</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
