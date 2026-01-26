import { create } from "zustand";

export const useHeaderStore = create((set) => ({
  year: new Date().getFullYear(),
  activeQuarter: "q1",
  search: "",

  exportRequestId: null,

  setYear: (year) => set({ year }),

  setActiveQuarter: (q) => set({ activeQuarter: q }),

  setSearch: (search) => set({ search }),

  requestExport: () =>
    set({ exportRequestId: crypto.randomUUID() }),

  resetExport: () =>
    set({ exportRequestId: null }),
}));
