"use client";

import { useEffect, useState } from "react";
import { Menu, X, Phone, Calendar } from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { Logo } from "./logo";
import { LanguageSwitch, ThemeToggle } from "./controls";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavItem = { to: string; key: string };

const navItems: NavItem[] = [
  { to: "/services", key: "nav.services" },
  { to: "/about", key: "nav.about" },
  { to: "/pricing", key: "nav.pricing" },
  { to: "/blog", key: "nav.blog" },
  { to: "/success-stories", key: "nav.success" },
  { to: "/faq", key: "nav.faq" },
  { to: "/contact", key: "nav.contact" },
];

export function Header() {
  const { t, locale } = useLocale();
  const { path, navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function go(to: string) {
    navigate(to);
    setOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-background/0"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => go("/")}
          className="shrink-0"
          aria-label="Home"
        >
          <Logo />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = path === item.to || path.startsWith(item.to + "/");
            return (
              <button
                key={item.to}
                onClick={() => go(item.to)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                )}
              >
                {t(item.key)}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitch className="hidden sm:inline-flex" />
          <ThemeToggle />
          <Button
            size="sm"
            onClick={() => go("/booking")}
            className="hidden gap-1.5 md:inline-flex"
          >
            <Calendar className="h-4 w-4" />
            {t("action.bookConsult")}
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 lg:hidden"
                aria-label="Menu"
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </SheetTrigger>
            <SheetContent
              side={locale === "fa" ? "right" : "left"}
              className="w-[300px] p-0"
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border/60 p-4">
                  <Logo />
                  <button
                    onClick={() => setOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                  {navItems.map((item) => (
                    <button
                      key={item.to}
                      onClick={() => go(item.to)}
                      className="rounded-lg px-3 py-3 text-start text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
                    >
                      {t(item.key)}
                    </button>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 border-t border-border/60 p-4">
                  <div className="flex items-center justify-between">
                    <LanguageSwitch />
                    <ThemeToggle />
                  </div>
                  <Button onClick={() => go("/booking")} className="w-full gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {t("action.bookConsult")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => go("/assessment")}
                    className="w-full"
                  >
                    {t("action.freeAssessment")}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
