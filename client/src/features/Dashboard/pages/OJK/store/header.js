import { create } from 'zustand';

/**
 * Header Store (FINAL – FULL IMPORT MODE)
 * ======================================
 * - year
 * - activeQuarter (SINGLE)
 * - search
 * - export signal
 *
 * ❌ Tidak ada lifecycle quarter
 * ❌ Tidak ada availableQuarters
 */

// // VERSI LAMA USEHEADER
// export const useHeaderStore = create((set) => ({
//   // ======================
//   // FILTER STATE
//   // ======================
//   year: new Date().getFullYear(),
//   activeQuarter: 'q1',
//   search: '',

//   // ======================
//   // EXPORT SIGNAL
//   // ======================
//   exportRequestId: null,

//   // ======================
//   // ACTIONS
//   // ======================
//   setYear: (year) => set({ year }),

//   setActiveQuarter: (q) => set({ activeQuarter: q }),

//   setSearch: (search) => set({ search }),

//   requestExport: () => set({ exportRequestId: crypto.randomUUID() }),

//   resetExport: () => set({ exportRequestId: null }),
// }));

export const useHeaderStore = create((set) => ({
  year: new Date().getFullYear(),

  // ⬇️ FIX: quarter HARUS NUMBER
  activeQuarter: 1,

  search: '',
  exportRequestId: null,

  setYear: (year) => set({ year }),

  // ⬇️ FIX: pastikan number
  setActiveQuarter: (q) => set({ activeQuarter: Number(q) }),

  setSearch: (search) => set({ search }),

  requestExport: () => set({ exportRequestId: crypto.randomUUID() }),
  resetExport: () => set({ exportRequestId: null }),
}));
