import { useEffect } from "react";
import { useTemplateBuilderStore } from "@/stores/builderStore";
import LoadingState from "@/components/templates/Loading";
import ErrorState from "@/components/templates/ErrorState";
import TerminalDock from "@/components/templates/TerminalDock";
import { ProjectDetails } from "@/components/templates/ProjectDetails";
import { FrameworkSelector } from "@/components/templates/FrameworkSelector";
import { FeatureSection } from "@/components/templates/FeatureSection";
import { BuilderSidebar } from "@/components/templates/BuilderSidebar";
import type { TemplateBlock } from "@/types/builder";

export default function TemplateBuilder() {
  const {
    fetchRegistry,
    loading,
    error,
    registry,
    
  // Selections
    projectName,
    selectedFramework,
    selectedBase,
    selectedDatabase,
    selectedAuth,
    selectedPreset,
    selectedMailer,
    selectedUpload,
    selectedTooling,
    selectedOtherFeatures,

    // Setters
    setProjectName,
    setSelectedFramework,
    setSelectedBase,
    setSelectedDatabase,
    setSelectedAuth,
    setSelectedMailer,
    setSelectedUpload,
    setSelectedTooling,
    setSelectedOtherFeatures,
  } = useTemplateBuilderStore();

  useEffect(() => {
    fetchRegistry();
  }, [fetchRegistry]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!registry) return null;

  // 1. Extract unique frameworks
  const frameworks: TemplateBlock[] = [];
  const seenFrameworks = new Set<string>();
  
  registry.base?.forEach((item) => {
    if (item.framework && !seenFrameworks.has(item.framework)) {
      seenFrameworks.add(item.framework);
      // Create a synthetic block for the framework selection
      frameworks.push({
        ...item,
        name: item.framework, // e.g. "express"
        description: `Build using ${item.framework.charAt(0).toUpperCase() + item.framework.slice(1)} framework`,
        category: "framework"
      });
    }
  });

  // 2. Filter Base Templates (Starters) based on selected framework
  const availableStarters = registry.base?.filter(
    (item) => item.framework === selectedFramework
  ) || [];

  // 3. Filter other features based on selected FRAMEWORK (not the specific template)
  const filterByFramework = (items: TemplateBlock[] = []) => {
    return items.filter(
      (item) => !item.framework || item.framework === selectedFramework
    );
  };

  const databases = filterByFramework(registry.database);
  const authProviders = filterByFramework(registry.auth);
  
  const allFeatures = filterByFramework(registry.features);

  const mailers = allFeatures.filter((f) => f.category === "mailer" || f.featureType === "mailer");
  const uploaders = allFeatures.filter((f) => f.category === "upload" || f.category === "storage" || f.featureType === "upload");
  const tooling = allFeatures.filter((f) => f.category === "tooling" || f.featureType === "tooling");
  
  const otherFeatures = allFeatures.filter(
    (f) => 
      !["mailer", "upload", "tooling", "storage"].includes(f.category) && 
      !["mailer", "upload", "tooling"].includes(f.featureType || "")
  );

  // Helper for multi-select toggle
  const toggleFeature = (value: string) => {
    if (selectedOtherFeatures.includes(value)) {
      setSelectedOtherFeatures(selectedOtherFeatures.filter((f) => f !== value));
    } else {
      setSelectedOtherFeatures([...selectedOtherFeatures, value]);
    }
  };

  // Helper for radio toggle (deselect if already selected)
  const toggleSelection = (
    currentValue: string,
    newValue: string,
    setter: (val: string) => void
  ) => {
    if (currentValue === newValue) {
      setter("");
    } else {
      setter(newValue);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen mt-24 relative bg-background text-foreground">
      
      {/* Header */}
      <div className="px-6 py-8 md:px-12 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Configure your stack</h1>
        <p className="text-muted-foreground">
          Select the best tools for your next big project.
        </p>
      </div>

      {/* Main Grid */}
      <div className="flex-1 px-6 pb-24 md:px-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Configuration) */}
        <div className="lg:col-span-2 space-y-12">
          
          <FrameworkSelector 
            items={frameworks}
            selected={selectedFramework}
            onSelect={setSelectedFramework}
          />
          
          {/* Starter Template Selection */}
          <FeatureSection
            number={3}
            title="Starter Template"
            items={availableStarters}
            selected={selectedBase}
            onSelect={(val) => toggleSelection(selectedBase, val, setSelectedBase)}
            type="radio"
          />

          <FeatureSection
            number={4}
            title="Database"
            items={databases}
            selected={selectedDatabase}
            onSelect={(val) => toggleSelection(selectedDatabase, val, setSelectedDatabase)}
            type="radio"
          />

          <FeatureSection
            number={5}
            title="Authentication"
            items={authProviders}
            selected={selectedAuth}
            onSelect={(val) => toggleSelection(selectedAuth, val, setSelectedAuth)}
            type="radio"
          />

           <FeatureSection
            number={6}
            title="Mailers"
            items={mailers}
            selected={selectedMailer}
            onSelect={(val) => toggleSelection(selectedMailer, val, setSelectedMailer)}
            type="radio"
          />

           <FeatureSection
            number={7}
            title="Upload Provders"
            items={uploaders}
            selected={selectedUpload}
            onSelect={(val) => toggleSelection(selectedUpload, val, setSelectedUpload)}
            type="radio"
          />

           <FeatureSection
            number={8}
            title="Tooling"
            items={tooling}
            selected={selectedTooling}
            onSelect={(val) => toggleSelection(selectedTooling, val, setSelectedTooling)}
            type="radio"
          />

           <FeatureSection
            number={9}
            title="Additional Features"
            items={otherFeatures}
            selectedList={selectedOtherFeatures}
            onSelect={toggleFeature}
            type="checkbox"
          />

        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
             <ProjectDetails 
                value={projectName} 
                onChange={setProjectName} 
             />

             <BuilderSidebar 
                selectedFramework={selectedBase}
                selectedFeatures={[
                    selectedDatabase, 
                    selectedAuth, 
                    selectedMailer,
                    selectedUpload,
                    selectedTooling,
                    ...selectedOtherFeatures
                ].filter(Boolean)}
             />
          </div>
        </div>

      </div>

      {/* Terminal Dock */}
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
