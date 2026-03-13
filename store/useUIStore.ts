import { create } from 'zustand';

interface UIState {
  selectedWorkspaceId?: string;
  selectedProjectId?: string;
  setWorkspaceId: (id?: string) => void;
  setProjectId: (id?: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedWorkspaceId: undefined,
  selectedProjectId: undefined,
  setWorkspaceId: (id) => set({ selectedWorkspaceId: id }),
  setProjectId: (id) => set({ selectedProjectId: id })
}));
