import { create } from 'zustand';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem('eliteTheme');
  if (stored) return stored;
  return 'dark';
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    window.localStorage.setItem('eliteTheme', theme);
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('eliteTheme', next);
      return { theme: next };
    }),
}));
