import { useState, useRef, useEffect } from "react";
import { Plus, X, ChevronDown } from "lucide-react";
import { useI18n } from "../../../hooks/useI18n";

interface TerminalLine {
  type: "command" | "output" | "error";
  text: string;
}

const INITIAL_LINES: TerminalLine[] = [
  { type: "output", text: "AI AppBuilder Terminal v1.0.0" },
  { type: "output", text: 'Type "help" for available commands.' },
  { type: "output", text: "" },
];

export function TerminalPanel() {
  const { t } = useI18n();
  const [lines, setLines] = useState<TerminalLine[]>(INITIAL_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [lines]);

  const run = () => {
    const cmd = input.trim();
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setHistIdx(-1);
    setInput("");

    const newLines: TerminalLine[] = [{ type: "command", text: `$ ${cmd}` }];

    if (cmd === "clear") {
      setLines(INITIAL_LINES);
      return;
    } else if (cmd === "help") {
      newLines.push(
        { type: "output", text: "  clear      - Clear terminal" },
        { type: "output", text: "  npm run dev - Start dev server" },
        { type: "output", text: "  npm build  - Build project" },
        { type: "output", text: "  ls         - List files" }
      );
    } else if (cmd === "ls" || cmd === "dir") {
      newLines.push(
        { type: "output", text: "  src/  package.json  tsconfig.json  README.md" }
      );
    } else if (cmd.startsWith("npm run dev")) {
      newLines.push(
        { type: "output", text: "  > dev" },
        { type: "output", text: "  VITE v6.3.5  ready in 312 ms" },
        { type: "output", text: "" },
        { type: "output", text: "  ➜  Local:   http://localhost:5173/" }
      );
    } else {
      newLines.push({ type: "error", text: `  command not found: ${cmd}` });
    }

    setLines((l) => [...l, ...newLines]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      run();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  };

  const lineColor = (type: TerminalLine["type"]) => {
    if (type === "command") return "var(--accent-hover)";
    if (type === "error") return "var(--text-danger)";
    return "var(--text-secondary)";
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "var(--panel-bg)", borderTop: "1px solid var(--border-default)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-1 shrink-0"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          {t("terminal.title")}
        </span>
        <div className="flex-1" />
        <button
          className="p-0.5 rounded"
          style={{ color: "var(--text-muted)" }}
          title={t("terminal.new")}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <Plus size={13} />
        </button>
        <button
          className="p-0.5 rounded"
          style={{ color: "var(--text-muted)" }}
          title={t("terminal.clear")}
          onClick={() => setLines(INITIAL_LINES)}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <X size={13} />
        </button>
        <button
          className="p-0.5 rounded"
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
          <ChevronDown size={13} />
        </button>
      </div>

      {/* Output */}
      <div
        className="flex-1 overflow-y-auto p-3 font-mono text-xs selectable"
        style={{ color: "var(--text-secondary)" }}
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ color: lineColor(line.type), lineHeight: "1.6" }}>
            {line.text || " "}
          </div>
        ))}
        {/* Input line */}
        <div className="flex items-center gap-1 mt-1">
          <span style={{ color: "var(--text-success, #3fb950)" }}>$</span>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none selectable"
            style={{ color: "var(--text-primary)", fontFamily: "inherit", fontSize: "inherit" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
