"use client";

import { Mail, Phone, MapPin, Linkedin, Instagram, Send } from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "./logo";

const footerServices = [
  { slug: "express-entry", fa: "اکسپرس اینتری", en: "Express Entry" },
  { slug: "pnp", fa: "برنامه استانی (PNP)", en: "Provincial Nominee" },
  { slug: "study-permit", fa: "ویزای تحصیلی", en: "Study Permit" },
  { slug: "work-permit", fa: "ویزای کار", en: "Work Permit" },
  { slug: "family-sponsorship", fa: "اسپانسر خانوادگی", en: "Family Sponsorship" },
  { slug: "startup-visa", fa: "ویزای استارتاپ", en: "Start-up Visa" },
];

const footerLinks = [
  { to: "/about", key: "nav.about" },
  { to: "/team", key: "nav.team" },
  { to: "/success-stories", key: "nav.success" },
  { to: "/blog", key: "nav.blog" },
  { to: "/faq", key: "nav.faq" },
  { to: "/contact", key: "nav.contact" },
  { to: "/privacy", key: "Privacy" },
  { to: "/terms", key: "Terms" },
];

export function Footer({ settings }: { settings?: Record<string, string> }) {
  const { t, locale } = useLocale();
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success(locale === "fa" ? "عضو خبرنامه شدید!" : "Subscribed!");
        setEmail("");
      } else {
        toast.error(locale === "fa" ? "خطا در عضویت" : "Subscription failed");
      }
    } catch {
      toast.error(locale === "fa" ? "خطا در عضویت" : "Subscription failed");
    }
  }

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="col-span-2 md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("footer.about")}
            </p>
            <form onSubmit={subscribe} className="mt-6">
              <p className="text-sm font-medium">
                {t("footer.newsletter")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("footer.newsletterDesc")}
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="h-10 flex-1 rounded-lg border border-border/60 bg-background px-3 text-sm outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.97]"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("footer.subscribe")}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("footer.services")}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {footerServices.map((s) => (
                <li key={s.slug}>
                  <button
                    onClick={() => navigate(`/services/${s.slug}`)}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {locale === "fa" ? s.fa : s.en}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("footer.company")}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.map((l) => (
                <li key={l.to}>
                  <button
                    onClick={() => navigate(l.to)}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.key.startsWith("nav.") ? t(l.key) : l.key}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {t("footer.contact")}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span dir="ltr">{settings?.["site.phone"] || "+1 (416) 555-0142"}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{settings?.["site.email"] || "hello@maplebridge.ca"}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  {locale === "fa"
                    ? settings?.["site.addressFa"] || "تورنتو، انتاریو، کانادا"
                    : settings?.["site.addressEn"] || "Toronto, ON, Canada"}
                </span>
              </li>
            </ul>
            <div className="mt-4 flex gap-2">
              <a
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="transition-colors hover:text-primary"
            >
              {t("nav.admin")}
            </button>
            <span className="text-muted-foreground/50">·</span>
            <span>RCIC #R514632</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
