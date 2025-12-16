import { LuSearch, LuGithub, LuCopy, LuCheck } from "react-icons/lu";

const HeroBadge = () => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-medium text-foreground">
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      v1.0 Public Beta
    </div>
  );
};


const HeroHeading = () => {
  return (
    <div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
        Backend Snippets.
        <br />
        <span className="text-muted">Copy. Paste. Ship.</span>
      </h1>

      <p className="mt-6 text-lg text-muted max-w-xl leading-relaxed">
        Beautifully designed, secure, and production-ready backend snippets.
        Not a framework. Just code you can copy into your Express, Hono, or
        Elysia apps.
      </p>
    </div>
  );
};


const HeroSearch = () => {
  return (
    <div className="w-full max-w-xl">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary/50 to-purple-500/50 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
        <div className="relative bg-surface border border-border rounded-xl p-2 flex items-center gap-2 shadow-sm">
          <LuSearch className="text-muted ml-3" size={20} />
          <input
            type="text"
            placeholder="Search for Snippets..."
            className="w-full bg-transparent text-foreground placeholder-muted outline-none py-2"
          />
          <div className="hidden md:flex gap-1 text-[10px] font-mono text-muted border border-border px-2 py-1 rounded bg-background">
            <span className="text-xs">⌘</span>K
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-4 text-xs text-muted font-mono">
        <span className="font-semibold text-foreground">Popular:</span>
        {["Auth", "RateLimit", "Webhooks"].map((item) => (
          <span
            key={item}
            className="hover:text-foreground cursor-pointer underline decoration-border underline-offset-4"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};


const HeroActions = () => {
  return (
    <div className="flex flex-wrap gap-4 pt-4">
      <button className="bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
        Docs
      </button>

      <button className="flex items-center gap-2 bg-surface text-foreground px-6 py-3 rounded-lg font-medium hover:bg-surface-hover transition-colors border border-border">
        <LuGithub size={18} />
        Star on GitHub
      </button>
    </div>
  );
};


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


const HeroStats = () => {
  return (
    <div className="grid grid-cols-2 gap-px bg-border border border-border mt-8 rounded-lg overflow-hidden">
      {[
        { value: "200+", label: "Snippets" },
        { value: "Open", label: "Source" },
      ].map((stat) => (
        <div
          key={stat.label}
          className="bg-surface p-4 flex flex-col items-center justify-center text-center"
        >
          <div className="text-2xl font-bold text-foreground">
            {stat.value}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted font-semibold mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};



const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-secondary/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="grid lg:grid-cols-12 gap-0 lg:divide-x divide-border border-b border-border -mx-6 px-6 pb-12">
        <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-12">
          <HeroBadge />
          <HeroHeading />
          <HeroSearch />
          <HeroActions />
        </div>

        <div className="lg:col-span-5 hidden lg:block pl-12 pt-8 lg:pt-0">
          <HeroCodePreview />
          <HeroStats />
        </div>
      </div>
    </section>
  );
};

export default Hero;
