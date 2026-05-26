import { Bot, FolderOpen, Plus, Clock } from "lucide-react";
import { useI18n } from "../../hooks/useI18n";

export function WelcomePage() {
  const { t } = useI18n();

  return (
    <div
      className="flex flex-col items-center justify-center h-full"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      <div className="flex flex-col items-center gap-6 max-w-lg w-full px-8">
        {/* Logo */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--accent-muted)" }}
        >
          <Bot size={32} style={{ color: "var(--accent-hover)" }} />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{t("welcome.title")}</h1>
          <p style={{ color: "var(--text-secondary)" }}>{t("welcome.subtitle")}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "var(--accent-primary)",
              color: "white",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-primary)";
            }}
          >
            <Plus size={16} />
            {t("welcome.newProject")}
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)";
            }}
          >
            <FolderOpen size={16} />
            {t("welcome.openProject")}
          </button>
        </div>

        {/* Recent */}
        <div className="w-full">
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            {t("welcome.recentProjects")}
          </h2>
          <div
            className="flex flex-col items-center justify-center py-8 rounded-xl"
            style={{
              border: "1px dashed var(--border-default)",
              color: "var(--text-muted)",
            }}
          >
            <Clock size={20} strokeWidth={1.5} className="mb-2" />
            <p className="text-xs">{t("welcome.noRecent")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
