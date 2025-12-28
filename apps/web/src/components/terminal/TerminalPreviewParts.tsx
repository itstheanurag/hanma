import { LuTerminal, LuCheck } from "react-icons/lu";
import { ADD_COMMAND } from "./constants";

/* ----------------------- Shared Components ----------------------- */

export const PromptLine = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2 text-zinc-100">
    <span className="text-green-500 font-bold">➜</span>
    <span className="text-cyan-500 font-bold">~</span>
    {children}
  </div>
);

/* ----------------------- Terminal Header ----------------------- */

export const TerminalHeader = () => {
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

/* ----------------------- Terminal Steps ----------------------- */

export const HelpStep = () => (
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

export const InitStep = () => (
  <div className="opacity-60 hover:opacity-100 transition-opacity">
    <PromptLine>
      <span>hanma init</span>
    </PromptLine>
    <div className="mt-1 pl-4 text-zinc-400">
      ✓ Configuration initialized (Snippets.json)
    </div>
  </div>
);

export const AddStep = () => (
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

export const TerminalCursor = () => (
  <PromptLine>
    <span className="w-2.5 h-5 bg-zinc-500 animate-pulse" />
  </PromptLine>
);
