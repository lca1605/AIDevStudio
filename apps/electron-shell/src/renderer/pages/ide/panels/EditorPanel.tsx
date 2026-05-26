import { useState } from "react";
import { X, FileCode2, Code2, Terminal } from "lucide-react";
import { useI18n } from "../../../hooks/useI18n";

interface Tab {
  id: string;
  name: string;
  ext: string;
  content: string;
  modified?: boolean;
}

const DEMO_TABS: Tab[] = [
  {
    id: "1",
    name: "App.tsx",
    ext: "tsx",
    content: `import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>Hello, AI AppBuilder!</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
    </div>
  );
}

export default App;`,
  },
  {
    id: "2",
    name: "styles.css",
    ext: "css",
    content: `.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  font-family: sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  border: none;
  background: #0969da;
  color: white;
  cursor: pointer;
}`,
    modified: true,
  },
];

/* ── virtual DevTools tab id ── */
export const DEVTOOLS_TAB_ID = "__devtools__";

const EXT_COLORS: Record<string, string> = {
  tsx: "#61afef", ts: "#61afef", jsx: "#e5c07b",
  js: "#e5c07b", css: "#56b6c2", json: "#98c379", md: "#abb2bf",
};

function highlightCode(code: string, ext: string): string {
  const safe = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (ext === "css") {
    return safe
      .replace(/(\/\*[\s\S]*?\*\/)/g, `<span style="color:#5c6370">$1</span>`)
      .replace(/([.#]?[\w-]+)(\s*\{)/g, `<span style="color:#61afef">$1</span>$2`)
      .replace(/([\w-]+)(\s*:)/g, `<span style="color:#d19a66">$1</span>$2`)
      .replace(/:\s*([^;{}]+)/g, (_m, v: string) => `: <span style="color:#98c379">${v}</span>`);
  }
  return safe
    .replace(/(\/\/[^\n]*)/g, `<span style="color:#5c6370">$1</span>`)
    .replace(/\b(import|export|from|const|let|var|function|return|default|if|else|class|new|typeof)\b/g, `<span style="color:#c678dd">$1</span>`)
    .replace(/(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, `<span style="color:#98c379">$1$2$1</span>`)
    .replace(/\b(\d+)\b/g, `<span style="color:#d19a66">$1</span>`)
    .replace(/(&lt;\/?)([\w]+)/g, `$1<span style="color:#e06c75">$2</span>`)
    .replace(/\b([A-Z]\w+)\b/g, `<span style="color:#61afef">$1</span>`);
}

interface EditorPanelProps {
  /** If true, show a DevTools virtual tab in the tab bar */
  showDevToolsTab?: boolean;
  /** Called when user clicks the DevTools tab */
  onDevToolsTabClick?: () => void;
  /** True when DevTools tab is currently active (tab mode) */
  devToolsTabActive?: boolean;
  /** Content to render when DevTools tab is active */
  devToolsContent?: React.ReactNode;
}

export function EditorPanel({
  showDevToolsTab = false,
  onDevToolsTabClick,
  devToolsTabActive = false,
  devToolsContent,
}: EditorPanelProps) {
  const { t } = useI18n();
  const [tabs, setTabs] = useState<Tab[]>(DEMO_TABS);
  const [activeTab, setActiveTab] = useState(DEMO_TABS[0].id);

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = tabs.filter((t) => t.id !== id);
    setTabs(next);
    if (activeTab === id && next.length > 0) setActiveTab(next[next.length - 1].id);
  };

  const current = tabs.find((t) => t.id === activeTab);
  const showEditor = !devToolsTabActive;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--editor-bg)" }}>
      {/* Tab bar */}
      <div
        className="flex items-center overflow-x-auto shrink-0"
        style={{
          height: "var(--tab-height)",
          background: "var(--tab-inactive-bg)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        {/* File tabs */}
        {tabs.map((tab) => {
          const isActive = !devToolsTabActive && tab.id === activeTab;
          const color = EXT_COLORS[tab.ext] ?? "var(--text-secondary)";
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); onDevToolsTabClick && devToolsTabActive && onDevToolsTabClick(); }}
              className="flex items-center gap-1.5 px-3 h-full text-xs shrink-0 transition-colors relative group"
              style={{
                background: isActive ? "var(--tab-active-bg)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                borderRight: "1px solid var(--border-default)",
              }}
            >
              {isActive && (
                <span className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "var(--accent-primary)" }} />
              )}
              <FileCode2 size={12} style={{ color }} />
              <span>{tab.name}</span>
              {tab.modified && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-hover)" }} />
              )}
              <span
                onClick={(e) => closeTab(tab.id, e)}
                className="ml-1 opacity-0 group-hover:opacity-100 rounded p-0.5 hover:bg-white/10"
              >
                <X size={10} />
              </span>
            </button>
          );
        })}

        {/* DevTools virtual tab */}
        {showDevToolsTab && (
          <button
            onClick={onDevToolsTabClick}
            className="flex items-center gap-1.5 px-3 h-full text-xs shrink-0 transition-colors relative"
            style={{
              background: devToolsTabActive ? "var(--tab-active-bg)" : "transparent",
              color: devToolsTabActive ? "var(--text-primary)" : "var(--text-muted)",
              borderRight: "1px solid var(--border-default)",
            }}
          >
            {devToolsTabActive && (
              <span className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "var(--accent-primary)" }} />
            )}
            <Terminal size={12} style={{ color: devToolsTabActive ? "var(--accent-hover)" : undefined }} />
            DevTools
          </button>
        )}

        <div className="flex-1" />
      </div>

      {/* DevTools tab content */}
      {devToolsTabActive && devToolsContent ? (
        <div className="flex-1 overflow-hidden">{devToolsContent}</div>
      ) : showEditor && current ? (
        <div className="flex-1 overflow-auto selectable">
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-1 px-4 py-1 text-xs shrink-0 sticky top-0"
            style={{
              color: "var(--text-muted)",
              borderBottom: "1px solid var(--border-subtle)",
              background: "var(--editor-bg)",
              zIndex: 1,
            }}
          >
            <Code2 size={11} />
            <span>src</span>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>{current.name}</span>
          </div>

          {/* Code + line numbers */}
          <div className="flex font-mono text-xs leading-5">
            <div
              className="select-none text-right pr-4 pt-4 pb-4 shrink-0"
              style={{
                color: "var(--text-muted)",
                background: "var(--editor-bg)",
                minWidth: "48px",
                borderRight: "1px solid var(--border-subtle)",
              }}
            >
              {current.content.split("\n").map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <pre
              className="flex-1 p-4 overflow-x-auto"
              style={{ color: "var(--text-primary)", background: "var(--editor-bg)", margin: 0 }}
              dangerouslySetInnerHTML={{ __html: highlightCode(current.content, current.ext) }}
            />
          </div>
        </div>
      ) : (
        <div
          className="flex-1 flex flex-col items-center justify-center gap-3"
          style={{ color: "var(--text-muted)" }}
        >
          <FileCode2 size={40} strokeWidth={1} />
          <div className="text-center">
            <p className="font-medium" style={{ color: "var(--text-secondary)" }}>{t("editor.noFile")}</p>
            <p className="text-xs mt-1">{t("editor.noFileHint")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
