import { useMemo, memo } from "react";
import { LuBookOpen, LuSearch, LuPackage, LuSettings } from "react-icons/lu";
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
import { FRAMEWORKS, TEMPLATE_FRAMEWORKS } from "@/constants/docs.constants";
import { filterCategories } from "@/utils/docs.utils";
import { NavButton, SidebarSection, CategoryList } from "./SidebarSections";

interface DocsSidebarProps {
  activeTab: TabType;
  activeCategory: string;
  activeFramework: FrameworkType | "shared" | "tooling";
  onTabChange: (tab: TabType) => void;
  onNavigate: (
    tab: TabType,
    framework: FrameworkType | "shared" | "tooling",
    category?: string,
  ) => void;
  snippetsData: SnippetFramework | null;
  templatesData: TemplatesData | null;
  addonsData: SnippetFramework | null;
}

const DocsSidebarComponent = ({
  activeTab,
  activeCategory,
  activeFramework,
  onTabChange,
  onNavigate,
  snippetsData,
  templatesData,
  addonsData,
}: DocsSidebarProps) => {
  const {
    searchQuery,
    setSearchQuery,
    expandedFramework,
    setExpandedFramework,
  } = useUIStore();

  const filteredCategories = useMemo(() => {
    const data = activeTab === "addons" ? addonsData : snippetsData;
    return filterCategories(data, searchQuery);
  }, [snippetsData, addonsData, searchQuery, activeTab]);

  const isAddonsActive = activeTab === "addons";

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
        <SidebarSection title="Frameworks">
          {FRAMEWORKS.map((fw) => {
            const isExpanded =
              activeTab === "snippets" && expandedFramework === fw.id;
            const isActive =
              activeTab === "snippets" && activeFramework === fw.id;
            const hasData = snippetsData?.framework === fw.id;

            return (
              <div key={fw.id} className="mb-1">
                <NavButton
                  icon={fw.icon}
                  label={fw.label}
                  isActive={isActive}
                  isExpanded={isExpanded}
                  onClick={() => {
                    setExpandedFramework(fw.id);
                    onNavigate("snippets", fw.id);
                  }}
                />

                <AnimatePresence>
                  {isExpanded && isActive && hasData && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <CategoryList
                        categories={filteredCategories}
                        activeCategory={activeCategory}
                        onCategoryClick={(catId) =>
                          onNavigate("snippets", fw.id, catId)
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </SidebarSection>

        {/* Add-ons Section */}
        <SidebarSection>
          <NavButton
            icon={LuPackage}
            label="Add-ons"
            isActive={isAddonsActive}
            isExpanded={isAddonsActive}
            onClick={() => onTabChange("addons")}
          />
          <AnimatePresence>
            {isAddonsActive && addonsData && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <CategoryList
                  categories={filteredCategories}
                  activeCategory={activeCategory}
                  onCategoryClick={(catId) =>
                    onNavigate("addons", "shared", catId)
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </SidebarSection>

        {/* Templates Section */}
        <SidebarSection title="Templates">
          {TEMPLATE_FRAMEWORKS.map((fw) => {
            const isActive =
              activeTab === "templates" && activeFramework === fw.id;
            const isExpanded = isActive;

            return (
              <div key={`template-${fw.id}`} className="mb-1">
                <NavButton
                  icon={fw.icon}
                  label={fw.label}
                  isActive={isActive}
                  isExpanded={isExpanded}
                  onClick={() => onNavigate("templates", fw.id)}
                />
                <AnimatePresence>
                  {isExpanded && templatesData && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <CategoryList
                        categories={templatesData.categories}
                        activeCategory={activeCategory}
                        onCategoryClick={(catId) =>
                          onNavigate("templates", fw.id, catId)
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </SidebarSection>

        {/* Tooling Section */}
        <SidebarSection title="Tooling">
          <NavButton
            icon={LuSettings}
            label="Linters, Formatters & Config"
            isActive={activeTab === "tooling"}
            onClick={() => onTabChange("tooling")}
            showChevron={false}
          />
        </SidebarSection>

        {/* Other Section */}
        <SidebarSection title="Other">
          <NavButton
            icon={LuPackage}
            label="Modules"
            isActive={activeTab === "modules"}
            onClick={() => onTabChange("modules")}
            showChevron={false}
          />
        </SidebarSection>
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
