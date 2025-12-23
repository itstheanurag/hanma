import { useState, useMemo } from "react";
import { LuBookOpen, LuSearch, LuDownload, LuServer, LuFlame, LuZap, LuPackage, LuChevronDown, LuChevronRight } from "react-icons/lu";
import { CgChevronRight } from "react-icons/cg";
import type { TabType, SnippetFramework, TemplatesData } from "../../types/docs";
import type { FrameworkType } from "../../hooks/useDocsData";
import { ThemeToggle } from "../theme/Toggle";

interface DocsSidebarProps {
  activeTab: TabType;
  activeCategory: string;
  activeFramework: FrameworkType;
  onTabChange: (tab: TabType) => void;
  onCategoryChange: (category: string) => void;
  onFrameworkChange: (framework: FrameworkType) => void;
  snippetsData: SnippetFramework | null;
  templatesData: TemplatesData | null;
}

const frameworks = [
  { id: "express" as FrameworkType, label: "Express", icon: LuServer, description: "Node.js framework" },
  { id: "hono" as FrameworkType, label: "Hono", icon: LuFlame, description: "Ultra-fast edge framework" },
  { id: "elysia" as FrameworkType, label: "Elysia", icon: LuZap, description: "Bun framework" },
  { id: "shared" as FrameworkType, label: "Shared", icon: LuPackage, description: "Framework-agnostic" },
];

export const DocsSidebar = ({
  activeTab,
  activeCategory,
  activeFramework,
  onTabChange,
  onCategoryChange,
  onFrameworkChange,
  snippetsData,
  templatesData,
}: DocsSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFramework, setExpandedFramework] = useState<FrameworkType | null>(activeFramework);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!snippetsData?.categories || !searchQuery.trim()) {
      return snippetsData?.categories || [];
    }
    const query = searchQuery.toLowerCase();
    return snippetsData.categories.filter(
      (cat) =>
        cat.title.toLowerCase().includes(query) ||
        cat.id.toLowerCase().includes(query)
    );
  }, [snippetsData?.categories, searchQuery]);

  const handleFrameworkClick = (fw: FrameworkType) => {
    if (expandedFramework === fw) {
      onFrameworkChange(fw);
    } else {
      // Expand and switch
      setExpandedFramework(fw);
      onFrameworkChange(fw);
    }
  };

  return (
    <aside className="w-full md:w-72 border-r border-border bg-surface sticky top-0 h-screen overflow-y-auto hidden md:flex flex-col">
      <div className="p-4 flex-1">
        {/* Header */}
        <h2 className="font-bold text-foreground mb-4 px-2 flex items-center gap-2">
          <LuBookOpen size={20} />
          Hanma Docs
        </h2>

        {/* Search Bar */}
        <div className="relative mb-4">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Installation Section */}
        <div className="mb-4">
          <button
            onClick={() => onTabChange("snippets")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              activeTab === "snippets" && activeCategory === "installation"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            <LuDownload size={16} />
            Installation
          </button>
        </div>

        {/* Frameworks Section */}
        <div className="mb-2">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">
            Frameworks
          </div>

          {frameworks.map((fw) => {
            const Icon = fw.icon;
            const isExpanded = expandedFramework === fw.id;
            const isActive = activeFramework === fw.id;

            return (
              <div key={fw.id} className="mb-1">
                <button
                  onClick={() => handleFrameworkClick(fw.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  <Icon size={16} />
                  <span className="flex-1">{fw.label}</span>
                  {isExpanded ? (
                    <LuChevronDown size={14} className="text-muted" />
                  ) : (
                    <LuChevronRight size={14} className="text-muted" />
                  )}
                </button>

                {/* Expanded Categories */}
                {isExpanded && isActive && snippetsData && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-2">
                    {filteredCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id)}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                          activeCategory === cat.id
                            ? "bg-secondary text-black font-medium"
                            : "text-muted hover:text-foreground hover:bg-surface-hover"
                        }`}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Templates Section */}
        <div className="mb-2 mt-4">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">
            Resources
          </div>
          <button
            onClick={() => onTabChange("templates")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              activeTab === "templates"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => onTabChange("modules")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              activeTab === "modules"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            Modules
          </button>
        </div>

        {/* Templates Categories (when templates tab is active) */}
        {activeTab === "templates" && templatesData && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-2">
            {templatesData.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                  activeCategory === cat.id
                    ? "bg-secondary text-black font-medium"
                    : "text-muted hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border bg-surface/50">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-2"
          >
            <CgChevronRight className="rotate-180" />
            Home
          </a>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};
