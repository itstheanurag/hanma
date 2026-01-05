/**
 * Re-export shared types from @repo/schemas
 */
export type { TemplateBlock, TemplateRegistry } from "@repo/schemas";

/**
 * Web-specific builder UI types
 */

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
