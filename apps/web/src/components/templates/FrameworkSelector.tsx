import type { TemplateBlock } from "@/types/builder";

interface FrameworkSelectorProps {
  items: TemplateBlock[];
  selected: string;
  onSelect: (value: string) => void;
}

export function FrameworkSelector({
  items,
  selected,
  onSelect,
}: FrameworkSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-sm font-bold border border-primary/20">
          2
        </div>
        <h2 className="text-xl font-semibold">Choose Framework</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 md:pl-11">
        {items.map((framework) => {
          const isSelected = selected === framework.name;
          return (
            <div
              key={framework.name}
              onClick={() => onSelect(framework.name)}
              className={`
                group relative p-5 rounded-xl border transition-all cursor-pointer
                ${
                  isSelected
                    ? "bg-secondary/30 border-primary/50 ring-1 ring-primary/20"
                    : "bg-surface border-border hover:border-primary/50 hover:bg-surface/80"
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded">
                  SELECTED
                </div>
              )}
              
              <div className="flex items-start gap-4">
                 {/* Placeholder for Icon if we had a mapping, for now just first letter */}
                 {/* In a real app we'd map framework.name to an icon component */}
                 <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold
                    ${isSelected ? 'bg-background text-primary' : 'bg-background border border-border'}
                 `}>
                    {framework.name[0].toUpperCase()}
                 </div>

                 <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{framework.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {framework.description}
                    </p>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
