"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, ArrowLeft, Share2, User } from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { PageHero, BackButton } from "../site/page-hero";
import { Section } from "../site/ui-bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { localized, formatDate, splitLines } from "@/lib/content";
import { toast } from "sonner";

type PostDetail = {
  id: string;
  slug: string;
  titleEn: string;
  titleFa: string;
  excerptEn: string;
  excerptFa: string;
  contentEn: string;
  contentFa: string;
  coverImage: string;
  type: string;
  readingTime: number;
  publishedAt: string;
  authorEn: string;
  authorFa: string;
  tagsEn: string;
  tagsFa: string;
  category?: { nameEn: string; nameFa: string; color: string } | null;
  related: {
    id: string;
    slug: string;
    titleEn: string;
    titleFa: string;
    excerptEn: string;
    excerptFa: string;
    coverImage: string;
    type: string;
    readingTime: number;
  }[];
};

function renderMarkdown(md: string, locale: "fa" | "en") {
  const lines = md.split("\n");
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  let ordered = false;

  function flushList(key: number) {
    if (list.length === 0) return;
    const items = list.map((li, i) => (
      <li key={i} className="ms-5 list-disc text-foreground/80">
        {renderInline(li)}
      </li>
    ));
    out.push(
      ordered ? (
        <ol key={`l${key}`} className="mt-3 space-y-1.5">
          {items}
        </ol>
      ) : (
        <ul key={`l${key}`} className="mt-3 space-y-1.5">
          {items}
        </ul>
      )
    );
    list = [];
  }

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    if (line.startsWith("## ")) {
      flushList(idx);
      out.push(
        <h2 key={idx} className="mt-8 text-xl font-semibold tracking-tight">
          {renderInline(line.slice(3))}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList(idx);
      out.push(
        <h3 key={idx} className="mt-6 text-lg font-semibold tracking-tight">
          {renderInline(line.slice(4))}
        </h3>
      );
    } else if (/^\d+\.\s/.test(line)) {
      ordered = true;
      list.push(line.replace(/^\d+\.\s/, ""));
    } else if (line.startsWith("- ")) {
      ordered = false;
      list.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList(idx);
    } else {
      flushList(idx);
      out.push(
        <p key={idx} className="mt-3 leading-relaxed text-foreground/80">
          {renderInline(line)}
        </p>
      );
    }
  });
  flushList(999);
  return out;
}

function renderInline(text: string): React.ReactNode {
  // **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

export function BlogDetailPage({ slug }: { slug: string }) {
  const { t, locale, dir } = useLocale();
  const { navigate } = useRouter();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/posts?slug=${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setPost(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">404</h1>
        <Button className="mt-6" onClick={() => navigate("/blog")}>
          {locale === "fa" ? "بازگشت به بلاگ" : "Back to blog"}
        </Button>
      </div>
    );
  }

  const tags = splitLines(locale === "fa" ? post.tagsFa : post.tagsEn).filter(
    (x) => !x.includes(",")
  );
  const tagList =
    tags.length > 0
      ? tags
      : (locale === "fa" ? post.tagsFa : post.tagsEn).split(",").map((s) => s.trim()).filter(Boolean);

  function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({ title: localized(post!, "title", locale), url: window.location.href })
        .catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success(locale === "fa" ? "لینک کپی شد" : "Link copied");
    }
  }

  return (
    <div>
      <PageHero
        eyebrow={post.category ? localized(post.category, "name", locale) : post.type}
        title={localized(post, "title", locale)}
        desc={localized(post, "excerpt", locale)}
      >
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4 text-primary" />
            {localized(post, "author", locale)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            {formatDate(post.publishedAt, locale)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            {post.readingTime} {t("common.minRead")}
          </span>
        </div>
      </PageHero>

      <Section>
        <BackButton to="/blog" label={locale === "fa" ? "همه مقالات" : "All articles"} />

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <article className="lg:col-span-8">
            {post.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverImage}
                alt=""
                className="mb-8 aspect-[16/9] w-full rounded-2xl object-cover"
              />
            )}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {renderMarkdown(locale === "fa" ? post.contentFa : post.contentEn, locale)}
            </div>

            {/* Tags + share */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
              <div className="flex flex-wrap gap-2">
                {tagList.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="capitalize">
                    #{tag.trim()}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={share} className="gap-1.5">
                <Share2 className="h-4 w-4" />
                {t("common.share")}
              </Button>
            </div>
          </article>

          {/* Sidebar CTA */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6">
              <h3 className="text-lg font-semibold">
                {locale === "fa" ? "مشاوره تخصصی دریافت کنید" : "Get expert advice"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === "fa"
                  ? "سؤالی درباره این مقاله دارید؟ رزرو مشاوره کنید."
                  : "Have a question about this article? Book a consultation."}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button className="w-full gap-1.5" onClick={() => navigate("/booking")}>
                  {t("action.bookConsult")}
                  <Arrow className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/assessment")}>
                  {t("action.freeAssessment")}
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related */}
        {post.related && post.related.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-semibold tracking-tight">{t("common.related")}</h3>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {post.related.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/blog/${p.slug}`)}
                  className="group flex flex-col text-start"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted">
                    {p.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                        <span className="font-mono text-4xl font-semibold text-primary/20">·</span>
                      </div>
                    )}
                  </div>
                  <h4 className="mt-3 text-balance font-medium leading-snug transition-colors group-hover:text-primary">
                    {localized(p, "title", locale)}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {localized(p, "excerpt", locale)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
