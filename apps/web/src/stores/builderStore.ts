import { create } from "zustand";
import { LINKS } from "@/constants";
import type { TemplateRegistry } from "@/types/builder";

interface TemplateBuilderState {
  // data
  registry: TemplateRegistry | null;
  loading: boolean;
  error: string | null;

  // selections
  projectName: string;
  selectedBase: string;
  selectedDatabase: string;
  selectedAuth: string;
  selectedPreset: string;
  selectedMailer: string;
  selectedUpload: string;
  selectedTooling: string;
  selectedOtherFeatures: string[];

  // actions
  fetchRegistry: () => Promise<void>;
  reset: () => void;

  setProjectName: (name: string) => void;
  setSelectedBase: (v: string) => void;
  setSelectedDatabase: (v: string) => void;
  setSelectedAuth: (v: string) => void;
  setSelectedPreset: (v: string) => void;
  setSelectedMailer: (v: string) => void;
  setSelectedUpload: (v: string) => void;
  setSelectedTooling: (v: string) => void;
  setSelectedOtherFeatures: (v: string[]) => void;
}

export const useTemplateBuilderStore = create<TemplateBuilderState>(
  (set, get) => ({
    // initial state
    registry: null,
    loading: false,
    error: null,

    projectName: "my-app",
    selectedBase: "",
    selectedDatabase: "",
    selectedAuth: "",
    selectedPreset: "",
    selectedMailer: "",
    selectedUpload: "",
    selectedTooling: "",
    selectedOtherFeatures: [],

    // async actions
    fetchRegistry: async () => {
      if (get().registry) return; // prevent refetch

      set({ loading: true, error: null });

      try {
        const res = await fetch(LINKS.TEMPLATES_REGISTRY);
        if (!res.ok) throw new Error("Failed to fetch templates");

        const data: TemplateRegistry = await res.json();

        set({
          registry: data,
          selectedBase: data.base?.[0]?.name ?? "",
          loading: false,
        });
      } catch (err: any) {
        set({
          error: err.message ?? "Unknown error",
          loading: false,
        });
      }
    },

    // setters
    setProjectName: (projectName) => set({ projectName }),
    setSelectedBase: (selectedBase) => set({ selectedBase }),
    setSelectedDatabase: (selectedDatabase) => set({ selectedDatabase }),
    setSelectedAuth: (selectedAuth) => set({ selectedAuth }),
    setSelectedPreset: (selectedPreset) => set({ selectedPreset }),
    setSelectedMailer: (selectedMailer) => set({ selectedMailer }),
    setSelectedUpload: (selectedUpload) => set({ selectedUpload }),
    setSelectedTooling: (selectedTooling) => set({ selectedTooling }),
    setSelectedOtherFeatures: (selectedOtherFeatures) =>
      set({ selectedOtherFeatures }),

    // reset
    reset: () => {
      const { registry } = get();

      set({
        selectedBase: registry?.base?.[0]?.name ?? "",
        selectedDatabase: "",
        selectedAuth: "",
        selectedPreset: "",
        selectedMailer: "",
        selectedUpload: "",
        selectedTooling: "",
        selectedOtherFeatures: [],
      });
    },
  }),
);
