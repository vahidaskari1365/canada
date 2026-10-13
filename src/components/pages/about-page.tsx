"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Target, Eye, Heart, Award, Users, Clock } from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { PageHero } from "../site/page-hero";
import { Section, SectionHeading, Eyebrow, StatNumber } from "../site/ui-bits";
import { Button } from "@/components/ui/button";

export function AboutPage() {
  const { t, locale } = useLocale();
  const { navigate } = useRouter();

  const values = [
    {
      icon: ShieldCheck,
      titleFa: "صداقت کامل",
      titleEn: "Radical honesty",
      descFa: "هیچ قول قطعی نمی‌دهیم. فقط داده‌ها و واقعیت.",
      descEn: "We never promise certainty. Only data and truth.",
    },
    {
      icon: Target,
      titleFa: "نتیجه‌محوری",
      titleEn: "Outcome-focused",
      descFa: "موفقیت شما معیار ماست، نه تعداد ساعت کار.",
      descEn: "Your success is our metric, not hours billed.",
    },
    {
      icon: Eye,
      titleFa: "شفافیت",
      titleEn: "Transparency",
      descFa: "هر مرحله، هر هزینه — همه چیز را می‌بینید.",
      descEn: "Every step, every fee — you see it all.",
    },
    {
      icon: Heart,
      titleFa: "همدلی",
      titleEn: "Empathy",
      descFa: "مهاجرت سخت است. ما کنار شما هستیم.",
      descEn: "Immigration is hard. We're by your side.",
    },
  ];

  const milestones = [
    { year: "2016", fa: "تأسیس در تورنتو", en: "Founded in Toronto" },
    { year: "2018", fa: "۱٬۰۰۰ پرونده موفق", en: "1,000 successful cases" },
    { year: "2021", fa: "گسترش به ونکوور و مونترال", en: "Expanded to Vancouver & Montreal" },
    { year: "2023", fa: "عضویت رسمی ICCRC", en: "Full ICCRC membership" },
    { year: "2025", fa: "۴٬۸۰۰+ پرونده و خدمات آنلاین", en: "4,800+ cases & online services" },
  ];

  return (
    <div>
      <PageHero
        eyebrow={locale === "fa" ? "درباره ما" : "About us"}
        title={locale === "fa" ? "ما پل بین شما و کانادا هستیم" : "We're the bridge between you and Canada"}
        desc={
          locale === "fa"
            ? "مِیپل بریج از سال ۲۰۱۶ با مأموریت ساده‌ای شروع کرد: مهاجرت را شفاف، سریع و انسانی کنیم."
            : "Maple Bridge started in 2016 with a simple mission: make immigration transparent, fast and human."
        }
      />

      {/* Stats */}
      <Section className="!py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { v: "۴٬۸۰۰+", vEn: "4,800+", k: "home.stats.success" },
            { v: "۸", vEn: "8", k: "home.stats.years" },
            { v: "۹۶٪", vEn: "96%", k: "home.stats.successRate" },
            { v: "۳۲", vEn: "32", k: "home.stats.countries" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-background p-6 text-center">
              <p className="text-3xl font-semibold text-primary md:text-4xl">
                <StatNumber value={locale === "fa" ? s.v : s.vEn} />
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{t(s.k)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Story */}
      <Section className="!pt-0">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>{locale === "fa" ? "داستان ما" : "Our story"}</Eyebrow>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              {locale === "fa"
                ? "از یک دفتر کوچک به مشاور رسمی مورد اعتماد"
                : "From a small office to a trusted licensed advisor"}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                {locale === "fa"
                  ? "مِیپل بریج توسط تیمی از مشاوران مهاجرتی و افراد خود مهاجر تأسیس شد که تجربه سخت مهاجرت را خود زندگی کرده بودند. ما می‌دانستیم که صنعت مهاجرت پر از وعده‌های توخالی و هزینه‌های پنهان است."
                  : "Maple Bridge was founded by a team of immigration consultants and immigrants themselves who had lived the hard journey. We knew the immigration industry was full of empty promises and hidden fees."}
              </p>
              <p>
                {locale === "fa"
                  ? "ما تصمیم گرفتیم متفاوت باشیم: قیمت‌گذاری شفاف، رویکرد داده‌محور، و پشتیبانی انسانی در هر مرحله. امروز با بیش از ۴٬۸۰۰ پرونده موفق، یکی از مشاوران مورد اعتماد مهاجرت به کانادا در خاورمیانه هستیم."
                  : "We decided to be different: transparent pricing, a data-driven approach, and human support at every step. Today, with over 4,800 successful cases, we're one of the most trusted Canada immigration advisors in the Middle East."}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => navigate("/team")}>{t("nav.team")}</Button>
              <Button variant="outline" onClick={() => navigate("/contact")}>{t("nav.contact")}</Button>
            </div>
          </div>

          {/* Milestones timeline */}
          <div className="relative">
            <div className="absolute top-0 bottom-0 w-px bg-border ltr:left-3 rtl:right-3" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: locale === "fa" ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex gap-5 ltr:pl-0 rtl:pr-0"
                >
                  <span className="relative z-10 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <div className="pt-0.5">
                    <p className="font-mono text-sm font-semibold text-primary">{m.year}</p>
                    <p className="mt-1 font-medium">{locale === "fa" ? m.fa : m.en}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section className="bg-muted/20">
        <SectionHeading
          eyebrow={locale === "fa" ? "ارزش‌های ما" : "Our values"}
          title={locale === "fa" ? "آنچه ما را هدایت می‌کند" : "What guides us"}
          align="center"
          className="mx-auto items-center"
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border/60 bg-background p-6"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{locale === "fa" ? v.titleFa : v.titleEn}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {locale === "fa" ? v.descFa : v.descEn}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Credentials */}
      <Section>
        <div className="rounded-3xl border border-border/60 bg-background p-8 md:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Award className="h-7 w-7" />
              </span>
              <div>
                <p className="font-semibold">RCIC #R514632</p>
                <p className="text-sm text-muted-foreground">
                  {locale === "fa" ? "مشاور رسمی کانادا" : "Regulated Canadian Immigration Consultant"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="h-7 w-7" />
              </span>
              <div>
                <p className="font-semibold">ICCRC Member</p>
                <p className="text-sm text-muted-foreground">
                  {locale === "fa" ? "عضو انجمن مشاوران رسمی" : "College of Immigration Consultants member"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Clock className="h-7 w-7" />
              </span>
              <div>
                <p className="font-semibold">Since 2016</p>
                <p className="text-sm text-muted-foreground">
                  {locale === "fa" ? "۸ سال تجربه پیوسته" : "8 years continuous experience"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
