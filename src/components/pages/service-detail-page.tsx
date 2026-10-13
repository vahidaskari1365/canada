"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Wallet,
  Calendar,
  ClipboardList,
} from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { PageHero, BackButton } from "../site/page-hero";
import { Section, Eyebrow } from "../site/ui-bits";
import { ServiceIcon } from "../site/service-icon";
import { Button } from "@/components/ui/button";
import { localized } from "@/lib/content";

type ServiceDetail = {
  id: string;
  slug: string;
  titleEn: string;
  titleFa: string;
  shortDescEn: string;
  shortDescFa: string;
  descEn: string;
  descFa: string;
  icon: string;
  durationEn: string;
  durationFa: string;
  feeFrom: string;
  featured: boolean;
  requirements: { id: string; textEn: string; textFa: string }[];
  steps: {
    id: string;
    step: number;
    titleEn: string;
    titleFa: string;
    descEn: string;
    descFa: string;
  }[];
};

export function ServiceDetailPage({ slug }: { slug: string }) {
  const { t, locale, dir } = useLocale();
  const { navigate } = useRouter();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/services?slug=${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setService(d);
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

  if (!service) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">404</h1>
        <p className="mt-2 text-muted-foreground">
          {locale === "fa" ? "خدمت یافت نشد" : "Service not found"}
        </p>
        <Button className="mt-6" onClick={() => navigate("/services")}>
          {locale === "fa" ? "بازگشت به خدمات" : "Back to services"}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow={locale === "fa" ? "خدمات مهاجرتی" : "Immigration Service"}
        title={localized(service, "title", locale)}
        desc={localized(service, "shortDesc", locale)}
      >
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            {locale === "fa" ? service.durationFa : service.durationEn}
          </span>
          {service.feeFrom && (
            <span className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm">
              <Wallet className="h-4 w-4 text-primary" />
              {locale === "fa" ? `هزینه از ${service.feeFrom}` : `Fee from ${service.feeFrom}`}
            </span>
          )}
          <Button onClick={() => navigate("/booking")} className="gap-1.5">
            <Calendar className="h-4 w-4" />
            {t("action.bookConsult")}
          </Button>
        </div>
      </PageHero>

      <Section>
        <BackButton to="/services" label={locale === "fa" ? "همه خدمات" : "All services"} />

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ServiceIcon name={service.icon} className="h-7 w-7" />
              </span>
              <h2 className="text-2xl font-semibold tracking-tight">
                {locale === "fa" ? "نمای کلی برنامه" : "Program overview"}
              </h2>
            </div>
            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-foreground/80">
              {localized(service, "desc", locale)}
            </p>

            {/* Steps */}
            <h3 className="mt-12 text-xl font-semibold tracking-tight">
              {locale === "fa" ? "فرآیند کار" : "Our process"}
            </h3>
            <div className="mt-6 space-y-4">
              {service.steps.map((st, i) => (
                <motion.div
                  key={st.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-4 rounded-2xl border border-border/60 bg-background p-5"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-semibold text-primary-foreground">
                    {st.step}
                  </span>
                  <div>
                    <h4 className="font-medium">{localized(st, "title", locale)}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {localized(st, "desc", locale)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar: requirements + CTA */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-border/60 bg-background p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  {locale === "fa" ? "الزامات" : "Requirements"}
                </h3>
                <ul className="mt-4 space-y-3">
                  {service.requirements.map((r) => (
                    <li key={r.id} className="flex gap-2.5 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-foreground/80">{localized(r, "text", locale)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6">
                <Eyebrow>{locale === "fa" ? "شروع کنید" : "Get started"}</Eyebrow>
                <h3 className="mt-3 text-lg font-semibold">
                  {locale === "fa"
                    ? "آیا برای این برنامه واجد شرایط هستید؟"
                    : "Are you eligible for this program?"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {locale === "fa"
                    ? "ارزیابی رایگان انجام دهید و در کمتر از ۲۴ ساعت پاسخ بگیرید."
                    : "Take the free assessment and get an answer within 24 hours."}
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <Button className="w-full gap-1.5" onClick={() => navigate("/assessment")}>
                    {t("action.freeAssessment")}
                    <Arrow className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full gap-1.5" onClick={() => navigate("/booking")}>
                    <Calendar className="h-4 w-4" />
                    {t("action.bookConsult")}
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );
}
