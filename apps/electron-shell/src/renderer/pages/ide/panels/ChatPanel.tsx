import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, Sparkles } from "lucide-react";
import { useI18n } from "../../../hooks/useI18n";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_MSG: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm your AI assistant. Describe what you want to build and I'll help you create it.",
  timestamp: new Date(),
};

export function ChatPanel() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const send = () => {
    const text = input.trim();
    if (!text || isThinking) return;
    setInput("");
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setMessages((m) => [
        ...m,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I'll help you with: "${text}". This is a placeholder response — the AI engine will be connected soon.`,
          timestamp: new Date(),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-1.5 shrink-0"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} style={{ color: "var(--accent-hover)" }} />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            {t("sidebar.chat")}
          </span>
        </div>
        <button
          className="p-1 rounded"
          style={{ color: "var(--text-muted)" }}
          title={t("chat.clear")}
          onClick={() => setMessages([WELCOME_MSG])}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 selectable">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 mt-0.5"
              style={{
                background: msg.role === "assistant" ? "var(--accent-muted)" : "var(--bg-active)",
              }}
            >
              {msg.role === "assistant" ? (
                <Bot size={12} style={{ color: "var(--accent-hover)" }} />
              ) : (
                <User size={12} style={{ color: "var(--text-secondary)" }} />
              )}
            </div>
            <div
              className="max-w-[80%] px-3 py-2 rounded-lg text-xs"
              style={{
                background: msg.role === "assistant" ? "var(--bg-elevated)" : "var(--accent-primary)",
                color: msg.role === "assistant" ? "var(--text-primary)" : "white",
                borderRadius: msg.role === "assistant" ? "2px 8px 8px 8px" : "8px 2px 8px 8px",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex gap-2">
            <div
              className="flex items-center justify-center w-6 h-6 rounded-full shrink-0"
              style={{ background: "var(--accent-muted)" }}
            >
              <Bot size={12} style={{ color: "var(--accent-hover)" }} />
            </div>
            <div
              className="px-3 py-2 rounded-lg text-xs"
              style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
            >
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>•</span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="p-2 shrink-0"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <div
          className="flex items-end gap-2 rounded-lg px-3 py-2"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}
        >
          <textarea
            className="flex-1 resize-none bg-transparent text-xs outline-none selectable"
            style={{ color: "var(--text-primary)", minHeight: "20px", maxHeight: "120px" }}
            placeholder={t("chat.placeholder")}
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || isThinking}
            className="shrink-0 p-1.5 rounded-md transition-all"
            style={{
              background: input.trim() && !isThinking ? "var(--accent-primary)" : "var(--bg-active)",
              color: input.trim() && !isThinking ? "white" : "var(--text-muted)",
            }}
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
