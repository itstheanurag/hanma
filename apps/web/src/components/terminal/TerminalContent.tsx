import { useState } from "react";
import { LuCopy, LuCheck } from "react-icons/lu";
import { INSTALL_COMMAND } from "./constants";

/* ----------------------- Install Command ----------------------- */

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

/* ----------------------- Feature Component ----------------------- */

interface FeatureProps {
  title: string;
  description: React.ReactNode;
}

const Feature = ({ title, description }: FeatureProps) => (
  <div className="p-4 rounded-lg bg-surface border border-border hover:border-foreground/20 transition-colors">
    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted">{description}</p>
  </div>
);

/* ----------------------- Content Subcomponents ----------------------- */

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

/* ----------------------- Main Content Component ----------------------- */

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

export default TerminalContent;
