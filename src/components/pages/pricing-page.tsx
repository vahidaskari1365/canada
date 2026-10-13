"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { PageHero } from "../site/page-hero";
import { Section } from "../site/ui-bits";
import { Button } from "@/components/ui/button";
import { localized, formatCurrency } from "@/lib/content";

type Pkg = {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
  descEn: string;
  descFa: string;
  priceUSD: number;
  durationEn: string;
  durationFa: string;
  featuresEn: string;
  featuresFa: string;
  popular: boolean;
};

export function PricingPage() {
  const { locale, dir } = useLocale();
  const { navigate } = useRouter();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [packages, setPackages] = useState<Pkg[]>([]);

  useEffect(() => {
    fetch("/api/public")
      .then((r) => r.json())
      .then((d) => setPackages(Array.isArray(d?.packages) ? d.packages : []))
      .catch(() => {});
  }, []);

  return (
    <div>
      <PageHero
        eyebrow={locale === "fa" ? "پکیج‌ها و قیمت‌ها" : "Packages & pricing"}
        title={locale === "fa" ? "قیمت‌گذاری شفاف، بدون هزینه پنهان" : "Transparent pricing, no hidden fees"}
        desc={
          locale === "fa"
            ? "از یک مشاوره سریع تا نمایندگی کامل پرونده — پکیجی متناسب با نیاز خود انتخاب کنید."
            : "From a quick consult to full representation — choose a package that fits your needs."
        }
      />
      <Section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {packages.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col rounded-3xl border p-7 ${
                p.popular
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border/60 bg-background"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 ltr:right-6 rtl:left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  <Sparkles className="h-3 w-3" />
                  {locale === "fa" ? "محبوب‌ترین" : "Most popular"}
                </span>
              )}
              <h3 className="text-xl font-semibold tracking-tight">{localized(p, "name", locale)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{localized(p, "desc", locale)}</p>
              <div className="mt-5">
                <span className="font-mono text-4xl font-semibold tracking-tight text-primary">
                  {formatCurrency(p.priceUSD, locale)}
                </span>
                <span className="ms-1 text-sm text-muted-foreground">
                  {locale === "fa" ? p.durationFa : p.durationEn}
                </span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {(locale === "fa" ? p.featuresFa : p.featuresEn)
                  .split("\n")
                  .filter(Boolean)
                  .map((f, j) => (
                    <li key={j} className="flex gap-2.5 text-sm">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-foreground/80">{f.trim()}</span>
                    </li>
                  ))}
              </ul>
              <Button
                className="mt-7 w-full gap-1.5"
                variant={p.popular ? "default" : "outline"}
                onClick={() => navigate(`/booking?pkg=${p.slug}`)}
              >
                {locale === "fa" ? "انتخاب و رزرو" : "Choose & book"}
                <Arrow className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {locale === "fa"
            ? "هزینه‌های دولتی (IRCC) جداگانه و به قیمت واقعی محاسبه می‌شود. قیمت‌ها به دلار آمریکا است."
            : "Government (IRCC) fees are billed separately at cost. Prices in USD."}
        </p>
      </Section>
    </div>
  );
}
