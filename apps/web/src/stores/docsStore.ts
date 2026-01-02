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
  loadSnippetIndex,
  loadSnippetCategory,
  loadTemplatesIndexData,
  loadTemplateCategoryData,
  loadAddonsIndex,
  loadAddonCategory,
  loadModulesData,
} from "@/utils/docsLoader";

interface DocsState {
  // Active selections
  activeTab: TabType;
  activeFramework: FrameworkType;
  activeCategory: string;

  // Data
  snippetsData: SnippetFramework | null;
  templatesData: TemplatesData | null;
  addonsData: SnippetFramework | null;
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
      // Use async loader with dynamic imports
      const indexData = await loadSnippetIndex(framework);
      if (!indexData) {
        throw new Error(`No index found for framework: ${framework}`);
      }

      // Load all categories in parallel
      const categoryPromises = indexData.categoryFiles.map(
        async (catFile: { id: string; file: string }) => {
          return loadSnippetCategory(framework, catFile.file);
        },
      );

      const loadedCategories = await Promise.all(categoryPromises);
      const categories: SnippetCategory[] = loadedCategories.filter(
        (cat: unknown): cat is SnippetCategory => cat !== null,
      );

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
      // Use async loader with dynamic imports
      const indexData = await loadTemplatesIndexData(
        framework as FrameworkType,
      );
      if (!indexData) {
        throw new Error(`No templates index found for framework: ${framework}`);
      }

      // Load all categories in parallel
      const categoryPromises = indexData.categoryFiles.map(
        async (catFile: { id: string; file: string }) => {
          return loadTemplateCategoryData(
            catFile.file,
            framework as FrameworkType,
          );
        },
      );

      const loadedCategories = await Promise.all(categoryPromises);
      const categories: TemplateCategory[] = loadedCategories.filter(
        (cat: unknown): cat is TemplateCategory => cat !== null,
      );

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
      const indexData = await loadAddonsIndex();
      if (!indexData) {
        throw new Error("No add-ons index found");
      }

      // Load all categories in parallel
      const categoryPromises = indexData.categoryFiles.map(
        async (catFile: { id: string; file: string }) => {
          return loadAddonCategory(catFile.file);
        },
      );

      const loadedCategories = await Promise.all(categoryPromises);
      const categories: SnippetCategory[] = loadedCategories.filter(
        (cat: unknown): cat is SnippetCategory => cat !== null,
      );

      const mergedData: SnippetFramework = {
        framework: indexData.framework || "shared",
        version: indexData.version || "v1",
        title: indexData.title || "Add-ons",
        description: indexData.description || "",
        installNote: indexData.installNote,
        concept: indexData.concept,
        examples: indexData.examples,
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
      // Use async loader with dynamic imports
      const data = (await loadModulesData()) as ModulesData;
      set({ modulesData: data, loading: false });
    } catch (err) {
      console.error("Failed to load modules:", err);
      set({ loading: false });
    }
  },

  reset: () => set(initialState),
}));
