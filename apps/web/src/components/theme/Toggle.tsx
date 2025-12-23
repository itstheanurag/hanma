import { LuSun, LuMoon } from "react-icons/lu";
import { useTheme } from "./ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (  
    <button
      onClick={toggleTheme}
      className="p-2 hover:text-foreground text-muted transition-colors rounded-md hover:bg-surface-hover"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <LuSun size={18} /> : <LuMoon size={18} />}
    </button>
  );
};