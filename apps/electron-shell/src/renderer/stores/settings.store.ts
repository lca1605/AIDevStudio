import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "vi";
export type DevToolsMode = "docked" | "tab" | "float" | "hidden";

interface SettingsState {
  language: Language;
  sidebarVisible: boolean;
  previewVisible: boolean;
  activeSidebarPanel: "files" | "search" | "chat";
  devToolsMode: DevToolsMode;
  /** last non-hidden mode so the activity-bar toggle remembers your preference */
  lastDevToolsMode: Exclude<DevToolsMode, "hidden">;

  setLanguage: (lang: Language) => void;
  setSidebarVisible: (v: boolean) => void;
  setPreviewVisible: (v: boolean) => void;
  setActiveSidebarPanel: (panel: "files" | "search" | "chat") => void;
  toggleSidebar: () => void;
  togglePreview: () => void;
  setDevToolsMode: (mode: DevToolsMode) => void;
  toggleDevTools: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: "en",
      sidebarVisible: true,
      previewVisible: true,
      activeSidebarPanel: "files",
      devToolsMode: "docked",
      lastDevToolsMode: "docked",

      setLanguage: (language) => set({ language }),
      setSidebarVisible: (sidebarVisible) => set({ sidebarVisible }),
      setPreviewVisible: (previewVisible) => set({ previewVisible }),
      setActiveSidebarPanel: (panel) => set({ activeSidebarPanel: panel }),
      toggleSidebar: () => set({ sidebarVisible: !get().sidebarVisible }),
      togglePreview: () => set({ previewVisible: !get().previewVisible }),

      setDevToolsMode: (mode) =>
        set({
          devToolsMode: mode,
          ...(mode !== "hidden" ? { lastDevToolsMode: mode } : {}),
        }),

      toggleDevTools: () => {
        const { devToolsMode, lastDevToolsMode } = get();
        if (devToolsMode === "hidden") {
          set({ devToolsMode: lastDevToolsMode });
        } else {
          set({ devToolsMode: "hidden" });
        }
      },
    }),
    { name: "ide-settings" }
  )
);
