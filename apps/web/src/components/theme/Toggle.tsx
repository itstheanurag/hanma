import { LuSun, LuMoon } from "react-icons/lu";
import { useTheme } from "./ThemeContext";
import { useCallback } from "react";

export const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    const isAppearanceTransition =
      // @ts-expect-error - document.startViewTransition is not in the type definition
      document.startViewTransition &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isAppearanceTransition) {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
      return;
    }

    const transition = document.startViewTransition(async () => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: ["inset(0 0 100% 0)", "inset(0 0 0 0)"],
        },
        {
          duration: 800,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }, [setTheme, resolvedTheme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:text-foreground text-muted transition-colors rounded-md hover:bg-surface-hover cursor-pointer"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <LuSun size={18} /> : <LuMoon size={18} />}
    </button>
  );
};
