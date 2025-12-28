import { LuCopy, LuCheck } from "react-icons/lu";

const HeroCodePreview = () => {
  return (
    <div className="border border-border bg-surface rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/50">
        <div className="flex gap-1.5">
          {["red", "yellow", "green"].map((c) => (
            <div
              key={c}
              className={`w-3 h-3 rounded-full bg-${c}-500/20 border border-${c}-500/50`}
            />
          ))}
        </div>
        <div className="text-xs text-muted font-mono">rate_limit.ts</div>
        <LuCopy size={14} className="text-muted hover:text-foreground cursor-pointer" />
      </div>

      <div className="p-4 overflow-x-auto bg-[#0c0c0e]">
        <pre className="text-xs md:text-sm font-mono leading-relaxed text-zinc-300">
          <span className="text-purple-400">import</span>{" "}
          {"{ RateLimiter }"}{" "}
          <span className="text-purple-400">from</span>{" "}
          <span className="text-green-400">'@hanma/core'</span>;
          <br /><br />
          <span className="text-purple-400">export const</span> limiter ={" "}
          <span className="text-blue-400">new</span> RateLimiter({"{"}
          <br />{"  "}window: <span className="text-orange-400">"1m"</span>,
          <br />{"  "}limit: <span className="text-orange-400">100</span>,
          <br />{"  "}storage: <span className="text-orange-400">"redis"</span>
          <br />{"}"});
        </pre>
      </div>

      <div className="border-t border-border bg-background/50 p-4 flex justify-between items-center">
        <span className="text-xs text-muted">TypeScript • 1.2kb</span>
        <span className="flex items-center gap-1 text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded">
          <LuCheck size={12} /> Production Ready
        </span>
      </div>
    </div>
  );
};

export default HeroCodePreview;
