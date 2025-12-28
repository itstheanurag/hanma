import { LuSearch } from "react-icons/lu";

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

export default HeroSearch;
