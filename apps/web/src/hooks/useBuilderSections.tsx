import { useTemplateBuilderStore } from "@/stores/builderStore";
import { getFeaturesByType } from "@/utils/builder";

// Imports from docs data
// @ts-ignore
import templatesIndex from "@/docs/templates/express/index.json";
// @ts-ignore
import featuresJson from "@/docs/templates/express/features.json";

import {
  LuBox,
  LuDatabase,
  LuShield,
  LuMail,
  LuUpload,
  LuServer,
  LuWrench,
  LuLock,
  LuTerminal,
} from "react-icons/lu";
import type { BuilderSection } from "@/types/builder";

// Icon mapping
const iconMap: Record<string, any> = {
  base: LuBox,
  database: LuDatabase,
  auth: LuLock,
  presets: LuShield,
  mailers: LuMail,
  uploads: LuUpload,
  tooling: LuWrench,
  other: LuServer,
};

export const useBuilderSections = (): BuilderSection[] => {
  const store = useTemplateBuilderStore();
  const { registry } = store;

  if (!registry) return [];

  const sections: BuilderSection[] = [];

  // Iterate over categories from index.json
  templatesIndex.categoryFiles.forEach((cat: any) => {
    // Special handling for features - it has subcategories
    if (cat.id === "features") {
      featuresJson.subcategories.forEach((sub: any) => {
        let type: "radio" | "checkbox" = "radio";
        let selectedValue: string | undefined;
        let selectedValues: string[] | undefined;
        let onSelect: (val: any) => void = () => {};
        let items: any[] = [];

        // Map subcategories to store
        switch (sub.id) {
          case "mailers":
            type = "radio";
            selectedValue = store.selectedMailer;
            onSelect = store.setSelectedMailer;
            items = getFeaturesByType(registry, "mailer");
            break;
          case "uploads":
            type = "radio";
            selectedValue = store.selectedUpload;
            onSelect = store.setSelectedUpload;
            items = getFeaturesByType(registry, "upload");
            break;
          case "other":
            type = "checkbox";
            selectedValues = store.selectedOtherFeatures;
            onSelect = (val: string) => {
              const current = store.selectedOtherFeatures;
              const next = current.includes(val)
                ? current.filter((v) => v !== val)
                : [...current, val];
              store.setSelectedOtherFeatures(next);
            };
            items = getFeaturesByType(registry, "other");
            break;
          // Add Tooling manually if it's not in features.json but present in registry
          default:
            // Fallback or ignore
            break;
        }

        // Explicitly check for Tooling if we want to ensure it appears
        // (Assuming it might be added to features.json later or we want to force it)

        if (items.length > 0) {
          sections.push({
            id: sub.id,
            title: sub.title,
            description: sub.description,
            icon: iconMap[sub.id] || LuTerminal,
            type,
            items: [
              // Add "None" option for radio groups
              ...(type === "radio"
                ? [
                    {
                      label: "None",
                      description: `Skip ${sub.title.toLowerCase()}`,
                      value: "",
                    },
                  ]
                : []),
              ...items.map((item) => ({
                label: item.name,
                description: item.description,
                value: item.name,
              })),
            ],
            selectedValue: type === "radio" ? selectedValue : undefined,
            selectedValues: type === "checkbox" ? selectedValues : undefined,
            onSelect,
          });
        }
      });

      // Manual check for Tooling since it might be missing from features.json
      const toolingItems = getFeaturesByType(registry, "tooling");
      if (toolingItems.length > 0) {
        sections.push({
          id: "tooling",
          title: "Tooling",
          description: "Linters and formatters",
          icon: LuWrench,
          type: "radio",
          selectedValue: store.selectedTooling,
          onSelect: store.setSelectedTooling,
          items: [
            { label: "None", description: "Skip tooling", value: "" },
            ...toolingItems.map((item) => ({
              label: item.name,
              description: item.description,
              value: item.name,
            })),
          ],
        });
      }
    } else {
      // Standard categories (base, database, auth, presets)
      let selectedValue = "";
      let onSelect: (val: string) => void = () => {};
      let items: any[] = [];

      switch (cat.id) {
        case "base":
          selectedValue = store.selectedBase;
          onSelect = store.setSelectedBase;
          items = registry.base;
          break;
        case "database":
          selectedValue = store.selectedDatabase;
          onSelect = store.setSelectedDatabase;
          items = registry.database;
          break;
        case "auth":
          selectedValue = store.selectedAuth;
          onSelect = store.setSelectedAuth;
          items = registry.auth;
          break;
        case "presets":
          selectedValue = store.selectedPreset;
          onSelect = store.setSelectedPreset;
          items = registry.presets;
          break;
      }

      sections.push({
        id: cat.id,
        title: cat.title,
        description: cat.description,
        icon: iconMap[cat.id] || LuBox,
        type: "radio",
        selectedValue,
        onSelect,
        items: [
          // Base doesn't have "None" usually, others might
          ...(cat.id !== "base" && cat.id !== "presets"
            ? [{ label: "None", description: "None selected", value: "" }]
            : []),
          // Presets "Default" option
          ...(cat.id === "presets"
            ? [
                {
                  label: "Default",
                  description: "Standard security headers",
                  value: "",
                },
              ]
            : []),

          ...(items || []).map((item) => ({
            label: item.name,
            description: item.description,
            value: item.name,
          })),
        ],
      });
    }
  });

  return sections;
};
