import {
  GitBranch, Sun, Moon, Globe, CheckCircle,
  PanelBottom, Maximize2, LayoutTemplate,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useI18n } from "../../hooks/useI18n";
import { useSettingsStore } from "../../stores/settings.store";
import type { DevToolsMode } from "../../stores/settings.store";

function SbBtn({
  onClick, title, active, children,
}: {
  onClick: () => void;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center gap-1 px-2 py-0.5 rounded transition-all"
      style={{
        opacity: hovered || active ? 1 : 0.85,
        background:
          active    ? "rgba(255,255,255,0.22)" :
          hovered   ? "rgba(255,255,255,0.10)" : "transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

export function StatusBar() {
  const { toggleTheme, isDark } = useTheme();
  const { t, language, changeLanguage } = useI18n();
  const { devToolsMode, setDevToolsMode } = useSettingsStore();

  const switchMode = (m: Exclude<DevToolsMode, "hidden">) => {
    /* clicking active mode → hide */
    setDevToolsMode(devToolsMode === m ? "hidden" : m);
  };

  return (
    <div
      className="flex items-center justify-between px-2 shrink-0 gap-1"
      style={{
        height: "var(--statusbar-height)",
        background: "var(--statusbar-bg)",
        color: "white",
        fontSize: "11px",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-2">
        <SbBtn onClick={() => {}} title="Branch">
          <GitBranch size={11} />
          <span>main</span>
        </SbBtn>
        <div className="flex items-center gap-1" style={{ opacity: 0.8 }}>
          <CheckCircle size={11} />
          <span>{t("statusBar.ready")}</span>
        </div>
      </div>

      {/* Center: DevTools layout mode */}
      <div className="flex items-center gap-0.5">
        <span className="opacity-50 mr-1 text-[10px] uppercase tracking-wider select-none">
          DevTools
        </span>
        <SbBtn
          onClick={() => switchMode("docked")}
          title="Slide panel (docked)"
          active={devToolsMode === "docked"}
        >
          <PanelBottom size={11} />
          <span>Dock</span>
        </SbBtn>
        <SbBtn
          onClick={() => switchMode("tab")}
          title="Editor tab"
          active={devToolsMode === "tab"}
        >
          <LayoutTemplate size={11} />
          <span>Tab</span>
        </SbBtn>
        <SbBtn
          onClick={() => switchMode("float")}
          title="Floating window"
          active={devToolsMode === "float"}
        >
          <Maximize2 size={11} />
          <span>Float</span>
        </SbBtn>
      </div>

      {/* Right: language + theme */}
      <div className="flex items-center gap-0.5">
        <SbBtn
          onClick={() => changeLanguage(language === "en" ? "vi" : "en")}
          title={t("settings.language")}
        >
          <Globe size={11} />
          <span>{language === "en" ? "EN" : "VI"}</span>
        </SbBtn>
        <SbBtn onClick={toggleTheme} title={t("settings.theme")}>
          {isDark ? <Moon size={11} /> : <Sun size={11} />}
          <span>{isDark ? t("settings.dark") : t("settings.light")}</span>
        </SbBtn>
      </div>
    </div>
  );
}
