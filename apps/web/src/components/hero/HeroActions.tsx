import { GITHUB } from "@/constants";
import { LuGithub, LuSparkles } from "react-icons/lu";
import {Link } from "react-router-dom";

const HeroActions = () => {
  return (
    <div className="flex flex-wrap gap-4 pt-4">

      <Link
        to="/docs"
        className="bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        Docs
      </Link>

      <button onClick={() => window.open(GITHUB.REPO_URL, "noopener noreferrer")} className="flex items-center gap-2 bg-surface text-foreground px-6 py-3 rounded-lg font-medium hover:bg-surface-hover transition-colors border border-border cursor-pointer">
        <LuGithub size={18} />
        Star on GitHub
      </button>

      <Link
        to="/builder"
        className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-6 py-3 rounded-lg font-medium hover:bg-primary/20 transition-all shadow-sm shadow-primary/5"
      >
        <LuSparkles size={18} />
        Template Builder
      </Link>
    </div>
  );
};


export default HeroActions