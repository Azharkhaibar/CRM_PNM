// import create from 'zustand'
// import { persist } from 'zustand/middleware'

// // Simple auth store with persistent storage (localStorage)
// // Fields: user (object|null), token (string|null), loading (boolean)
// // Actions: setUser, setToken, setLoading, login, logout

// export const useAuthStore = create(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       loading: false,

//       setUser: (user) => set({ user }),
//       setToken: (token) => set({ token }),
//       setLoading: (loading) => set({ loading }),

//       // convenience: set both user and token
//       login: (user, token) => set({ user, token }),

//       // logout clears everything
//       logout: () => set({ user: null, token: null }),
//     }),
//     {
//       name: 'auth-storage', // key in localStorage
//       // You can add a partialize or version if you need migrations
//     },
//   ),
// )

// export default useAuthStore
