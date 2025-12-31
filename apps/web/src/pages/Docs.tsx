import { memo, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDocsStore } from "@/stores/docsStore";
import {
  DocsSidebar,
  SnippetsView,
  TemplatesView,
  ModulesView,
} from "@/components/docs";
import ContentLoader from "@/components/loaders/ContentLoader";
import { parseDocsPath } from "@/utils/docsUrl";
import { useDocsActions } from "@/actions/docs.actions";

const MemoizedSidebar = memo(DocsSidebar);

const Docs = () => {
  const location = useLocation();
  const { handleTabChange, handleNavigate } = useDocsActions();

  // Parse URL to get current state
  const urlState = useMemo(
    () => parseDocsPath(location.pathname),
    [location.pathname],
  );

  const {
    snippetsData,
    templatesData,
    addonsData,
    modulesData,
    loading,
    activeFramework,
    activeCategory,
    setActiveCategory,
    setActiveFramework,
    fetchSnippetsData,
    fetchTemplatesData,
    fetchAddonsData,
    fetchModulesData,
  } = useDocsStore();

  // Optimize: Consolidate effects and check before updating
  useEffect(() => {
    // 1. Sync Store with URL
    const { framework, category, tab } = urlState;
    if (activeFramework !== framework) {
      setActiveFramework(framework);
    }
    if (category && activeCategory !== category) {
      setActiveCategory(category);
    }

    // 2. Fetch data if needed
    const fetchMap: Record<string, () => Promise<void>> = {
      snippets: () => {
        if (!snippetsData || snippetsData.framework !== framework) {
          return fetchSnippetsData(framework);
        }
        return Promise.resolve();
      },
      templates: () => {
        // Templates might be loaded but for a different framework?
        // Current implementation of fetchTemplatesData checks cache internally,
        // so calling it is safe, but we can avoid the call if we know the data is already there.
        // However, templatesData doesn't explicitly store 'framework' in the root object
        // in the current type definition (it just has title/desc).
        // We rely on the store's internal cache check.
        return fetchTemplatesData(framework);
      },
      addons: () => {
        if (!addonsData) return fetchAddonsData();
        return Promise.resolve();
      },
      modules: () => {
        if (!modulesData) return fetchModulesData();
        return Promise.resolve();
      },
    };

    fetchMap[tab]?.();
  }, [
    urlState,
    activeFramework,
    activeCategory,
    snippetsData,
    templatesData,
    addonsData,
    modulesData,
    setActiveFramework,
    setActiveCategory,
    fetchSnippetsData,
    fetchTemplatesData,
    fetchAddonsData,
    fetchModulesData,
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <MemoizedSidebar
        activeTab={urlState.tab}
        activeCategory={urlState.category}
        activeFramework={urlState.framework}
        onTabChange={(tab) => handleTabChange(tab, urlState.framework)}
        onNavigate={handleNavigate}
        snippetsData={snippetsData}
        templatesData={templatesData}
        addonsData={addonsData}
      />

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <ContentLoader />
          ) : (
            <>
              {urlState.tab === "snippets" && snippetsData && (
                <SnippetsView
                  data={snippetsData}
                  activeCategory={urlState.category}
                  activeFramework={urlState.framework}
                />
              )}

              {urlState.tab === "templates" && templatesData && (
                <TemplatesView
                  data={templatesData}
                  activeCategory={urlState.category}
                />
              )}

              {urlState.tab === "addons" && addonsData && (
                <SnippetsView
                  data={addonsData}
                  activeCategory={urlState.category}
                  activeFramework="shared"
                />
              )}

              {urlState.tab === "modules" && modulesData && (
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
