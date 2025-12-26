export interface BuilderOption {
  label: string;
  description: string;
  value: string;
}

export interface BuilderSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  items: BuilderOption[];
  type: "radio" | "checkbox";
  selectedValue?: string;
  selectedValues?: string[];
  onSelect: (value: string) => void;
}

export * from "./builder";
