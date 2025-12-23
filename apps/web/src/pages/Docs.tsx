import { memo, useCallback } from "react";
import { useDocsData } from "../hooks/useDocsData";
import {
  DocsSidebar,
  SnippetsView,
  TemplatesView,
  ModulesView,
} from "../components/docs";

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
  const {
    activeTab,
    activeCategory,
    setActiveCategory,
    activeFramework,
    handleFrameworkChange,
    snippetsData,
    templatesData,
    modulesData,
    loading,
    handleTabChange,
  } = useDocsData();

  // Stable callback references
  const onCategoryChange = useCallback(
    (category: string) => setActiveCategory(category),
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
        onCategoryChange={onCategoryChange}
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
                <SnippetsView data={snippetsData} activeCategory={activeCategory} />
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
