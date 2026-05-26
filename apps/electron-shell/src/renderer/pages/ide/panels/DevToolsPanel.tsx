import { useState, useRef, useCallback, useEffect } from "react";
import {
  Inspect,
  SquareCode,
  Network,
  Terminal,
  Minus,
  X,
  Maximize2,
  Minimize2,
  GripHorizontal,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Info,
  TriangleAlert,
  Circle,
  Trash2,
} from "lucide-react";
import { useSettingsStore } from "../../../stores/settings.store";

export type DevToolsMode = "docked" | "float";

/* ══════════════════════════════════════════════════════════════
   ELEMENTS tab — component / DOM inspector
══════════════════════════════════════════════════════════════ */

interface DomNode {
  tag: string;
  attrs?: Record<string, string>;
  children?: DomNode[];
}

const DOM_TREE: DomNode = {
  tag: "div", attrs: { class: "app", id: "root" },
  children: [
    {
      tag: "header", attrs: { class: "app-header" },
      children: [
        { tag: "h1", attrs: { class: "title" } },
        { tag: "nav", attrs: { class: "nav" }, children: [
          { tag: "a", attrs: { href: "/" } },
          { tag: "a", attrs: { href: "/about" } },
        ]},
      ],
    },
    {
      tag: "main", attrs: { class: "app-main" },
      children: [
        { tag: "section", attrs: { class: "hero" }, children: [
          { tag: "h2" },
          { tag: "p" },
          { tag: "button", attrs: { class: "btn btn-primary" } },
        ]},
      ],
    },
    { tag: "footer", attrs: { class: "app-footer" } },
  ],
};

function DomNodeRow({ node, depth = 0 }: { node: DomNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = (node.children?.length ?? 0) > 0;
  const attrs = node.attrs
    ? Object.entries(node.attrs).map(([k, v]) => `${k}="${v}"`).join(" ")
    : "";

  return (
    <div>
      <div
        className="flex items-center gap-0.5 py-0.5 rounded cursor-pointer text-xs"
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "var(--bg-hover)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}
        onClick={() => hasChildren && setOpen((v) => !v)}
      >
        {hasChildren ? (
          open ? <ChevronDown size={11} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
               : <ChevronRight size={11} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        ) : (
          <span className="w-3" />
        )}
        <span style={{ color: "var(--text-danger)" }}>&lt;</span>
        <span style={{ color: "#e06c75" }}>{node.tag}</span>
        {attrs && <span style={{ color: "#d19a66", marginLeft: 4 }}>{attrs}</span>}
        <span style={{ color: "var(--text-danger)" }}>{hasChildren ? ">" : " />"}</span>
      </div>
      {hasChildren && open && node.children?.map((child, i) => (
        <DomNodeRow key={i} node={child} depth={depth + 1} />
      ))}
      {hasChildren && open && (
        <div
          className="text-xs"
          style={{ paddingLeft: `${8 + depth * 14 + 16}px`, color: "var(--text-danger)" }}
        >
          &lt;/<span style={{ color: "#e06c75" }}>{node.tag}</span>&gt;
        </div>
      )}
    </div>
  );
}

const STYLES_MOCK = [
  { selector: ".app", props: [{ k: "display", v: "flex" }, { k: "flex-direction", v: "column" }, { k: "min-height", v: "100vh" }] },
  { selector: ".app-header", props: [{ k: "background", v: "#1f2937" }, { k: "padding", v: "1rem 2rem" }, { k: "color", v: "#f9fafb" }] },
  { selector: "button.btn", props: [{ k: "border-radius", v: "6px" }, { k: "padding", v: "0.5rem 1.25rem" }, { k: "cursor", v: "pointer" }] },
];

function ElementsTab() {
  const [selected, setSelected] = useState<string | null>("app-header");

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* DOM tree */}
      <div
        className="flex-1 overflow-auto py-1 font-mono"
        style={{ borderRight: "1px solid var(--border-default)" }}
      >
        <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider mb-1"
          style={{ color: "var(--text-muted)" }}>
          DOM
        </div>
        <DomNodeRow node={DOM_TREE} />
      </div>

      {/* Styles panel */}
      <div className="w-56 overflow-auto flex-shrink-0">
        <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider mb-1"
          style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)" }}>
          Styles
        </div>
        <div className="px-2 font-mono text-xs">
          {STYLES_MOCK.map((rule) => (
            <div key={rule.selector} className="mb-3">
              <div style={{ color: "#e06c75" }}>{rule.selector} <span style={{ color: "var(--text-muted)" }}>{"{"}</span></div>
              {rule.props.map(({ k, v }) => (
                <div key={k} style={{ paddingLeft: 12 }}>
                  <span style={{ color: "#61afef" }}>{k}</span>
                  <span style={{ color: "var(--text-muted)" }}>: </span>
                  <span style={{ color: "#98c379" }}>{v}</span>
                  <span style={{ color: "var(--text-muted)" }}>;</span>
                </div>
              ))}
              <div style={{ color: "var(--text-muted)" }}>{"}"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CONSOLE tab — JS console with log levels
══════════════════════════════════════════════════════════════ */

type LogLevel = "log" | "info" | "warn" | "error";

interface LogEntry {
  id: number;
  level: LogLevel;
  text: string;
  source: string;
  time: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: 1, level: "info",  text: "App initialized",                       source: "App.tsx:8",    time: "12:34:01" },
  { id: 2, level: "log",   text: "Router mounted",                        source: "router.tsx:14", time: "12:34:01" },
  { id: 3, level: "warn",  text: "React.StrictMode: double render",       source: "main.tsx:5",   time: "12:34:02" },
  { id: 4, level: "error", text: "Uncaught TypeError: Cannot read 'id'",  source: "Home.tsx:22",  time: "12:34:03" },
  { id: 5, level: "log",   text: "Fetched 12 items",                      source: "api.ts:48",    time: "12:34:04" },
];

const LOG_STYLE: Record<LogLevel, { color: string; bg: string; Icon: typeof Info }> = {
  log:   { color: "var(--text-secondary)", bg: "transparent",        Icon: Circle },
  info:  { color: "#61afef",               bg: "transparent",        Icon: Info },
  warn:  { color: "#d19a66",               bg: "rgba(209,154,102,.08)", Icon: TriangleAlert },
  error: { color: "var(--text-danger)",    bg: "rgba(248,81,73,.08)", Icon: AlertCircle },
};

function ConsoleTab() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<LogLevel | "all">("all");
  const counter = useRef(logs.length + 1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView(); }, [logs]);

  const submit = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const entry: LogEntry = {
      id: counter.current++,
      level: "log",
      text: `> ${text}`,
      source: "console",
      time: new Date().toLocaleTimeString("en", { hour12: false }),
    };
    setLogs((l) => [...l, entry]);
    setTimeout(() => {
      setLogs((l) => [...l, {
        id: counter.current++,
        level: "log",
        text: text === "1+1" ? "← 2" : text.startsWith("document") ? "← [object HTMLDocument]" : "← undefined",
        source: "console",
        time: new Date().toLocaleTimeString("en", { hour12: false }),
      }]);
    }, 120);
  };

  const visible = logs.filter((l) => filter === "all" || l.level === filter);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-2 py-1 shrink-0"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <button onClick={() => setLogs([])} className="p-0.5 rounded"
          title="Clear console"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <Trash2 size={13} />
        </button>
        <div className="flex items-center gap-1 ml-1">
          {(["all", "log", "info", "warn", "error"] as const).map((lvl) => (
            <button key={lvl} onClick={() => setFilter(lvl)}
              className="px-2 py-0.5 rounded text-xs capitalize"
              style={{
                background: filter === lvl ? "var(--bg-active)" : "transparent",
                color: filter === lvl ? "var(--text-primary)" : "var(--text-muted)",
              }}>
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto font-mono text-xs selectable">
        {visible.map((log) => {
          const s = LOG_STYLE[log.level];
          return (
            <div key={log.id} className="flex items-start gap-2 px-3 py-1 border-b"
              style={{ background: s.bg, borderColor: "var(--border-subtle)", color: s.color }}>
              <s.Icon size={11} className="mt-0.5 shrink-0" />
              <span className="flex-1 break-all">{log.text}</span>
              <span className="shrink-0 text-[10px]" style={{ color: "var(--text-muted)" }}>{log.source}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-1 px-3 py-1 shrink-0"
        style={{ borderTop: "1px solid var(--border-default)" }}>
        <span style={{ color: "var(--text-muted)" }}>&gt;</span>
        <input
          className="flex-1 bg-transparent outline-none text-xs font-mono selectable"
          style={{ color: "var(--text-primary)" }}
          placeholder="JavaScript expression…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NETWORK tab
══════════════════════════════════════════════════════════════ */

const NETWORK_REQS = [
  { method: "GET",  url: "/api/user/me",          status: 200, type: "json",  size: "1.2 kB", time: "42 ms" },
  { method: "GET",  url: "/api/projects",          status: 200, type: "json",  size: "8.7 kB", time: "118 ms" },
  { method: "POST", url: "/api/ai/generate",       status: 200, type: "json",  size: "3.4 kB", time: "1.2 s" },
  { method: "GET",  url: "/assets/index.css",      status: 304, type: "css",   size: "–",      time: "5 ms" },
  { method: "GET",  url: "/assets/index.js",       status: 304, type: "js",    size: "–",      time: "8 ms" },
  { method: "PUT",  url: "/api/projects/42/files", status: 204, type: "json",  size: "–",      time: "67 ms" },
  { method: "GET",  url: "/api/health",            status: 500, type: "json",  size: "0.1 kB", time: "12 ms" },
];

const METHOD_COLOR: Record<string, string> = {
  GET: "#61afef", POST: "#98c379", PUT: "#d19a66", DELETE: "#e06c75", PATCH: "#c678dd",
};

function NetworkTab() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto">
        {/* Header row */}
        <div className="flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-wider sticky top-0"
          style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", borderBottom: "1px solid var(--border-default)" }}>
          <span className="w-10">Method</span>
          <span className="flex-1">URL</span>
          <span className="w-10 text-right">Status</span>
          <span className="w-10 text-right">Type</span>
          <span className="w-12 text-right">Size</span>
          <span className="w-12 text-right">Time</span>
        </div>

        {NETWORK_REQS.map((req, i) => {
          const isError = req.status >= 400;
          const isSelected = selected === i;
          return (
            <div key={i} onClick={() => setSelected(isSelected ? null : i)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs cursor-pointer border-b"
              style={{
                borderColor: "var(--border-subtle)",
                background: isSelected ? "var(--bg-selected)" : isError ? "rgba(248,81,73,.05)" : "transparent",
                color: isError ? "var(--text-danger)" : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = isError ? "rgba(248,81,73,.05)" : "transparent"; }}
            >
              <span className="w-10 font-mono font-bold text-[10px]" style={{ color: METHOD_COLOR[req.method] ?? "var(--text-secondary)" }}>
                {req.method}
              </span>
              <span className="flex-1 truncate font-mono">{req.url}</span>
              <span className="w-10 text-right font-mono" style={{ color: isError ? "var(--text-danger)" : req.status === 304 ? "var(--text-muted)" : "var(--text-success)" }}>
                {req.status}
              </span>
              <span className="w-10 text-right" style={{ color: "var(--text-muted)" }}>{req.type}</span>
              <span className="w-12 text-right font-mono">{req.size}</span>
              <span className="w-12 text-right font-mono">{req.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TERMINAL tab (shell — kept separate from DevTools tabs)
══════════════════════════════════════════════════════════════ */

type TermLine = { type: "cmd" | "out" | "err"; text: string };

const INIT_LINES: TermLine[] = [
  { type: "out", text: "AI AppBuilder Terminal v1.0.0" },
  { type: "out", text: 'Type "help" for available commands.' },
  { type: "out", text: "" },
];

function TerminalTab() {
  const [lines, setLines]   = useState<TermLine[]>(INIT_LINES);
  const [input, setInput]   = useState("");
  const [hist,  setHist]    = useState<string[]>([]);
  const [histI, setHistI]   = useState(-1);
  const inputRef            = useRef<HTMLInputElement>(null);
  const bottomRef           = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView(); }, [lines]);

  const run = () => {
    const cmd = input.trim(); if (!cmd) return;
    setHist((h) => [cmd, ...h]); setHistI(-1); setInput("");
    const next: TermLine[] = [{ type: "cmd", text: `$ ${cmd}` }];
    if (cmd === "clear") { setLines(INIT_LINES); return; }
    else if (cmd === "help")
      next.push({ type: "out", text: "  clear · npm run dev · npm build · ls" });
    else if (cmd === "ls" || cmd === "dir")
      next.push({ type: "out", text: "  src/  package.json  tsconfig.json  README.md" });
    else if (cmd.startsWith("npm run dev"))
      next.push({ type: "out", text: "  VITE ready · http://localhost:5173/" });
    else
      next.push({ type: "err", text: `  command not found: ${cmd}` });
    setLines((l) => [...l, ...next]);
  };

  const keyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { run(); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(histI + 1, hist.length - 1);
      setHistI(i); setInput(hist[i] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = Math.max(histI - 1, -1);
      setHistI(i); setInput(i === -1 ? "" : hist[i]);
    }
  };

  const lc = (t: TermLine["type"]) =>
    t === "cmd" ? "var(--accent-hover)" : t === "err" ? "var(--text-danger)" : "var(--text-secondary)";

  return (
    <div className="flex-1 overflow-y-auto p-3 font-mono text-xs selectable"
      style={{ color: "var(--text-secondary)" }}
      onClick={() => inputRef.current?.focus()}>
      {lines.map((l, i) => (
        <div key={i} style={{ color: lc(l.type), lineHeight: 1.7 }}>{l.text || " "}</div>
      ))}
      <div className="flex items-center gap-1 mt-1">
        <span style={{ color: "#3fb950" }}>$</span>
        <input ref={inputRef} autoFocus spellCheck={false}
          className="flex-1 bg-transparent outline-none selectable"
          style={{ color: "var(--text-primary)", fontFamily: "inherit", fontSize: "inherit" }}
          value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={keyDown} />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Tab config — DevTools first, Terminal last
══════════════════════════════════════════════════════════════ */

type DevTab = "elements" | "console" | "network" | "terminal";

const TABS: { id: DevTab; label: string; Icon: React.ElementType; badge?: number }[] = [
  { id: "elements",  label: "Elements",  Icon: Inspect },
  { id: "console",   label: "Console",   Icon: SquareCode },
  { id: "network",   label: "Network",   Icon: Network },
  { id: "terminal",  label: "Terminal",  Icon: Terminal },
];

/* ══════════════════════════════════════════════════════════════
   Shared icon button
══════════════════════════════════════════════════════════════ */

function IconBtn({ onClick, title, children, danger }: {
  onClick?: () => void; title?: string; children: React.ReactNode; danger?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} title={title}
      className="p-1 rounded"
      style={{
        color: h ? (danger ? "white" : "var(--text-primary)") : "var(--text-muted)",
        background: h ? (danger ? "#f85149" : "var(--bg-hover)") : "transparent",
      }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main export
══════════════════════════════════════════════════════════════ */

interface DevToolsPanelProps {
  mode: DevToolsMode;
  onModeChange: (m: DevToolsMode) => void;
  dockedHeight: number | string;
  onClose: () => void;
}

export function DevToolsPanel({ mode, onModeChange, dockedHeight, onClose }: DevToolsPanelProps) {
  /* Start on Elements — the real DevTools default */
  const [activeTab, setActiveTab] = useState<DevTab>("elements");
  const [minimized, setMinimized] = useState(false);

  const [floatPos,  setFloatPos]  = useState({ x: 80, y: 80 });
  const [floatSize, setFloatSize] = useState({ w: 720, h: 320 });
  const dragging    = useRef(false);
  const resizing    = useRef(false);
  const dragStart   = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });
  const resizeStart = useRef({ mx: 0, my: 0, ow: 0, oh: 0 });

  const startDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: floatPos.x, oy: floatPos.y };
    const mv = (ev: MouseEvent) => {
      if (!dragging.current) return;
      setFloatPos({ x: Math.max(0, dragStart.current.ox + ev.clientX - dragStart.current.mx),
                    y: Math.max(0, dragStart.current.oy + ev.clientY - dragStart.current.my) });
    };
    const up = () => { dragging.current = false; window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
  }, [floatPos]);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    resizing.current = true;
    resizeStart.current = { mx: e.clientX, my: e.clientY, ow: floatSize.w, oh: floatSize.h };
    const mv = (ev: MouseEvent) => {
      if (!resizing.current) return;
      setFloatSize({ w: Math.max(400, resizeStart.current.ow + ev.clientX - resizeStart.current.mx),
                     h: Math.max(120, resizeStart.current.oh + ev.clientY - resizeStart.current.my) });
    };
    const up = () => { resizing.current = false; window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
  }, [floatSize]);

  const toggleDevTools = useSettingsStore((s) => s.toggleDevTools);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.ctrlKey && e.key === "`") { e.preventDefault(); toggleDevTools(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [toggleDevTools]);

  /* ── header ───────────────────────────────────────────────── */
  const header = (draggable = false) => (
    <div className="flex items-center shrink-0 select-none"
      style={{ height: 34, borderBottom: "1px solid var(--border-default)", background: "var(--bg-elevated)" }}>

      {draggable && (
        <div className="flex items-center justify-center px-2 cursor-grab active:cursor-grabbing h-full"
          style={{ color: "var(--text-muted)" }} onMouseDown={startDrag}>
          <GripHorizontal size={14} />
        </div>
      )}

      {/* Tab pills */}
      <div className="flex items-center h-full flex-1 overflow-x-auto">
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          /* Terminal tab gets a subtle divider to visually separate it */
          const isTerminal = id === "terminal";
          return (
            <button key={id} onClick={() => setActiveTab(id)}
              className="flex items-center gap-1.5 px-3 h-full text-xs shrink-0 relative"
              style={{
                color: active ? "var(--text-primary)" : "var(--text-muted)",
                borderRight: "1px solid var(--border-subtle)",
                borderLeft: isTerminal ? "1px solid var(--border-default)" : undefined,
                background: active ? "var(--panel-bg)" : "transparent",
              }}>
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: active && isTerminal ? "var(--text-muted)" : "var(--accent-primary)" }} />
              )}
              <Icon size={11} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 px-2">
        {mode === "docked"
          ? <IconBtn title="Float window" onClick={() => onModeChange("float")}><Maximize2 size={12} /></IconBtn>
          : <IconBtn title="Dock"         onClick={() => onModeChange("docked")}><Minimize2 size={12} /></IconBtn>}
        <IconBtn title="Minimize" onClick={() => setMinimized((v) => !v)}><Minus size={12} /></IconBtn>
        <IconBtn title="Close (Ctrl+`)" onClick={onClose} danger><X size={12} /></IconBtn>
      </div>
    </div>
  );

  /* ── body ─────────────────────────────────────────────────── */
  const body = () => (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "var(--panel-bg)" }}>
      {activeTab === "elements" && <ElementsTab />}
      {activeTab === "console"  && <ConsoleTab />}
      {activeTab === "network"  && <NetworkTab />}
      {activeTab === "terminal" && <TerminalTab />}
    </div>
  );

  /* ── FLOAT ────────────────────────────────────────────────── */
  if (mode === "float") {
    return (
      <div className="fixed z-50 flex flex-col overflow-hidden rounded-xl"
        style={{
          left: floatPos.x, top: floatPos.y,
          width: floatSize.w,
          height: minimized ? 34 : floatSize.h,
          background: "var(--panel-bg)",
          border: "1px solid var(--border-default)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          transition: "height 0.15s ease",
        }}>
        {header(true)}
        {!minimized && body()}
        {!minimized && (
          <div className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize"
            onMouseDown={startResize} style={{ zIndex: 10 }}>
            <svg width="10" height="10" viewBox="0 0 10 10"
              style={{ position: "absolute", bottom: 4, right: 4, opacity: 0.35, color: "var(--text-muted)" }}>
              <path d="M0 10L10 0M5 10L10 5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  /* ── DOCKED — height wrapper lives in IDELayout ───────────── */
  return (
    <div className="flex flex-col overflow-hidden"
      style={{
        height: minimized ? 34 : "100%",
        transition: "height 0.18s cubic-bezier(0.4,0,0.2,1)",
        borderTop: "1px solid var(--border-default)",
      }}>
      {header(false)}
      {!minimized && body()}
    </div>
  );
}
