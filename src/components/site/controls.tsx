"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useLocale } from "@/lib/app-context";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("mb_theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("mb_theme", next ? "dark" : "light");
  }

  if (!mounted) {
    return <span className={`h-9 w-9 ${className}`} />;
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground ${className}`}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div
      className={`inline-flex items-center rounded-full border border-border/60 p-0.5 text-xs font-medium ${className}`}
    >
      <button
        onClick={() => setLocale("fa")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          locale === "fa"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        فا
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          locale === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}
