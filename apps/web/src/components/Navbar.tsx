import { useEffect, memo } from "react";
import { LuGithub, LuMoon, LuSun } from "react-icons/lu";
import Logo from "./Logo";
import { useTheme } from "./theme/ThemeContext";
import { Link } from "react-router-dom";
import { useGithubStore } from "@/stores";
import { GITHUB } from "@/constants";

const NavbarComponent = () => {
  const { theme, toggleTheme } = useTheme();
  const { stars, fetchStats } = useGithubStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Logo className="text-foreground" size={32} />
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-medium text-purple-600 dark:text-purple-400">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Beta
          </div>
        </Link>

        <div className="flex items-center gap-4">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-surface hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <LuSun size={18} /> : <LuMoon size={18} />}
          </button>
          {/* Project actions */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full border border-border bg-surface">
            <a
              href={GITHUB.REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-muted hover:text-foreground transition-colors"
            >
              <LuGithub size={14} />
              <span>{stars} Stars</span>
            </a>

            <Link
              to="/docs"
              className="px-4 py-1.5 rounded-full bg-background text-foreground font-semibold text-xs hover:brightness-90 transition-all"
            >
              Docs
            </Link>
          </div>


        </div>

      </div>
    </nav>
  );
};

export default memo(NavbarComponent);
