import { useMemo, memo } from "react";
import {
  LuBookOpen,
  LuSearch,
  LuZap,
  LuPackage,
  LuChevronDown,
  LuChevronRight,
} from "react-icons/lu";
import { CgChevronRight } from "react-icons/cg";
import { motion, AnimatePresence } from "motion/react";

import type {
  TabType,
  SnippetFramework,
  TemplatesData,
  FrameworkType,
} from "@/types/docs";
import { useUIStore } from "@/stores";
import { ThemeToggle } from "../theme/Toggle";
import { SiExpress, SiFastify, SiHono } from "react-icons/si";

interface DocsSidebarProps {
  activeTab: TabType;
  activeCategory: string;
  activeFramework: FrameworkType;
  onTabChange: (tab: TabType) => void;
  onNavigate: (
    tab: TabType,
    framework: FrameworkType,
    category?: string,
  ) => void;
  snippetsData: SnippetFramework | null;
  templatesData: TemplatesData | null;
}

const frameworks = [
  { id: "express" as FrameworkType, label: "Express", icon: SiExpress },
  { id: "hono" as FrameworkType, label: "Hono", icon: SiHono },
  { id: "elysia" as FrameworkType, label: "Elysia", icon: LuZap },
  { id: "fastify" as FrameworkType, label: "Fastify", icon: SiFastify },
  { id: "shared" as FrameworkType, label: "Shared", icon: LuPackage },
];

// Template frameworks (no "shared" for templates)
const templateFrameworks = [
  { id: "express" as FrameworkType, label: "Express", icon: SiExpress },
  { id: "hono" as FrameworkType, label: "Hono", icon: SiHono },
  { id: "elysia" as FrameworkType, label: "Elysia", icon: LuZap },
];

const DocsSidebarComponent = ({
  activeTab,
  activeCategory,
  activeFramework,
  onTabChange,
  onNavigate,
  snippetsData,
  templatesData,
}: DocsSidebarProps) => {
  // Use Zustand store for UI state
  const {
    searchQuery,
    setSearchQuery,
    expandedFramework,
    setExpandedFramework,
  } = useUIStore();

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!snippetsData?.categories || !searchQuery.trim()) {
      return snippetsData?.categories || [];
    }
    const query = searchQuery.toLowerCase();
    return snippetsData.categories.filter(
      (cat) =>
        cat.title.toLowerCase().includes(query) ||
        cat.id.toLowerCase().includes(query),
    );
  }, [snippetsData?.categories, searchQuery]);

  // Handle clicking on a framework header
  const handleFrameworkClick = (fw: FrameworkType) => {
    // Always expand and activate this framework
    setExpandedFramework(fw);
    onNavigate("snippets", fw);
  };

  // Handle clicking on a framework category
  const handleCategoryClick = (categoryId: string) => {
    onNavigate("snippets", activeFramework, categoryId);
  };

  // Handle clicking on a template framework
  const handleTemplateFrameworkClick = (fw: FrameworkType) => {
    onNavigate("templates", fw);
  };

  // Handle clicking on a template category
  const handleTemplateCategoryClick = (categoryId: string) => {
    onNavigate("templates", activeFramework, categoryId);
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
          <LuSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            size={16}
          />
          <input
            type="text"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Frameworks Section */}
        <div className="mb-2">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">
            Frameworks
          </div>

          {frameworks.map((fw) => {
            const Icon = fw.icon;
            // Only show as expanded if activeTab is snippets AND this framework is expanded
            const isExpanded =
              activeTab === "snippets" && expandedFramework === fw.id;
            const isActive =
              activeTab === "snippets" && activeFramework === fw.id;

            // Check if data matches current framework to avoid stale renders
            const hasData = snippetsData?.framework === fw.id;

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

                {/* Expanded Categories - with Animation */}
                <AnimatePresence>
                  {isExpanded && isActive && hasData && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-2">
                        {filteredCategories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Templates Section */}
        <div className="mb-2 mt-4">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">
            Templates
          </div>

          {templateFrameworks.map((fw) => {
            const Icon = fw.icon;
            const isExpanded =
              activeTab === "templates" && activeFramework === fw.id;
            const isActive =
              activeTab === "templates" && activeFramework === fw.id;

            return (
              <div key={`template-${fw.id}`} className="mb-1">
                <button
                  onClick={() => handleTemplateFrameworkClick(fw.id)}
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

                {/* Expanded Template Categories */}
                <AnimatePresence>
                  {isExpanded && templatesData && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-2">
                        {templatesData.categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleTemplateCategoryClick(cat.id)}
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Add-ons Section */}
        <div className="mb-2 mt-4">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">
            Add-ons
          </div>
          <button
            onClick={() => onTabChange("addons")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              activeTab === "addons"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            <LuPackage size={16} />
            Database, Auth & More
          </button>
        </div>

        {/* Modules Section */}
        <div className="mb-2 mt-4">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">
            Other
          </div>
          <button
            onClick={() => onTabChange("modules")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              activeTab === "modules"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            <LuPackage size={16} />
            Modules
          </button>
        </div>
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

export const DocsSidebar = memo(DocsSidebarComponent);
