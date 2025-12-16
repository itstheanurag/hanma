import { useState } from "react";
import { LuCopy, LuCheck, LuTerminal } from "react-icons/lu";

/* ----------------------------- Data ----------------------------- */

const INSTALL_COMMAND = "npm install -g hanma";
const ADD_COMMAND = "npx hanma add express-v5-server src/lib/";

/* -------------------------- Root Section ------------------------- */

const TerminalSection = () => {
  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <TerminalPreview />
        <TerminalContent />
      </div>
    </section>
  );
};

export default TerminalSection;

/* ------------------------ Left: Terminal ------------------------- */

const TerminalPreview = () => {
  return (
    <div className="order-2 lg:order-1 relative">
      <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-zinc-800 font-mono text-sm relative z-10">
        <TerminalHeader />
        <TerminalBody />
      </div>

      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 -z-10" />
    </div>
  );
};

const TerminalHeader = () => {
  return (
    <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-black/50">
      <div className="flex gap-2">
        {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
          <div
            key={c}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <div className="text-zinc-500 text-xs flex items-center gap-1">
        <LuTerminal size={10} />
        bash
      </div>
    </div>
  );
};

const TerminalBody = () => {
  return (
    <div className="p-6 space-y-6 text-zinc-300">
      <HelpStep />
      <InitStep />
      <AddStep />
      <TerminalCursor />
    </div>
  );
};


const PromptLine = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2 text-zinc-100">
    <span className="text-green-500 font-bold">➜</span>
    <span className="text-cyan-500 font-bold">~</span>
    {children}
  </div>
);

const HelpStep = () => (
  <div className="opacity-50 hover:opacity-100 transition-opacity">
    <PromptLine>
      <span>hanma help</span>
    </PromptLine>

    <div className="mt-2 text-zinc-400 pl-4 border-l border-zinc-700">
      <div>Usage: hanma [command] [options]</div>
      <div className="grid grid-cols-[80px_1fr] mt-2 gap-y-1">
        <span className="text-yellow-500">init</span>
        <span>Initialize configuration</span>
        <span className="text-yellow-500">add</span>
        <span>Add a component to project</span>
        <span className="text-yellow-500">help</span>
        <span>Show help command</span>
      </div>
    </div>
  </div>
);

const InitStep = () => (
  <div className="opacity-60 hover:opacity-100 transition-opacity">
    <PromptLine>
      <span>hanma init</span>
    </PromptLine>
    <div className="mt-1 pl-4 text-zinc-400">
      ✓ Configuration initialized (Snippets.json)
    </div>
  </div>
);

const AddStep = () => (
  <div>
    <PromptLine>
      <span className="text-white break-all">{ADD_COMMAND}</span>
    </PromptLine>

    <div className="mt-2 pl-4 text-zinc-400 space-y-1">
      <div className="text-xs text-zinc-500">Resolving packages...</div>
      <div>
        Installing{" "}
        <span className="text-yellow-400">express-v5-server</span>...
      </div>

      <div className="mt-2 space-y-1">
        {[
          "Created src/lib/server.ts",
          "Created src/lib/middleware/error.ts",
        ].map((line) => (
          <div key={line} className="flex items-center gap-2 text-green-400">
            <LuCheck size={14} />
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TerminalCursor = () => (
  <PromptLine>
    <span className="w-2.5 h-5 bg-zinc-500 animate-pulse" />
  </PromptLine>
);

/* ----------------------- Right: Content -------------------------- */

const TerminalContent = () => {
  return (
    <div className="order-1 lg:order-2 space-y-8">
      <CLIBadge />
      <TerminalHeading />
      <FeatureList />
      <InstallCommand />
    </div>
  );
};

const CLIBadge = () => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-medium text-foreground shadow-sm">
    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
    CLI v1.0.4
  </div>
);

const TerminalHeading = () => (
  <>
    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
      Your terminal is your superpower.
    </h2>
    <p className="text-muted text-lg leading-relaxed">
      Hanma comes with a powerful CLI to help you scaffold backend snippets in
      seconds. Specify the destination folder, and let us handle the rest.
    </p>
  </>
);

const FeatureList = () => (
  <div className="flex flex-col gap-4">
    <Feature
      title="Init"
      description="Initialize your project with a single command. We auto-detect your framework and set up the Snippets.json file."
    />
    <Feature
      title="Add"
      description={
        <>
          Download snippets directly to your source folder. Example{" "}
          <code className="bg-background px-1.5 py-0.5 rounded border border-border text-xs">
            src/lib/
          </code>{" "}
          indicates exactly where the files should live.
        </>
      }
    />
  </div>
);

const Feature = ({
  title,
  description,
}: {
  title: string;
  description: React.ReactNode;
}) => (
  <div className="p-4 rounded-lg bg-surface border border-border hover:border-foreground/20 transition-colors">
    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted">{description}</p>
  </div>
);

/* ----------------------- Copy Command ---------------------------- */

const InstallCommand = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500" />
      <button
        onClick={handleCopy}
        className="relative w-full flex items-center justify-between p-4 bg-[#1e1e1e] text-zinc-300 rounded-lg border border-zinc-800 font-mono text-sm group-hover:border-zinc-700 transition-colors text-left"
      >
        <span className="truncate pr-4">{INSTALL_COMMAND}</span>
        {copied ? (
          <LuCheck size={16} className="text-green-400" />
        ) : (
          <LuCopy size={16} className="text-zinc-500 group-hover:text-zinc-300" />
        )}
      </button>
    </div>
  );
};
