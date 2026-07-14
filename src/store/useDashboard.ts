import { create } from "zustand";

interface DashboardState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed?: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: "dashboard",
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  isCollapsed: false,
  setIsCollapsed: (collapsed) =>
    set((state) => ({
      isCollapsed: collapsed !== undefined ? collapsed : !state.isCollapsed,
    })),
}));

