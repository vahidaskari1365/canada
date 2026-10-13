"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Users,
  Award,
  Quote,
  CheckCircle2,
  Star,
  Sparkles,
  FileSearch,
  ClipboardCheck,
  Plane,
  Calendar,
} from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { Section, SectionHeading, Eyebrow, StatNumber } from "../site/ui-bits";
import { ServiceIcon } from "../site/service-icon";
import { MapleFlagBg } from "../site/maple-flag-bg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { localized, formatDate, formatCurrency } from "@/lib/content";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fade: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } },
};

type Service = {
  id: string;
  slug: string;
  titleEn: string;
  titleFa: string;
  shortDescEn: string;
  shortDescFa: string;
  icon: string;
  durationEn: string;
  durationFa: string;
  feeFrom: string;
  featured: boolean;
};
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

const features = [
  {
    icon: ShieldCheck,
    titleFa: "مشاور رسمی RCIC",
    titleEn: "Licensed RCIC",
    descFa: "مشاوران دارای پروانه رسمی کانادا و عضو ICCRC.",
    descEn: "Regulated Canadian Immigration Consultants, ICCRC members.",
  },
  {
    icon: Clock,
    titleFa: "پاسخ زیر ۲۴ ساعت",
    titleEn: "Response within 24h",
    descFa: "هر درخواست شما را سریع و دقیق بررسی می‌کنیم.",
    descEn: "We review every request fast and accurately.",
  },
  {
    icon: Users,
    titleFa: "۴٬۸۰۰+ پرونده موفق",
    titleEn: "4,800+ successful cases",
    descFa: "تجربه واقعی در تمام مسیرهای مهاجرتی.",
    descEn: "Real experience across every immigration pathway.",
  },
  {
    icon: Award,
    titleFa: "نرخ موفقیت ۹۶٪",
    titleEn: "96% success rate",
    descFa: "رویکرد داده‌محور و استراتژی اختصاصی.",
    descEn: "Data-driven approach and tailored strategy.",
  },
];

const process = [
  {
    icon: FileSearch,
    titleFa: "ارزیابی رایگان",
    titleEn: "Free Assessment",
    descFa: "پروفایل شما را تحلیل و بهترین مسیر را پیشنهاد می‌دهیم.",
    descEn: "We analyze your profile and propose the best pathway.",
  },
  {
    icon: ClipboardCheck,
    titleFa: "جمع‌آوری مدارک",
    titleEn: "Document Prep",
    descFa: "فهرست دقیق مدارک و راهنمایی در هر مرحله.",
    descEn: "Precise document checklist and step-by-step guidance.",
  },
  {
    icon: ShieldCheck,
    titleFa: "ثبت درخواست",
    titleEn: "Application Filing",
    descFa: "ثبت حرفه‌ای درخواست و پیگیری تا تصمیم نهایی.",
    descEn: "Professional filing and follow-up until the decision.",
  },
  {
    icon: Plane,
    titleFa: "ورود به کانادا",
    titleEn: "Arrival in Canada",
    descFa: "آمادگی قبل از سفر و خدمات پس از ورود.",
    descEn: "Pre-departure prep and post-arrival services.",
  },
];

export function HomePage() {
  const { t, locale, dir } = useLocale();
  const { navigate } = useRouter();
  const reduce = useReducedMotion();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const [services, setServices] = useState<Service[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setServices(Array.isArray(d) ? d : []))
      .catch(() => {});
    fetch("/api/posts?limit=3")
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => {});
    fetch("/api/public")
      .then((r) => r.json())
      .then((d) => setTestimonials(Array.isArray(d?.testimonials) ? d.testimonials : []))
      .catch(() => {});
  }, []);

  const featuredServices = services.filter((s) => s.featured).slice(0, 4);
  const otherServices = services.filter((s) => !s.featured).slice(0, 6);

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* backdrop with the waving Canadian flag */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <MapleFlagBg variant="hero" />
          {/* soft scrim so text stays readable on top of the flag */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/40 to-background/70" />
          <div className="absolute -top-32 ltr:right-0 rtl:left-0 h-[480px] w-[480px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-40 ltr:left-0 rtl:right-0 h-[360px] w-[360px] rounded-full bg-amber-500/5 blur-3xl" />
          {/* fade the flag into the page background at the bottom for a smooth blend */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>

        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 px-4 pb-16 pt-12 sm:px-6 md:pt-20 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pb-24">
          {/* Left: copy */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 lg:pt-8"
          >
            <motion.div variants={fade}>
              <Eyebrow>{t("home.hero.badge")}</Eyebrow>
            </motion.div>
            <motion.h1
              variants={fade}
              className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.2rem]"
            >
              {locale === "fa" ? (
                <>
                  مسیر مهاجرت شما به{" "}
                  <span className="relative whitespace-nowrap text-primary">
                    کانادا
                    <svg
                      className="absolute -bottom-2 left-0 h-3 w-full text-primary/30"
                      viewBox="0 0 200 12"
                      preserveAspectRatio="none"
                    >
                      <path d="M2 8 Q 50 2 100 7 T 198 6" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                  ،
                  <br />
                  با تیمی قابل اعتماد
                </>
              ) : (
                <>
                  Your path to{" "}
                  <span className="relative whitespace-nowrap text-primary">
                    Canada
                    <svg
                      className="absolute -bottom-2 left-0 h-3 w-full text-primary/30"
                      viewBox="0 0 200 12"
                      preserveAspectRatio="none"
                    >
                      <path d="M2 8 Q 50 2 100 7 T 198 6" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                  ,
                  <br />
                  with a team you can trust
                </>
              )}
            </motion.h1>
            <motion.p
              variants={fade}
              className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              {t("home.hero.desc")}
            </motion.p>
            <motion.div variants={fade} className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => navigate("/assessment")} className="gap-1.5">
                {t("home.hero.cta1")}
                <Arrow className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/services")}>
                {t("home.hero.cta2")}
              </Button>
            </motion.div>

            {/* trust row */}
            <motion.div variants={fade} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {locale === "fa" ? "مشاور رسمی RCIC" : "Licensed RCIC"}
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {locale === "fa" ? "۹۶٪ نرخ موفقیت" : "96% success rate"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                {locale === "fa" ? "۴٬۸۰۰+ موفقیت" : "4,800+ successes"}
              </span>
            </motion.div>
          </motion.div>

          {/* Right: visual card */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 60 }}
            className="lg:col-span-5"
          >
            <HeroCard />
          </motion.div>
        </div>

        {/* Stats strip */}
        <div className="border-y border-border/60 bg-muted/30">
          <div className="mx-auto grid w-full max-w-[1280px] grid-cols-2 divide-border/60 px-4 sm:px-6 md:grid-cols-4 md:divide-x rtl:md:divide-x-reverse lg:px-8">
            {[
              { v: "۴٬۸۰۰+", vEn: "4,800+", k: "home.stats.success" },
              { v: "۸", vEn: "8", k: "home.stats.years" },
              { v: "۳۲", vEn: "32", k: "home.stats.countries" },
              { v: "۹۶٪", vEn: "96%", k: "home.stats.successRate" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1 px-2 py-6 text-center md:py-8"
              >
                <span className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                  <StatNumber value={locale === "fa" ? s.v : s.vEn} />
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground md:text-sm">
                  {t(s.k)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <Section>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={t("home.services.badge")}
            title={t("home.services.title")}
            desc={t("home.services.desc")}
          />
          <Button variant="ghost" onClick={() => navigate("/services")} className="gap-1.5">
            {t("action.viewAll")}
            <Arrow className="h-4 w-4" />
          </Button>
        </div>

        {/* Featured: asymmetric layout (2 large + grid) */}
        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {featuredServices.slice(0, 1).map((s, i) => (
            <FeaturedServiceCard key={s.id} service={s} big />
          ))}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
            {featuredServices.slice(1, 3).map((s) => (
              <FeaturedServiceCard key={s.id} service={s} />
            ))}
            {otherServices.slice(0, 2).map((s) => (
              <FeaturedServiceCard key={s.id} service={s} compact />
            ))}
          </div>
        </div>

        {/* Remaining services as a list */}
        {services.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border/60">
            <div className="divide-y divide-border/60">
              {services.slice(4, 10).map((s) => (
                <button
                  key={s.id}
                  onClick={() => navigate(`/services/${s.slug}`)}
                  className="group flex w-full items-center gap-4 px-5 py-4 text-start transition-colors hover:bg-muted/40"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ServiceIcon name={s.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {localized(s, "title", locale)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {localized(s, "shortDesc", locale)}
                    </p>
                  </div>
                  <span className="hidden text-xs text-muted-foreground sm:block">
                    {locale === "fa" ? s.durationFa : s.durationEn}
                  </span>
                  <Arrow className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 group-hover:text-primary" />
                </button>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ===== PROCESS ===== */}
      <Section className="bg-muted/20">
        <SectionHeading
          eyebrow={t("home.process.badge")}
          title={t("home.process.title")}
          align="center"
          className="mx-auto items-center"
        />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 80 }}
                className="relative rounded-2xl border border-border/60 bg-background p-6"
              >
                <span className="absolute top-5 ltr:right-5 rtl:left-5 font-mono text-5xl font-semibold text-primary/10">
                  0{i + 1}
                </span>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-lg font-semibold">
                  {locale === "fa" ? p.titleFa : p.titleEn}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {locale === "fa" ? p.descFa : p.descEn}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ===== WHY US (asymmetric zig-zag) ===== */}
      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={locale === "fa" ? "چرا میپل بریج" : "Why Maple Bridge"}
              title={
                locale === "fa"
                  ? "شفافیت، سرعت و نتیجه — بدون قول‌های توخالی"
                  : "Transparency, speed and results — no empty promises"
              }
              desc={
                locale === "fa"
                  ? "ما به جای وعده‌های تبلیغاتی، رویکردی داده‌محور و صادقانه داریم. هر مرحله را با شما شفاف می‌سازیم."
                  : "Instead of marketing fluff, we take a data-driven, honest approach. Every step is built transparently with you."
              }
            />
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-medium">{locale === "fa" ? f.titleFa : f.titleEn}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {locale === "fa" ? f.descFa : f.descEn}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <Button className="mt-8 gap-1.5" onClick={() => navigate("/about")}>
              {locale === "fa" ? "درباره ما بیشتر بدانید" : "Learn more about us"}
              <Arrow className="h-4 w-4" />
            </Button>
          </div>

          {/* Right: pricing teaser / packages */}
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 to-background p-8">
            <Eyebrow>{locale === "fa" ? "پکیج‌های مشاوره" : "Consultation packages"}</Eyebrow>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              {locale === "fa"
                ? "از یک سؤال سریع تا نمایندگی کامل"
                : "From a quick question to full representation"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {locale === "fa"
                ? "قیمت‌گذاری شفاف و ثابت. بدون هزینه پنهان."
                : "Transparent, flat pricing. No hidden fees."}
            </p>
            <div className="mt-6 space-y-3">
              {[
                { n: locale === "fa" ? "مشاوره سریع" : "Quick Consult", p: "$49", d: locale === "fa" ? "۳۰ دقیقه" : "30 min" },
                { n: locale === "fa" ? "استراتژی استاندارد" : "Standard Strategy", p: "$149", d: locale === "fa" ? "۶۰ دقیقه" : "60 min", hot: true },
                { n: locale === "fa" ? "خدمات کامل پرونده" : "Full Service", p: "$2,500+", d: locale === "fa" ? "از ابتدا تا ورود" : "Start to landing" },
              ].map((p, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-xl border p-4 ${
                    p.hot ? "border-primary bg-primary/5" : "border-border/60 bg-background"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {p.hot && <Sparkles className="h-4 w-4 text-primary" />}
                    <div>
                      <p className="text-sm font-medium">{p.n}</p>
                      <p className="text-xs text-muted-foreground">{p.d}</p>
                    </div>
                  </div>
                  <span className="font-mono text-lg font-semibold">{p.p}</span>
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full gap-1.5" onClick={() => navigate("/booking")}>
              <Calendar className="h-4 w-4" />
              {t("action.bookConsult")}
            </Button>
          </div>
        </div>
      </Section>

      {/* ===== TESTIMONIALS ===== */}
      <Section className="bg-muted/20">
        <SectionHeading
          eyebrow={t("home.testimonials.badge")}
          title={t("home.testimonials.title")}
          align="center"
          className="mx-auto items-center"
        />
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((tm, i) => (
            <motion.figure
              key={tm.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="flex flex-col rounded-2xl border border-border/60 bg-background p-6"
            >
              <Quote className="h-7 w-7 text-primary/30" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">
                “{localized(tm, "text", locale)}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-semibold text-primary">
                  {localized(tm, "name", locale).charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{localized(tm, "name", locale)}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {localized(tm, "program", locale)}
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
      </Section>

      {/* ===== LATEST ARTICLES ===== */}
      {posts.length > 0 && (
        <Section>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow={locale === "fa" ? "آخرین مقالات" : "Latest articles"}
              title={locale === "fa" ? "راهنما و اخبار مهاجرتی" : "Immigration guides & news"}
            />
            <Button variant="ghost" onClick={() => navigate("/blog")} className="gap-1.5">
              {t("action.viewAll")}
              <Arrow className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {posts.map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => navigate(`/blog/${p.slug}`)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col text-start"
              >
                <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted">
                  {p.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.coverImage}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                      <span className="font-mono text-5xl font-semibold text-primary/20">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="capitalize">
                    {p.type}
                  </Badge>
                  {p.category && (
                    <span className="text-muted-foreground">
                      {localized(p.category, "name", locale)}
                    </span>
                  )}
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
        </Section>
      )}

      {/* ===== CTA ===== */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary to-primary/80 px-6 py-14 text-primary-foreground md:px-14 md:py-20">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute -top-20 ltr:-right-20 rtl:-left-20 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute -bottom-24 ltr:-left-10 rtl:-right-10 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
          </div>
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                {t("home.cta.title")}
              </h2>
              <p className="mt-3 max-w-xl text-balance text-primary-foreground/80">
                {t("home.cta.desc")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/assessment")}
                className="gap-1.5"
              >
                {t("action.freeAssessment")}
                <Arrow className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/booking")}
                className="gap-1.5 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Calendar className="h-4 w-4" />
                {t("action.bookConsult")}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ---------- sub-components ---------- */

function FeaturedServiceCard({
  service,
  big,
  compact,
}: {
  service: Service;
  big?: boolean;
  compact?: boolean;
}) {
  const { locale, dir } = useLocale();
  const { navigate } = useRouter();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  return (
    <button
      onClick={() => navigate(`/services/${service.slug}`)}
      className={`group relative flex flex-col text-start transition-all ${
        big ? "min-h-[260px] rounded-3xl p-7" : "min-h-[200px] rounded-2xl p-6"
      } border border-border/60 bg-background hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5`}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
        <ServiceIcon name={service.icon} className="h-6 w-6" />
      </span>
      <h3 className={`mt-5 font-semibold tracking-tight ${big ? "text-2xl" : "text-lg"}`}>
        {localized(service, "title", locale)}
      </h3>
      <p className={`mt-2 text-sm leading-relaxed text-muted-foreground ${compact ? "line-clamp-2" : ""}`}>
        {localized(service, "shortDesc", locale)}
      </p>
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-xs text-muted-foreground">
          {locale === "fa" ? service.durationFa : service.durationEn}
          {service.feeFrom && (
            <span className="mx-1.5 text-muted-foreground/40">·</span>
          )}
          {service.feeFrom && (
            <span>
              {locale === "fa" ? `از ${service.feeFrom}` : `from ${service.feeFrom}`}
            </span>
          )}
        </span>
        <Arrow className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 group-hover:text-primary" />
      </div>
    </button>
  );
}

function HeroCard() {
  const { locale, dir } = useLocale();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const { navigate } = useRouter();
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* main card */}
      <div className="relative z-10 rounded-3xl border border-border/60 bg-background p-6 shadow-xl shadow-primary/5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {locale === "fa" ? "بررسی پروفایل آنلاین" : "Live profile review"}
          </span>
          <span className="font-mono text-xs text-muted-foreground">CRS</span>
        </div>

        {/* CRS score gauge */}
        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              {locale === "fa" ? "امتیاز فعلی شما" : "Your current score"}
            </p>
            <p className="mt-1 font-mono text-5xl font-semibold tracking-tight text-primary">
              487
            </p>
          </div>
          <div className="text-end">
            <p className="text-xs text-muted-foreground">
              {locale === "fa" ? "آخرین دعوتنامه" : "Latest ITA"}
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold">525</p>
          </div>
        </div>

        {/* progress */}
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500"
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
            <span>{locale === "fa" ? "نزدیک دعوتنامه" : "Close to ITA"}</span>
            <span>+38 {locale === "fa" ? "امتیاز لازم" : "pts to go"}</span>
          </div>
        </div>

        {/* breakdown */}
        <div className="mt-6 space-y-2.5 border-t border-border/60 pt-5">
          {[
            { k: locale === "fa" ? "سن" : "Age", v: "110" },
            { k: locale === "fa" ? "تحصیلات" : "Education", v: "126" },
            { k: locale === "fa" ? "زبان" : "Language", v: "116" },
            { k: locale === "fa" ? "تجربه کار" : "Experience", v: "80" },
            { k: locale === "fa" ? "موجود در کانادا" : "In-Canada", v: "35" },
          ].map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{row.k}</span>
              <span className="font-mono tabular-nums">{row.v}</span>
            </motion.div>
          ))}
        </div>

        <Button
          className="mt-6 w-full gap-1.5"
          onClick={() => navigate("/assessment")}
        >
          {locale === "fa" ? "امتیاز خود را بسنجید" : "Check your score"}
          <Arrow className="h-4 w-4" />
        </Button>
      </div>

      {/* floating badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 120 }}
        className="absolute -bottom-4 ltr:-left-4 rtl:-right-4 z-20 rounded-2xl border border-border/60 bg-background p-3 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium">
              {locale === "fa" ? "ITA دریافت شد" : "ITA received"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {locale === "fa" ? "۳ ماه پس از ورود" : "3 months after entry"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
