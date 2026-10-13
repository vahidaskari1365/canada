"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Locale } from "./i18n";
import { t as translate, defaultLocale } from "./i18n";

/* ---------------- Locale ---------------- */

type LocaleContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/* ---------------- Router (hash-based) ---------------- */

type RouterValue = {
  path: string; // e.g. "/blog/some-slug"
  navigate: (to: string) => void;
  back: () => void;
};

const RouterContext = createContext<RouterValue | null>(null);

function parseHash(): string {
  if (typeof window === "undefined") return "/";
  const h = window.location.hash.replace(/^#/, "");
  if (!h) return "/";
  return h.startsWith("/") ? h : "/" + h;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  /* ----- locale ----- */
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      (localStorage.getItem("mb_locale") as Locale)) as Locale | null;
    if (stored === "fa" || stored === "en") {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") localStorage.setItem("mb_locale", l);
  }, []);

  const dir = locale === "fa" ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const t = useCallback((key: string) => translate(locale, key), [locale]);

  const localeValue = useMemo(
    () => ({ locale, dir, setLocale, t }),
    [locale, dir, setLocale, t]
  );

  /* ----- router ----- */
  const [path, setPath] = useState<string>("/");

  useEffect(() => {
    setPath(parseHash());
    const onHash = () => {
      setPath(parseHash());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((to: string) => {
    const target = to.startsWith("/") ? to : "/" + to;
    if (typeof window !== "undefined") {
      window.location.hash = target;
      // also handle same-path re-scroll
      if (parseHash() === target) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, []);

  const back = useCallback(() => {
    if (typeof window !== "undefined") window.history.back();
  }, []);

  const routerValue = useMemo(
    () => ({ path, navigate, back }),
    [path, navigate, back]
  );

  return (
    <LocaleContext.Provider value={localeValue}>
      <RouterContext.Provider value={routerValue}>
        {children}
      </RouterContext.Provider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within AppProvider");
  return ctx;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within AppProvider");
  return ctx;
}
