import { LuGithub, LuMoon, LuSun } from "react-icons/lu";
import Logo from "./Logo";
import { useTheme } from "./ThemeContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/repos/itstheanurag/hanma"
        );

        if (!res.ok) return;

        const data = await res.json();
        setStars(data.stargazers_count);
      } catch (err) {
        console.error("Failed to fetch GitHub stars", err);
      }
    };

    fetchStars();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Logo className="text-foreground" size={32} />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Hanma
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/itstheanurag/hanma"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-medium text-muted hover:text-foreground transition-colors"
          >
            <LuGithub size={14} />
            <span>{stars ?? "—"} Stars</span>
          </a>

          <button
            onClick={toggleTheme}
            className="p-2 hover:text-foreground transition-colors rounded-md hover:bg-surface"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <LuSun size={18} /> : <LuMoon size={18} />}
          </button>

          <Link
            to="/docs"
            className="bg-secondary hover:brightness-90 text-black font-semibold text-sm px-4 py-2 rounded-md transition-all"
          >
            Docs
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
