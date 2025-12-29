import { LuRocket, LuLayers } from "react-icons/lu";

interface BuilderSidebarProps {
  selectedFramework: string;
  selectedFeatures: string[];
}

export function BuilderSidebar({
  selectedFramework,
  selectedFeatures, // This will be a flattened list of all selected features
}: BuilderSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Smart Rec */}
      <div className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
               Smart Recommendation
             </span>
          </div>
          
          <p className="text-sm text-foreground/80 leading-relaxed italic">
            "Pairing <strong>{selectedFramework || "a framework"}</strong> with Swagger is highly recommended for type-safe API documentation."
          </p>
        </div>
      </div>

      {/* Stack Overview */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <LuLayers className="w-4 h-4" />
            Stack Overview
        </h3>

        <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Framework</span>
                <span className="text-sm font-medium">{selectedFramework || "None"}</span>
            </div>
            
            <div className="py-2">
                <span className="text-sm text-muted-foreground block mb-2">Features</span>
                <div className="flex flex-wrap gap-2">
                    {selectedFeatures.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">No features selected</span>
                    ) : (
                        selectedFeatures.map(f => (
                            <span key={f} className="text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground">
                                {f}
                            </span>
                        ))
                    )}
                </div>
            </div>

             <div className="flex items-center justify-between py-2 border-t border-border/50 mt-2">
                <span className="text-sm text-muted-foreground">Template Engine</span>
                <span className="text-sm font-medium text-green-400">TypeScript Native</span>
            </div>
        </div>
      </div>

      {/* Fast Deployment */}
      <div className="bg-surface/50 border border-border/50 border-dashed rounded-xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <LuRocket className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
            <div className="text-sm font-medium">Fast Deployment</div>
            <div className="text-xs text-muted-foreground">Pre-configured Docker & CI/CD</div>
        </div>
      </div>

    </div>
  );
}
