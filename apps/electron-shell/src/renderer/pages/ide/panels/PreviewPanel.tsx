import { useState } from "react";
import { RefreshCw, Monitor, Smartphone, Tablet, ExternalLink } from "lucide-react";
import { useI18n } from "../../../hooks/useI18n";
import { Tooltip } from "../../../components/ui/Tooltip";

type Device = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export function PreviewPanel() {
  const { t } = useI18n();
  const [device, setDevice] = useState<Device>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [url] = useState("about:blank");

  const devices: { id: Device; Icon: typeof Monitor; label: string }[] = [
    { id: "desktop", Icon: Monitor, label: "Desktop" },
    { id: "tablet", Icon: Tablet, label: "Tablet" },
    { id: "mobile", Icon: Smartphone, label: "Mobile" },
  ];

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "var(--panel-bg)", borderLeft: "1px solid var(--border-default)" }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-3 py-1.5 shrink-0 gap-2"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wider shrink-0"
          style={{ color: "var(--text-muted)" }}
        >
          {t("preview.title")}
        </span>

        {/* Device switcher */}
        <div
          className="flex items-center gap-0.5 rounded-md p-0.5"
          style={{ background: "var(--bg-elevated)" }}
        >
          {devices.map(({ id, Icon, label }) => (
            <Tooltip key={id} content={label} side="bottom">
              <button
                onClick={() => setDevice(id)}
                className="p-1 rounded transition-colors"
                style={{
                  color: device === id ? "var(--text-primary)" : "var(--text-muted)",
                  background: device === id ? "var(--bg-active)" : "transparent",
                }}
              >
                <Icon size={13} />
              </button>
            </Tooltip>
          ))}
        </div>

        <div className="flex items-center gap-0.5">
          <Tooltip content={t("preview.refresh")} side="bottom">
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="p-1 rounded"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <RefreshCw size={13} />
            </button>
          </Tooltip>
          <Tooltip content={t("preview.openBrowser")} side="bottom">
            <button
              className="p-1 rounded"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <ExternalLink size={13} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Preview area */}
      <div
        className="flex-1 flex items-start justify-center overflow-auto p-3"
        style={{ background: "var(--bg-base)" }}
      >
        <div
          key={refreshKey}
          style={{
            width: DEVICE_WIDTHS[device],
            maxWidth: "100%",
            height: "100%",
            background: "white",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--border-default)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "width 0.2s ease",
          }}
        >
          <div style={{ textAlign: "center", color: "#888", fontFamily: "sans-serif" }}>
            <Monitor size={40} strokeWidth={1} style={{ margin: "0 auto 12px" }} />
            <p style={{ fontSize: "13px" }}>Preview will appear here</p>
            <p style={{ fontSize: "11px", marginTop: "4px", opacity: 0.6 }}>
              Run your project to see the preview
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
