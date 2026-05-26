import { useRef, useState, useCallback } from "react";
import { TitleBar } from "../../components/layout/TitleBar";
import { ActivityBar } from "../../components/layout/ActivityBar";
import { StatusBar } from "../../components/layout/StatusBar";
import { FileExplorer } from "./panels/FileExplorer";
import { ChatPanel } from "./panels/ChatPanel";
import { EditorPanel } from "./panels/EditorPanel";
import { PreviewPanel } from "./panels/PreviewPanel";
import { DevToolsPanel } from "./panels/DevToolsPanel";
import { useSettingsStore } from "../../stores/settings.store";

const MIN_SIDEBAR  = 160;
const MAX_SIDEBAR  = 480;
const MIN_PREVIEW  = 240;
const MIN_TERMINAL = 80;
const MAX_TERMINAL = 500;
const DEFAULT_TERMINAL_H = 220;

export function IDELayout() {
  const {
    sidebarVisible,
    previewVisible,
    activeSidebarPanel,
    devToolsMode,
    setDevToolsMode,
  } = useSettingsStore();

  const [sidebarWidth,   setSidebarWidth]   = useState(240);
  const [previewWidth,   setPreviewWidth]   = useState(360);
  const [terminalHeight, setTerminalHeight] = useState(DEFAULT_TERMINAL_H);

  /* Tab-mode: which half is showing */
  const [devTabActive, setDevTabActive] = useState(false);

  /* ── drag resize ──────────────────────────────────────────── */
  const dragging  = useRef<"sidebar" | "preview" | "terminal" | null>(null);
  const startX    = useRef(0);
  const startY    = useRef(0);
  const startVal  = useRef(0);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (dragging.current === "sidebar")
      setSidebarWidth(Math.max(MIN_SIDEBAR,  Math.min(MAX_SIDEBAR,  startVal.current + e.clientX - startX.current)));
    if (dragging.current === "preview")
      setPreviewWidth(Math.max(MIN_PREVIEW,  Math.min(700,          startVal.current - (e.clientX - startX.current))));
    if (dragging.current === "terminal")
      setTerminalHeight(Math.max(MIN_TERMINAL, Math.min(MAX_TERMINAL, startVal.current - (e.clientY - startY.current))));
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = null;
    document.body.style.cursor = document.body.style.userSelect = "";
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup",   onMouseUp);
  }, [onMouseMove]);

  const startDrag = (which: "sidebar" | "preview" | "terminal", e: React.MouseEvent, cur: number) => {
    e.preventDefault();
    dragging.current  = which;
    startX.current    = e.clientX;
    startY.current    = e.clientY;
    startVal.current  = cur;
    document.body.style.cursor     = which === "terminal" ? "ns-resize" : "ew-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
  };

  /* ── derived ─────────────────────────────────────────────── */
  const isDocked = devToolsMode === "docked";
  const isFloat  = devToolsMode === "float";
  const isTab    = devToolsMode === "tab";
  const isHidden = devToolsMode === "hidden";

  /* height the docked panel occupies; 0 when not docked */
  const dockedVisible = isDocked;

  const handleModeChange = (m: "docked" | "float") => setDevToolsMode(m);
  const handleClose      = () => setDevToolsMode("hidden");

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <TitleBar />

      <div className="flex flex-1 overflow-hidden relative">
        <ActivityBar />

        {/* Sidebar */}
        {sidebarVisible && (
          <>
            <div
              className="flex flex-col overflow-hidden shrink-0"
              style={{
                width: `${sidebarWidth}px`,
                background: "var(--sidebar-bg)",
                borderRight: "1px solid var(--border-default)",
              }}
            >
              {activeSidebarPanel === "files"  && <FileExplorer />}
              {activeSidebarPanel === "search" && <SearchPanel />}
              {activeSidebarPanel === "chat"   && <ChatPanel />}
            </div>
            <ResizeHandle axis="ew" onMouseDown={(e) => startDrag("sidebar", e, sidebarWidth)} />
          </>
        )}

        {/* Center column */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">

          {/* Editor — always visible; in tab-mode it shares space with DevTools */}
          <div className="flex-1 overflow-hidden min-h-0">
            <EditorPanel
              showDevToolsTab={isTab}
              devToolsTabActive={isTab && devTabActive}
              onDevToolsTabClick={() => setDevTabActive((v) => !v)}
              devToolsContent={
                <DevToolsPanel
                  mode="docked"
                  onModeChange={handleModeChange}
                  dockedHeight="100%"
                  onClose={handleClose}
                />
              }
            />
          </div>

          {/* ── Docked DevTools: always in DOM, height animated ── */}
          <div
            style={{
              height: dockedVisible ? terminalHeight : 0,
              flexShrink: 0,
              overflow: "hidden",
              /* smooth slide in / out */
              transition: "height 0.24s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <DevToolsPanel
              mode="docked"
              onModeChange={handleModeChange}
              dockedHeight={terminalHeight}
              onClose={handleClose}
            />
          </div>

          {/* Resize handle only visible while docked panel is open */}
          <div
            style={{
              height: dockedVisible ? 4 : 0,
              flexShrink: 0,
              overflow: "hidden",
              order: -1,           /* sits above the docked panel */
              transition: "height 0.24s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <ResizeHandle
              axis="ns"
              onMouseDown={(e) => startDrag("terminal", e, terminalHeight)}
              full
            />
          </div>
        </div>

        {/* Preview */}
        {previewVisible && (
          <>
            <ResizeHandle axis="ew" onMouseDown={(e) => startDrag("preview", e, previewWidth)} />
            <div className="shrink-0 overflow-hidden" style={{ width: `${previewWidth}px` }}>
              <PreviewPanel />
            </div>
          </>
        )}

        {/* Floating DevTools overlay */}
        {isFloat && (
          <DevToolsPanel
            mode="float"
            onModeChange={handleModeChange}
            dockedHeight={terminalHeight}
            onClose={handleClose}
          />
        )}
      </div>

      <StatusBar />
    </div>
  );
}

/* ── Resize handle ───────────────────────────────────────────── */
function ResizeHandle({
  axis,
  onMouseDown,
  full,
}: {
  axis: "ew" | "ns";
  onMouseDown: (e: React.MouseEvent) => void;
  full?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={full ? "w-full h-full" : axis === "ew" ? "w-1 h-full shrink-0" : "h-1 w-full shrink-0"}
      style={{
        cursor: axis === "ew" ? "ew-resize" : "ns-resize",
        background: hovered ? "var(--accent-primary)" : "transparent",
        transition: "background 0.12s",
        zIndex: 10,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={onMouseDown}
    />
  );
}

/* ── Search sidebar ──────────────────────────────────────────── */
function SearchPanel() {
  return (
    <div className="flex flex-col h-full p-3">
      <div className="text-xs font-semibold uppercase tracking-wider mb-3"
        style={{ color: "var(--text-muted)" }}>
        Search
      </div>
      <input
        className="w-full rounded px-2 py-1.5 text-xs outline-none"
        placeholder="Search files..."
        style={{
          background: "var(--bg-elevated)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-default)",
        }}
      />
      <p className="mt-4 text-xs text-center" style={{ color: "var(--text-muted)" }}>
        Type to search across files
      </p>
    </div>
  );
}
