import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): "dark" | "light" =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "system";
    }
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() => {
    if (theme === "system") return getSystemTheme();
    return theme as "dark" | "light";
  });

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    let actualTheme: "dark" | "light";

    if (newTheme === "system") {
      actualTheme = getSystemTheme();
    } else {
      actualTheme = newTheme;
    }

    root.classList.remove("light", "dark");
    root.classList.add(actualTheme);
    setResolvedTheme(actualTheme);
  }, []);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    },
    [applyTheme],
  );

  useEffect(() => {
    // Initial apply to ensure everything is in sync
    applyTheme(theme);

    // Sync across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        const newTheme = (e.newValue as Theme) || "system";
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };

    // System theme change listener
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    window.addEventListener("storage", handleStorage);
    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
