export interface TemplateBlock {
  name: string;
  category: string;
  description: string;
  framework?: string;
  featureType?: string;
}

export interface TemplateRegistry {
  base: TemplateBlock[];
  database: TemplateBlock[];
  auth: TemplateBlock[];
  features: TemplateBlock[];
  presets: TemplateBlock[];
}

export interface TerminalDockProps {
  projectName: string;
  selectedBase: string;
  selectedDatabase: string;
  selectedAuth: string;
  selectedPreset: string;
  selectedMailer: string;
  selectedUpload: string;
  selectedTooling: string;
  selectedOtherFeatures: string[];
}

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
