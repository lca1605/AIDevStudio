import { Sun, Moon, Globe, Check } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useI18n } from "../../hooks/useI18n";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { t, language, changeLanguage } = useI18n();

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      <div className="max-w-2xl w-full mx-auto p-8">
        <h1 className="text-xl font-semibold mb-8" style={{ color: "var(--text-primary)" }}>
          {t("settings.title")}
        </h1>

        {/* Theme */}
        <section className="mb-8">
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            {t("settings.theme")}
          </h2>
          <div className="flex gap-3">
            {(["dark", "light"] as const).map((th) => (
              <button
                key={th}
                onClick={() => setTheme(th)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl flex-1 transition-all"
                style={{
                  background: theme === th ? "var(--accent-muted)" : "var(--bg-surface)",
                  border: `2px solid ${theme === th ? "var(--accent-primary)" : "var(--border-default)"}`,
                }}
              >
                <div
                  className="w-full h-16 rounded-lg flex items-center justify-center"
                  style={{
                    background: th === "dark" ? "#0d1117" : "#ffffff",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  {th === "dark" ? (
                    <Moon size={20} style={{ color: "#e6edf3" }} />
                  ) : (
                    <Sun size={20} style={{ color: "#1f2328" }} />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {th === "dark" ? t("settings.dark") : t("settings.light")}
                  </span>
                  {theme === th && (
                    <Check size={14} style={{ color: "var(--accent-primary)" }} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Language */}
        <section className="mb-8">
          <h2
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            {t("settings.language")}
          </h2>
          <div className="flex gap-3">
            {(["en", "vi"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className="flex items-center gap-3 px-5 py-3 rounded-xl flex-1 transition-all"
                style={{
                  background: language === lang ? "var(--accent-muted)" : "var(--bg-surface)",
                  border: `2px solid ${language === lang ? "var(--accent-primary)" : "var(--border-default)"}`,
                }}
              >
                <Globe size={16} style={{ color: language === lang ? "var(--accent-hover)" : "var(--text-muted)" }} />
                <span className="text-sm font-medium">
                  {lang === "en" ? t("settings.english") : t("settings.vietnamese")}
                </span>
                <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>
                  {lang === "en" ? "EN" : "VI"}
                </span>
                {language === lang && (
                  <Check size={14} style={{ color: "var(--accent-primary)" }} />
                )}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
