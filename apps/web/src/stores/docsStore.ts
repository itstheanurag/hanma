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

interface DocsState {
  // Active selections
  activeTab: TabType;
  activeFramework: FrameworkType;
  activeCategory: string;

  // Data
  snippetsData: SnippetFramework | null;
  templatesData: TemplatesData | null;
  modulesData: ModulesData | null;

  // Loading state
  loading: boolean;

  // Cache for framework data
  frameworkCache: Map<FrameworkType, SnippetFramework>;
}

interface DocsActions {
  // Setters
  setActiveTab: (tab: TabType) => void;
  setActiveFramework: (framework: FrameworkType) => void;
  setActiveCategory: (category: string) => void;
  setLoading: (loading: boolean) => void;

  // Data fetching
  fetchSnippetsData: (framework: FrameworkType) => Promise<void>;
  fetchTemplatesData: () => Promise<void>;
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
  modulesData: null,
  loading: false,
  frameworkCache: new Map(),
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
      const indexRes = await fetch(`/docs/snippets/${framework}/index.json`);
      const indexData = await indexRes.json();

      const categoryPromises = indexData.categoryFiles.map(
        async (catFile: { id: string; file: string }) => {
          const res = await fetch(
            `/docs/snippets/${framework}/${catFile.file}`,
          );
          return res.json();
        },
      );

      const categories: SnippetCategory[] = await Promise.all(categoryPromises);

      const mergedData: SnippetFramework = {
        framework: indexData.framework,
        version: indexData.version,
        title: indexData.title,
        description: indexData.description,
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
      console.error("Failed to fetch snippets:", err);
      set({ loading: false });
    }
  },

  fetchTemplatesData: async () => {
    const { templatesData } = get();
    if (templatesData) return;

    set({ loading: true });

    try {
      const indexRes = await fetch("/docs/templates/express/index.json");
      const indexData = await indexRes.json();

      const categoryPromises = indexData.categoryFiles.map(
        async (catFile: { id: string; file: string }) => {
          const res = await fetch(`/docs/templates/express/${catFile.file}`);
          return res.json();
        },
      );

      const categories: TemplateCategory[] =
        await Promise.all(categoryPromises);

      const mergedData: TemplatesData = {
        title: indexData.title,
        description: indexData.description,
        categories,
        examples: indexData.examples,
      };

      set({
        templatesData: mergedData,
        loading: false,
        activeCategory: categories?.[0]?.id || "",
      });
    } catch (err) {
      console.error("Failed to fetch templates:", err);
      set({ loading: false });
    }
  },

  fetchModulesData: async () => {
    const { modulesData } = get();
    if (modulesData) return;

    set({ loading: true });

    try {
      const res = await fetch("/docs/modules/index.json");
      const data = await res.json();
      set({ modulesData: data, loading: false });
    } catch (err) {
      console.error("Failed to fetch modules:", err);
      set({ loading: false });
    }
  },

  reset: () => set(initialState),
}));
