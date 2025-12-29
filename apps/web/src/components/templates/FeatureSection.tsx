import type { TemplateBlock } from "@/types/builder";
import { LuCheck, LuPlus } from "react-icons/lu";

interface FeatureSectionProps {
  number: number;
  title: string;
  items: TemplateBlock[];
  selected?: string; // For radio-like selection
  selectedList?: string[]; // For checkbox-like selection
  onSelect: (value: string) => void;
  type?: "radio" | "checkbox";
}

export function FeatureSection({
  number,
  title,
  items,
  selected,
  selectedList,
  onSelect,
  type = "radio",
}: FeatureSectionProps) {
  
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-sm font-bold border border-primary/20">
          {number}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pl-0 md:pl-11">
        {items.map((item) => {
          const isSelected =
            type === "radio"
              ? selected === item.name
              : selectedList?.includes(item.name);

          return (
            <div
              key={item.name}
              onClick={() => onSelect(item.name)}
              className={`
                relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3
                ${
                  isSelected
                    ? "bg-secondary/30 border-primary/50 ring-1 ring-primary/20"
                    : "bg-surface border-border hover:border-primary/50 hover:bg-surface/80"
                }
              `}
            >
              <div className="flex items-center justify-between">
                 <div className="font-semibold">{item.name}</div>
                 {isSelected ? (
                    <LuCheck className="w-4 h-4 text-primary" />
                 ) : (
                    <LuPlus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                 )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
