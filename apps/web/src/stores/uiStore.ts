import { create } from "zustand";

interface UIState {
  // Sidebar state
  searchQuery: string;
  expandedFramework: string | null;

  // Card expansion state (track by ID)
  expandedCards: Set<string>;

  // FAQ state
  openFaqIndex: number | null;

  // Copy state (track by ID with timeout)
  copiedItems: Set<string>;
}

interface UIActions {
  // Sidebar
  setSearchQuery: (query: string) => void;
  setExpandedFramework: (framework: string | null) => void;

  // Cards
  toggleCardExpanded: (id: string) => void;
  isCardExpanded: (id: string) => boolean;

  // FAQ
  setOpenFaqIndex: (index: number | null) => void;
  toggleFaq: (index: number) => void;

  // Copy
  setCopied: (id: string) => void;
  isCopied: (id: string) => boolean;

  // Reset
  reset: () => void;
}

const initialState: UIState = {
  searchQuery: "",
  expandedFramework: "express",
  expandedCards: new Set(),
  openFaqIndex: 0,
  copiedItems: new Set(),
};

export const useUIStore = create<UIState & UIActions>((set, get) => ({
  ...initialState,

  // Sidebar actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setExpandedFramework: (framework) => set({ expandedFramework: framework }),

  // Card actions
  toggleCardExpanded: (id) => {
    const { expandedCards } = get();
    const newSet = new Set(expandedCards);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    set({ expandedCards: newSet });
  },
  isCardExpanded: (id) => get().expandedCards.has(id),

  // FAQ actions
  setOpenFaqIndex: (index) => set({ openFaqIndex: index }),
  toggleFaq: (index) => {
    const { openFaqIndex } = get();
    set({ openFaqIndex: openFaqIndex === index ? null : index });
  },

  // Copy actions
  setCopied: (id) => {
    const { copiedItems } = get();
    const newSet = new Set(copiedItems);
    newSet.add(id);
    set({ copiedItems: newSet });

    // Auto-remove after 2 seconds
    setTimeout(() => {
      const current = get().copiedItems;
      const updated = new Set(current);
      updated.delete(id);
      set({ copiedItems: updated });
    }, 2000);
  },
  isCopied: (id) => get().copiedItems.has(id),

  reset: () => set(initialState),
}));
