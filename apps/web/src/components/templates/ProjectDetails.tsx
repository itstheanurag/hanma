import { LuFolder } from "react-icons/lu";

interface ProjectDetailsProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProjectDetails({ value, onChange }: ProjectDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
           <LuFolder className="w-4 h-4" />
           Project Details
        </h2>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
          Project Name
        </label>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono"
            placeholder="my-hanma-app"
          />
        </div>
      </div>
    </div>
  );
}
