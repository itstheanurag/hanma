import { useEffect } from "react";
import { useTemplateBuilderStore } from "@/stores/builderStore";
import { useBuilderSections } from "@/hooks/useBuilderSections";

// Components
import LoadingState from "@/components/templates/Loading";
import ErrorState from "@/components/templates/ErrorState";
import { CategoryCard } from "@/components/templates/CategoryCard";
import { OptionItem } from "@/components/templates/OptionItem";
import TerminalDock from "@/components/templates/TerminalDock";
import { LuRefreshCw } from "react-icons/lu";

export default function TemplateBuilder() {
  const {
    fetchRegistry,
    loading,
    error,
    registry,
    projectName,
    setProjectName,

    // Selectors for dock
    selectedBase,
    selectedDatabase,
    selectedAuth,
    selectedPreset,
    selectedMailer,
    selectedUpload,
    selectedTooling,
    selectedOtherFeatures,

    reset,
  } = useTemplateBuilderStore();

  const sections = useBuilderSections();

  useEffect(() => {
    fetchRegistry();
  }, [fetchRegistry]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!registry) return null;

  return (
    <div className="flex-1 flex flex-col min-h-screen mt-24 relative">
      {/* Top Controls */}
      <div className="px-6 py-8 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Configure your stack
          </h1>
          <p className="text-muted-foreground text-sm">
            Select the components for your new project.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
            placeholder="project-name"
          />
          <button
            onClick={reset}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-border transition-all"
          >
            <LuRefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Grid - Dynamic Rendering */}
      <div className="flex-1 px-6 pb-20 md:px-12 max-w-7xl mx-auto w-full">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="break-inside-avoid">
              <CategoryCard
                icon={section.icon}
                title={section.title}
                description={section.description}
              >
                {section.items.map((item: any) => (
                  <OptionItem
                    key={item.value || "none"}
                    label={item.label}
                    description={item.description}
                    type={section.type}
                    isSelected={
                      section.type === "radio"
                        ? section.selectedValue === item.value
                        : section.selectedValues?.includes(item.value)
                    }
                    onClick={() => section.onSelect(item.value)}
                  />
                ))}
              </CategoryCard>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Terminal Dock */}
      <TerminalDock
        projectName={projectName}
        selectedBase={selectedBase}
        selectedDatabase={selectedDatabase}
        selectedAuth={selectedAuth}
        selectedPreset={selectedPreset}
        selectedMailer={selectedMailer}
        selectedUpload={selectedUpload}
        selectedTooling={selectedTooling}
        selectedOtherFeatures={selectedOtherFeatures}
      />
    </div>
  );
}
