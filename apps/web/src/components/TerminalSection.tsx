import { useState } from 'react';
import { LuCopy, LuCheck, LuTerminal } from 'react-icons/lu';

const TerminalSection = () => {
  const [copied, setCopied] = useState(false);
  const installCommand = "npm install -g hanma";
  const addCommand = "npx hanma add express-v5-server src/lib/";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        <div className="order-2 lg:order-1 relative">
           {/* Terminal Window */}
           <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-zinc-800 font-mono text-sm relative z-10">
              {/* Header */}
              <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-black/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="text-zinc-500 text-xs flex items-center gap-1">
                   <LuTerminal size={10} />
                   bash
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 text-zinc-300">
                 
                 {/* Step 1: Help */}
                 <div className="opacity-50 hover:opacity-100 transition-opacity">
                    <div className="flex gap-2 text-zinc-100">
                        <span className="text-green-500 font-bold">➜</span>
                        <span className="text-cyan-500 font-bold">~</span>
                        <span>hanma help</span>
                    </div>
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

                 {/* Step 2: Init */}
                 <div className="opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex gap-2 text-zinc-100">
                        <span className="text-green-500 font-bold">➜</span>
                        <span className="text-cyan-500 font-bold">~</span>
                        <span>hanma init</span>
                    </div>
                    <div className="mt-1 pl-4 text-zinc-400">
                        <span>✓ Configuration initialized (Snippets.json)</span>
                    </div>
                 </div>

                 {/* Step 3: Add (Focus) */}
                 <div>
                    <div className="flex gap-2 text-zinc-100 items-center flex-wrap">
                        <span className="text-green-500 font-bold">➜</span>
                        <span className="text-cyan-500 font-bold">~</span>
                        <span className="text-white break-all">{addCommand}</span>
                    </div>
                    <div className="mt-2 pl-4 text-zinc-400 space-y-1">
                        <div className="flex justify-between items-center text-xs text-zinc-500">
                           <span>Resolving packages...</span>
                        </div>
                         <div className="text-zinc-300">
                            Installing <span className="text-yellow-400">express-v5-server</span>...
                        </div>
                        <div className="mt-2 space-y-1">
                           <div className="flex items-center gap-2 text-green-400">
                              <LuCheck size={14} />
                              <span>Created src/lib/server.ts</span>
                           </div>
                           <div className="flex items-center gap-2 text-green-400">
                              <LuCheck size={14} />
                              <span>Created src/lib/middleware/error.ts</span>
                           </div>
                        </div>
                    </div>
                 </div>

                 {/* Cursor */}
                 <div className="flex gap-2 text-zinc-100">
                        <span className="text-green-500 font-bold">➜</span>
                        <span className="text-cyan-500 font-bold">~</span>
                        <span className="w-2.5 h-5 bg-zinc-500 animate-pulse"></span>
                 </div>
              </div>
           </div>

           {/* Glow behind terminal */}
           <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 -z-10"></div>
        </div>

        <div className="order-1 lg:order-2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-medium text-foreground shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                CLI v1.0.4
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Your terminal is your superpower.
            </h2>
            
            <p className="text-muted text-lg leading-relaxed">
                Hanma comes with a powerful CLI to help you scaffold backend Snippets in seconds. 
                Specify the destination folder, and let us handle the rest.
            </p>

            <div className="flex flex-col gap-4">
                <div className="p-4 rounded-lg bg-surface border border-border hover:border-foreground/20 transition-colors">
                    <h3 className="font-semibold text-foreground mb-1">Init</h3>
                    <p className="text-sm text-muted">Initialize your project with a single command. We auto-detect your framework and set up the <code>Snippets.json</code> file.</p>
                </div>
                 <div className="p-4 rounded-lg bg-surface border border-border hover:border-foreground/20 transition-colors">
                    <h3 className="font-semibold text-foreground mb-1">Add</h3>
                    <p className="text-sm text-muted">
                        Download Snippets directly to your source folder. 
                        Example: <code className="bg-background px-1.5 py-0.5 rounded border border-border text-xs">src/lib/</code> indicates exactly where the files should live.
                    </p>
                </div>
            </div>

            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <button 
                    onClick={handleCopy}
                    className="relative w-full flex items-center justify-between p-4 bg-[#1e1e1e] text-zinc-300 rounded-lg border border-zinc-800 font-mono text-sm group-hover:border-zinc-700 transition-colors text-left"
                >
                    <span className="truncate pr-4">{installCommand}</span>
                    {copied ? <LuCheck size={16} className="text-green-400" /> : <LuCopy size={16} className="text-zinc-500 group-hover:text-zinc-300" />}
                </button>
            </div>
        </div>

      </div>
    </section>
  );
};

export default TerminalSection;