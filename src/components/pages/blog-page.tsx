"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Search } from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { PageHero } from "../site/page-hero";
import { Section } from "../site/ui-bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { localized, formatDate } from "@/lib/content";

type Post = {
  id: string;
  slug: string;
  titleEn: string;
  titleFa: string;
  excerptEn: string;
  excerptFa: string;
  coverImage: string;
  type: string;
  readingTime: number;
  publishedAt: string;
  category?: { nameEn: string; nameFa: string; color: string } | null;
};

type Mode = "all" | "blog" | "news" | "guide";

export function BlogPage({ mode = "all" }: { mode?: Mode }) {
  const { t, locale, dir } = useLocale();
  const { navigate } = useRouter();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<Mode>(mode);

  useEffect(() => {
    const url =
      activeType === "all" ? "/api/posts" : `/api/posts?type=${activeType}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [activeType]);

  const filtered = posts.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.titleEn.toLowerCase().includes(q) ||
      p.titleFa.includes(query) ||
      p.excerptEn.toLowerCase().includes(q) ||
      p.excerptFa.includes(query)
    );
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const tabs: { id: Mode; label: string }[] = [
    { id: "all", label: t("common.all") },
    { id: "blog", label: locale === "fa" ? "بلاگ" : "Blog" },
    { id: "news", label: t("nav.news") },
    { id: "guide", label: locale === "fa" ? "راهنما" : "Guides" },
  ];

  const titles: Record<Mode, { fa: string; en: string }> = {
    all: { fa: "بلاگ و مقالات", en: "Blog & Articles" },
    blog: { fa: "بلاگ", en: "Blog" },
    news: { fa: "آخرین اخبار مهاجرت", en: "Latest Immigration News" },
    guide: { fa: "راهنمای مهاجرت", en: "Immigration Guides" },
  };

  return (
    <div>
      <PageHero
        eyebrow={locale === "fa" ? "منابع" : "Resources"}
        title={locale === "fa" ? titles[activeType].fa : titles[activeType].en}
        desc={
          locale === "fa"
            ? "آخرین اخبار، راهنماها و تحلیل‌های مهاجرت به کانادا را بخوانید."
            : "Read the latest Canada immigration news, guides and analysis."
        }
      >
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("action.search")}
              className="ltr:pl-9 rtl:pr-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tb) => (
              <button
                key={tb.id}
                onClick={() => setActiveType(tb.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  activeType === tb.id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>
        </div>
      </PageHero>

      <Section>
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">{t("common.noResults")}</p>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <motion.button
                onClick={() => navigate(`/blog/${featured.slug}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group mb-10 grid w-full grid-cols-1 gap-6 rounded-3xl border border-border/60 bg-background p-5 text-start md:grid-cols-2 md:p-6"
              >
                <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted">
                  {featured.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={featured.coverImage} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-muted">
                      <span className="font-mono text-6xl font-semibold text-primary/20">01</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="capitalize">{featured.type}</Badge>
                    {featured.category && <span>{localized(featured.category, "name", locale)}</span>}
                    <span>·</span>
                    <span>{formatDate(featured.publishedAt, locale)}</span>
                  </div>
                  <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary md:text-3xl">
                    {localized(featured, "title", locale)}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {localized(featured, "excerpt", locale)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    {t("action.readMore")}
                    <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </div>
              </motion.button>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p, i) => (
                <motion.button
                  key={p.id}
                  onClick={() => navigate(`/blog/${p.slug}`)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08 }}
                  className="group flex flex-col text-start"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted">
                    {p.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                        <span className="font-mono text-4xl font-semibold text-primary/20">
                          {String(i + 2).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="capitalize">{p.type}</Badge>
                    {p.category && <span>{localized(p.category, "name", locale)}</span>}
                    <span>·</span>
                    <span>{p.readingTime} {t("common.minRead")}</span>
                  </div>
                  <h3 className="mt-2 text-balance text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {localized(p, "title", locale)}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {localized(p, "excerpt", locale)}
                  </p>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </Section>
    </div>
  );
}
