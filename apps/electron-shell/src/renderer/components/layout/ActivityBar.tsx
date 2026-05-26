import { Files, Search, MessageSquare, Settings, SquareTerminal } from "lucide-react";
import { Tooltip } from "../ui/Tooltip";
import { useSettingsStore } from "../../stores/settings.store";
import { useI18n } from "../../hooks/useI18n";

type SidebarPanel = "files" | "search" | "chat";

const SIDEBAR_ITEMS: { id: SidebarPanel; Icon: typeof Files; labelKey: string }[] = [
  { id: "files",  Icon: Files,          labelKey: "sidebar.files" },
  { id: "search", Icon: Search,         labelKey: "sidebar.search" },
  { id: "chat",   Icon: MessageSquare,  labelKey: "sidebar.chat" },
];

function ActivityBtn({
  active,
  showAccent,
  tooltip,
  onClick,
  children,
}: {
  active?: boolean;
  showAccent?: boolean;
  tooltip: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip content={tooltip} side="right">
      <button
        onClick={onClick}
        className="relative flex items-center justify-center w-10 h-10 rounded-md transition-colors"
        style={{
          color: active ? "var(--text-primary)" : "var(--text-muted)",
          background: active ? "var(--bg-hover)" : "transparent",
        }}
        onMouseEnter={(e) => {
          if (!active)
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
        }}
        onMouseLeave={(e) => {
          if (!active)
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
        }}
      >
        {showAccent && (
          <span
            className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r"
            style={{ background: "var(--accent-primary)" }}
          />
        )}
        {children}
      </button>
    </Tooltip>
  );
}

export function ActivityBar() {
  const { t } = useI18n();
  const {
    activeSidebarPanel,
    sidebarVisible,
    setActiveSidebarPanel,
    setSidebarVisible,
    devToolsMode,
    toggleDevTools,
  } = useSettingsStore();

  const handleSidebarClick = (id: SidebarPanel) => {
    if (activeSidebarPanel === id && sidebarVisible) {
      setSidebarVisible(false);
    } else {
      setActiveSidebarPanel(id);
      setSidebarVisible(true);
    }
  };

  const devActive = devToolsMode !== "hidden";

  return (
    <div
      className="flex flex-col items-center justify-between py-2 shrink-0"
      style={{
        width: "var(--activity-bar-width)",
        background: "var(--activity-bar-bg)",
        borderRight: "1px solid var(--border-default)",
      }}
    >
      {/* Top: sidebar panels */}
      <div className="flex flex-col items-center gap-1">
        {SIDEBAR_ITEMS.map(({ id, Icon, labelKey }) => {
          const isActive = sidebarVisible && activeSidebarPanel === id;
          return (
            <ActivityBtn
              key={id}
              active={isActive}
              showAccent={isActive}
              tooltip={t(labelKey)}
              onClick={() => handleSidebarClick(id)}
            >
              <Icon size={18} />
            </ActivityBtn>
          );
        })}

        {/* DevTools toggle — separated by a small gap */}
        <div className="mt-2 w-6 border-t" style={{ borderColor: "var(--border-subtle)" }} />
        <Tooltip content="DevTools (Ctrl+`)" side="right">
          <button
            onClick={toggleDevTools}
            className="relative flex items-center justify-center w-10 h-10 rounded-md transition-all"
            style={{
              color: devActive ? "var(--accent-hover)" : "var(--text-muted)",
              background: devActive ? "var(--accent-muted)" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!devActive)
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
            }}
            onMouseLeave={(e) => {
              if (!devActive)
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            }}
          >
            {devActive && (
              <span
                className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r"
                style={{ background: "var(--accent-primary)" }}
              />
            )}
            <SquareTerminal size={18} />
          </button>
        </Tooltip>
      </div>

      {/* Bottom: settings */}
      <div className="flex flex-col items-center gap-1">
        <ActivityBtn tooltip={t("settings.title")} onClick={() => {}}>
          <Settings size={18} />
        </ActivityBtn>
      </div>
    </div>
  );
}
