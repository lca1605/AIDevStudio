import { Minus, Square, X, Bot } from "lucide-react";

export function TitleBar() {
  return (
    <div
      className="flex items-center justify-between px-3 shrink-0"
      style={{
        height: "var(--titlebar-height)",
        background: "var(--titlebar-bg)",
        borderBottom: "1px solid var(--border-default)",
        WebkitAppRegion: "drag" as never,
      }}
    >
      {/* App name */}
      <div
        className="flex items-center gap-2"
        style={{ WebkitAppRegion: "no-drag" as never }}
      >
        <Bot size={14} style={{ color: "var(--accent-hover)" }} />
        <span
          className="text-xs font-semibold tracking-wide"
          style={{ color: "var(--text-secondary)" }}
        >
          AI AppBuilder
        </span>
      </div>

      {/* Center - drag region */}
      <div className="flex-1" />

      {/* Window controls */}
      <div
        className="flex items-center gap-1"
        style={{ WebkitAppRegion: "no-drag" as never }}
      >
        <button
          className="flex items-center justify-center rounded-sm w-7 h-7 transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
          onClick={() => window.electron?.minimize?.()}
        >
          <Minus size={12} />
        </button>
        <button
          className="flex items-center justify-center rounded-sm w-7 h-7 transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
          onClick={() => window.electron?.maximize?.()}
        >
          <Square size={10} />
        </button>
        <button
          className="flex items-center justify-center rounded-sm w-7 h-7 transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#f85149";
            (e.currentTarget as HTMLButtonElement).style.color = "white";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
          }}
          onClick={() => window.electron?.close?.()}
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
