import { create } from "zustand";

import type {
  SnippetFramework,
  SnippetCategory,
  TemplatesData,
  TemplateCategory,
  ModulesData,
  TabType,
  FrameworkType,
} from "../types/docs";

import {
  snippetIndexes,
  loadSnippetCategory,
  templatesIndex,
  templatesIndexes,
  loadTemplateCategory,
  addonsIndexData,
  loadAddonCategory,
  modulesData as modulesDataImport,
} from "@/utils/docsLoader";

interface DocsState {
  // Active selections
  activeTab: TabType;
  activeFramework: FrameworkType;
  activeCategory: string;

  // Data
  snippetsData: SnippetFramework | null;
  templatesData: TemplatesData | null;
  addonsData: TemplatesData | null;
  modulesData: ModulesData | null;

  // Loading state
  loading: boolean;

  // Cache for framework data
  frameworkCache: Map<FrameworkType, SnippetFramework>;
  templatesCache: Map<string, TemplatesData>;
}

interface DocsActions {
  // Setters
  setActiveTab: (tab: TabType) => void;
  setActiveFramework: (framework: FrameworkType) => void;
  setActiveCategory: (category: string) => void;
  setLoading: (loading: boolean) => void;

  // Data fetching
  fetchSnippetsData: (framework: FrameworkType) => Promise<void>;
  fetchTemplatesData: (framework?: string) => Promise<void>;
  fetchAddonsData: () => Promise<void>;
  fetchModulesData: () => Promise<void>;

  // Reset
  reset: () => void;
}

const initialState: DocsState = {
  activeTab: "snippets",
  activeFramework: "express",
  activeCategory: "",
  snippetsData: null,
  templatesData: null,
  addonsData: null,
  modulesData: null,
  loading: false,
  frameworkCache: new Map(),
  templatesCache: new Map(),
};

export const useDocsStore = create<DocsState & DocsActions>((set, get) => ({
  ...initialState,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveFramework: (framework) => set({ activeFramework: framework }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setLoading: (loading) => set({ loading }),

  fetchSnippetsData: async (framework) => {
    const { frameworkCache } = get();

    // Check cache first
    const cached = frameworkCache.get(framework);
    if (cached) {
      set({
        snippetsData: cached,
        loading: false,
        activeCategory: cached.categories?.[0]?.id || "",
      });
      return;
    }

    set({ loading: true });

    try {
      // Use static imports instead of fetch
      const indexData = snippetIndexes[framework];
      if (!indexData) {
        throw new Error(`No index found for framework: ${framework}`);
      }

      const categories: SnippetCategory[] = indexData.categoryFiles
        .map((catFile: { id: string; file: string }) =>
          loadSnippetCategory(framework, catFile.file),
        )
        .filter((cat: unknown): cat is SnippetCategory => cat !== null);

      const mergedData: SnippetFramework = {
        framework: indexData.framework || framework,
        version: indexData.version || "",
        title: indexData.title || "",
        description: indexData.description || "",
        installNote: indexData.installNote,
        concept: indexData.concept,
        examples: indexData.examples,
        categories,
      };

      // Update cache
      const newCache = new Map(frameworkCache);
      newCache.set(framework, mergedData);

      set({
        snippetsData: mergedData,
        frameworkCache: newCache,
        loading: false,
        activeCategory: categories?.[0]?.id || "",
      });
    } catch (err) {
      console.error("Failed to load snippets:", err);
      set({ loading: false });
    }
  },

  fetchTemplatesData: async (framework: string = "express") => {
    const { templatesCache } = get();

    // Check cache first
    const cached = templatesCache.get(framework);
    if (cached) {
      set({
        templatesData: cached,
        loading: false,
        activeCategory: cached.categories?.[0]?.id || "",
      });
      return;
    }

    set({ loading: true });

    try {
      // Use static imports instead of fetch
      const indexData = templatesIndexes[framework] || templatesIndex;
      if (!indexData) {
        throw new Error(`No templates index found for framework: ${framework}`);
      }

      const categories: TemplateCategory[] = indexData.categoryFiles
        .map(
          (catFile: { id: string; file: string }) =>
            loadTemplateCategory(catFile.file, framework) as TemplateCategory,
        )
        .filter((cat: unknown): cat is TemplateCategory => cat !== null);

      const mergedData: TemplatesData = {
        title: indexData.title || "",
        description: indexData.description || "",
        categories,
        examples: indexData.examples,
      };

      // Update cache
      const newCache = new Map(templatesCache);
      newCache.set(framework, mergedData);

      set({
        templatesData: mergedData,
        templatesCache: newCache,
        loading: false,
        activeCategory: categories?.[0]?.id || "",
      });
    } catch (err) {
      console.error("Failed to load templates:", err);
      set({ loading: false });
    }
  },

  fetchAddonsData: async () => {
    const { addonsData } = get();
    if (addonsData) return;

    set({ loading: true });

    try {
      const indexData = addonsIndexData;
      if (!indexData) {
        throw new Error("No add-ons index found");
      }

      const categories: TemplateCategory[] = indexData.categoryFiles
        .map(
          (catFile: { id: string; file: string }) =>
            loadAddonCategory(catFile.file) as TemplateCategory,
        )
        .filter((cat: unknown): cat is TemplateCategory => cat !== null);

      const mergedData: TemplatesData = {
        title: indexData.title || "",
        description: indexData.description || "",
        categories,
      };

      set({
        addonsData: mergedData,
        loading: false,
        activeCategory: categories?.[0]?.id || "",
      });
    } catch (err) {
      console.error("Failed to load add-ons:", err);
      set({ loading: false });
    }
  },

  fetchModulesData: async () => {
    const { modulesData } = get();
    if (modulesData) return;

    set({ loading: true });

    try {
      // Use static import instead of fetch
      const data = modulesDataImport as ModulesData;
      set({ modulesData: data, loading: false });
    } catch (err) {
      console.error("Failed to load modules:", err);
      set({ loading: false });
    }
  },

  reset: () => set(initialState),
}));
