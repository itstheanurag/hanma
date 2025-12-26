import type { TerminalDockProps } from "@/types/builder";
import { generateCommand } from "@/utils/builder";
import { useState, useEffect } from "react";
import { LuTerminal, LuCopy, LuCheck } from "react-icons/lu";

export default function TerminalDock(props: TerminalDockProps) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const command = generateCommand(props);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50 transition-all duration-500 ease-out transform ${
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
    >
      <div className="bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-1 flex items-center gap-4 relative overflow-hidden ring-1 ring-white/5">
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 pointer-events-none" />

        {/* Terminal Icon Area */}
        <div className="hidden md:flex items-center justify-center w-10 h-10 bg-black/40 rounded-xl shrink-0 ml-1 border border-white/5">
           <LuTerminal className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Command Display */}
        <div className="flex-1 overflow-x-auto scrollbar-hide py-3 pl-2 md:pl-0">
            <div className="font-mono text-sm whitespace-nowrap">
              <span className="text-muted-foreground select-none mr-2">$</span>
              <span className="text-foreground">
                <span className="text-purple-400">npx</span>{" "}
                <span className="text-foreground font-bold">hanma</span>{" "}
                <span className="text-blue-400">init</span>{" "}
                {props.projectName}
                
                {props.selectedBase && <span className="text-muted-foreground"> --server <span className="text-green-400">{props.selectedBase}</span></span>}
                {props.selectedDatabase && <span className="text-muted-foreground"> --db <span className="text-yellow-300">{props.selectedDatabase}</span></span>}
                {props.selectedAuth && <span className="text-muted-foreground"> --auth <span className="text-pink-400">{props.selectedAuth}</span></span>}
                {props.selectedPreset && <span className="text-muted-foreground"> --security <span className="text-cyan-400">{props.selectedPreset}</span></span>}
                
                {props.selectedMailer && <span className="text-muted-foreground"> --mailer <span className="text-orange-400">{props.selectedMailer}</span></span>}
                {props.selectedUpload && <span className="text-muted-foreground"> --upload <span className="text-indigo-400">{props.selectedUpload}</span></span>}
                {props.selectedTooling && <span className="text-muted-foreground"> --tooling <span className="text-gray-400">{props.selectedTooling}</span></span>}
                
                {props.selectedOtherFeatures.length > 0 && (
                   <span className="text-muted-foreground"> --features <span className="text-red-400">{props.selectedOtherFeatures.join(",")}</span></span>
                )}
              </span>
            </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 text-foreground text-xs font-medium px-4 py-2.5 rounded-xl transition-all border border-white/5 mr-1 shrink-0 active:scale-95"
        >
          {copied ? (
            <LuCheck className="w-4 h-4 text-green-500" />
          ) : (
            <LuCopy className="w-4 h-4" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>

        {/* Mobile Copy Button (Icon Only) */}
        <button
          onClick={copyToClipboard}
          className="md:hidden flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 text-foreground rounded-xl transition-all border border-white/5 mr-1 shrink-0 active:scale-95"
        >
          {copied ? (
             <LuCheck className="w-4 h-4 text-green-500" />
          ) : (
             <LuCopy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
