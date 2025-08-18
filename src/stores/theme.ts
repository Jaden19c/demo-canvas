import { create } from "zustand";

type ThemeState = {
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  toggleScreenMode: () => void;
};

const useThemeStore = create<ThemeState>((set) => ({
  isFullscreen: true,
  setIsFullscreen: (value) => set({ isFullscreen: value }),
  toggleScreenMode: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),
}));

export default useThemeStore;
