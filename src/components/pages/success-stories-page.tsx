"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star, ArrowRight, ArrowLeft } from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { PageHero } from "../site/page-hero";
import { Section } from "../site/ui-bits";
import { Button } from "@/components/ui/button";
import { localized } from "@/lib/content";

type Testimonial = {
  id: string;
  nameEn: string;
  nameFa: string;
  countryEn: string;
  countryFa: string;
  programEn: string;
  programFa: string;
  textEn: string;
  textFa: string;
  rating: number;
};

export function SuccessStoriesPage() {
  const { locale, dir } = useLocale();
  const { navigate } = useRouter();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch("/api/public")
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d?.testimonials) ? d.testimonials : []))
      .catch(() => {});
  }, []);

  return (
    <div>
      <PageHero
        eyebrow={locale === "fa" ? "تجربه موفقیت" : "Success stories"}
        title={locale === "fa" ? "آنها به کانادا رسیدند — شما هم می‌رسید" : "They made it to Canada — so will you"}
        desc={
          locale === "fa"
            ? "داستان واقعی کسانی که با کمک میپل بریج به هدف مهاجرتی خود رسیدند."
            : "Real stories of people who reached their immigration goals with Maple Bridge."
        }
      />
      <Section>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((tm, i) => (
            <motion.figure
              key={tm.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="flex flex-col rounded-2xl border border-border/60 bg-background p-6"
            >
              <Quote className="h-8 w-8 text-primary/30" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">
                “{localized(tm, "text", locale)}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-mono text-base font-semibold text-primary">
                  {localized(tm, "name", locale).charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{localized(tm, "name", locale)}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {localized(tm, "program", locale)} · {localized(tm, "country", locale)}
                  </p>
                </div>
                <span className="ms-auto flex gap-0.5">
                  {Array.from({ length: tm.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-8 text-center md:p-12">
          <h3 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
            {locale === "fa" ? "داستان بعدی، داستان شماست" : "The next story is yours"}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {locale === "fa"
              ? "ارزیابی رایگان شروع کنید و اولین قدم را به سوی کانادا بردارید."
              : "Start with a free assessment and take your first step toward Canada."}
          </p>
          <Button className="mt-6 gap-1.5" onClick={() => navigate("/assessment")}>
            {locale === "fa" ? "ارزیابی رایگان" : "Free assessment"}
            <Arrow className="h-4 w-4" />
          </Button>
        </div>
      </Section>
    </div>
  );
}
