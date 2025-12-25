import { memo, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDocsStore } from "@/stores/docsStore";
import {
  DocsSidebar,
  SnippetsView,
  TemplatesView,
  ModulesView,
} from "@/components/docs";

// Memoized sidebar to prevent re-renders when only content changes
const MemoizedSidebar = memo(DocsSidebar);

// Loading spinner for content area only
const ContentLoading = () => (
  <div className="flex items-center justify-center py-20">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted">Loading...</p>
    </div>
  </div>
);

const Docs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Use Zustand store
  const {
    activeTab,
    activeCategory,
    activeFramework,
    snippetsData,
    templatesData,
    modulesData,
    loading,
    setActiveTab,
    setActiveCategory,
    setActiveFramework,
    fetchSnippetsData,
    fetchTemplatesData,
    fetchModulesData,
  } = useDocsStore();

  // Determine active tab from URL
  useEffect(() => {
    const path = location.pathname.replace("/docs", "").replace(/^\//, "");
    if (path.startsWith("templates")) {
      setActiveTab("templates");
    } else if (path.startsWith("modules")) {
      setActiveTab("modules");
    } else {
      setActiveTab("snippets");
    }
  }, [location.pathname, setActiveTab]);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "snippets") {
      fetchSnippetsData(activeFramework);
    } else if (activeTab === "templates") {
      fetchTemplatesData();
    } else if (activeTab === "modules") {
      fetchModulesData();
    }
  }, [activeTab, activeFramework, fetchSnippetsData, fetchTemplatesData, fetchModulesData]);

  // Stable callback references
  const handleTabChange = useCallback(
    (tab: "snippets" | "templates" | "modules") => {
      setActiveTab(tab);
      navigate(`/docs/${tab === "snippets" ? "" : tab}`);
    },
    [navigate, setActiveTab]
  );

  const handleFrameworkChange = useCallback(
    (framework: "express" | "hono" | "elysia" | "shared") => {
      setActiveFramework(framework);
    },
    [setActiveFramework]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      setActiveCategory(category);
    },
    [setActiveCategory]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar - always visible, never shows loading state */}
      <MemoizedSidebar
        activeTab={activeTab}
        activeCategory={activeCategory}
        activeFramework={activeFramework}
        onTabChange={handleTabChange}
        onCategoryChange={handleCategoryChange}
        onFrameworkChange={handleFrameworkChange}
        snippetsData={snippetsData}
        templatesData={templatesData}
      />

      {/* Main Content - loading only affects this area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <ContentLoading />
          ) : (
            <>
              {/* Snippets View */}
              {activeTab === "snippets" && snippetsData && (
                <SnippetsView data={snippetsData} activeCategory={activeCategory} activeFramework={activeFramework} />
              )}

              {/* Templates View */}
              {activeTab === "templates" && templatesData && (
                <TemplatesView data={templatesData} activeCategory={activeCategory} />
              )}

              {/* Modules View */}
              {activeTab === "modules" && modulesData && (
                <ModulesView data={modulesData} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Docs;
