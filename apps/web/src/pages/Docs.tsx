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
    setActiveCategory,
    setActiveFramework,
    fetchSnippetsData,
    fetchTemplatesData,
    fetchAddonsData,
    fetchModulesData,
  } = useDocsStore();

  // Sync URL state to Zustand store
  useEffect(() => {
    setActiveFramework(urlState.framework);
    if (urlState.category) {
      setActiveCategory(urlState.category);
    }
  }, [
    urlState.framework,
    urlState.category,
    setActiveFramework,
    setActiveCategory,
  ]);

  // Fetch data based on URL state
  useEffect(() => {
    const fetchMap: Record<string, () => Promise<void>> = {
      snippets: () => fetchSnippetsData(urlState.framework),
      templates: () => fetchTemplatesData(urlState.framework),
      addons: fetchAddonsData,
      modules: fetchModulesData,
    };

    fetchMap[urlState.tab]?.();
  }, [
    urlState.tab,
    urlState.framework,
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
