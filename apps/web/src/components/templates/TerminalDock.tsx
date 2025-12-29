import type { TerminalDockProps } from "@/types/builder";
import { generateCommand } from "@/utils/builder";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LuTerminal, LuCopy, LuCheck } from "react-icons/lu";

export default function TerminalDock(props: TerminalDockProps) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Small delay to trigger animation after mount
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const command = generateCommand(props);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return null;

  return createPortal(
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-[9999] transition-all duration-500 ease-out transform ${
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
                <span>npx hanma create</span>{" "}
                {props.projectName}
                
                {props.selectedBase && <span className="text-muted-foreground"> --server <span>{props.selectedBase}</span></span>}
                {props.selectedDatabase && <span className="text-muted-foreground"> --db <span>{props.selectedDatabase}</span></span>}
                {props.selectedAuth && <span className="text-muted-foreground"> --auth <span>{props.selectedAuth}</span></span>}
                {props.selectedPreset && <span className="text-muted-foreground"> --security <span>{props.selectedPreset}</span></span>}
                
                {props.selectedMailer && <span className="text-muted-foreground"> --mailer <span>{props.selectedMailer}</span></span>}
                {props.selectedUpload && <span className="text-muted-foreground"> --upload <span>{props.selectedUpload}</span></span>}
                {props.selectedTooling && <span className="text-muted-foreground"> --tooling <span>{props.selectedTooling}</span></span>}
                
                {props.selectedOtherFeatures.length > 0 && (
                   <span className="text-muted-foreground"> --features <span>{props.selectedOtherFeatures.join(",")}</span></span>
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
    </div>,
    document.body
  );
}
