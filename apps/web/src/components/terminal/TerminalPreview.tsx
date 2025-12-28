import {
  TerminalHeader,
  HelpStep,
  InitStep,
  AddStep,
  TerminalCursor,
} from "./TerminalPreviewParts";

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

export default TerminalPreview;
