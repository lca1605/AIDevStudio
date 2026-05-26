import { useEffect } from "react";
import { IDELayout } from "../pages/ide/IDELayout";
import { useThemeStore } from "../stores/theme.store";
import "../styles/globals.css";
import "../locales/i18n";

export default function App() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <IDELayout />;
}
