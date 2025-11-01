/**
 * Global App Store (Zustand)
 * 
 * Manages global UI state such as active tab, theme, and user preferences.
 */

import { create } from 'zustand';

export type InboxTab = 'primary' | 'todos';
export type Theme = 'light' | 'dark' | 'auto';

interface AppState {
  // UI State
  activeTab: InboxTab;
  theme: Theme;
  isAIAssistantOpen: boolean;
  
  // User State
  isAuthenticated: boolean;
  userEmail: string | null;
  
  // Actions
  setActiveTab: (tab: InboxTab) => void;
  setTheme: (theme: Theme) => void;
  toggleAIAssistant: () => void;
  setAuthenticated: (isAuth: boolean, email?: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial State
  activeTab: 'primary',
  theme: 'auto',
  isAIAssistantOpen: false,
  isAuthenticated: false,
  userEmail: null,
  
  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setTheme: (theme) => set({ theme }),
  toggleAIAssistant: () => set((state) => ({ isAIAssistantOpen: !state.isAIAssistantOpen })),
  setAuthenticated: (isAuth, email) => set({ isAuthenticated: isAuth, userEmail: email || null }),
  logout: () => set({ isAuthenticated: false, userEmail: null }),
}));
