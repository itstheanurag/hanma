import { LuCheck } from "react-icons/lu";

export function OptionItem({ isSelected, onClick, label, description, type = "radio" }: any) {
  return (
    <button
      onClick={onClick}
      className="flex gap-3 p-3 rounded-lg hover:bg-secondary/50 text-left w-full"
    >
      <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${
        isSelected ? "bg-primary border-primary" : "border-muted"
      }`}>
        {isSelected && type === "checkbox" && <LuCheck className="w-3 h-3 text-black" />}
      </div>

      <div>
        <div className="text-sm font-medium">{label}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}
