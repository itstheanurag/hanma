import { useDocsData } from "../hooks/useDocsData";
import {
  DocsSidebar,
  SnippetsView,
  TemplatesView,
  ModulesView,
} from "../components/docs";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted">Loading documentation...</p>
    </div>
  </div>
);

const Docs = () => {
  const {
    activeTab,
    activeCategory,
    setActiveCategory,
    snippetsData,
    templatesData,
    modulesData,
    loading,
    handleTabChange,
  } = useDocsData();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <DocsSidebar
        activeTab={activeTab}
        activeCategory={activeCategory}
        onTabChange={handleTabChange}
        onCategoryChange={setActiveCategory}
        snippetsData={snippetsData}
        templatesData={templatesData}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
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
        </div>
      </main>
    </div>
  );
};

export default Docs;
