"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Clock, Wallet } from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { PageHero } from "../site/page-hero";
import { Section } from "../site/ui-bits";
import { ServiceIcon } from "../site/service-icon";
import { Button } from "@/components/ui/button";
import { localized } from "@/lib/content";

type Service = {
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
  order: number;
};

export function ServicesPage() {
  const { t, locale, dir } = useLocale();
  const { navigate } = useRouter();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setServices(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  return (
    <div>
      <PageHero
        eyebrow={t("nav.services")}
        title={t("home.services.title")}
        desc={t("home.services.desc")}
      />
      <Section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => navigate(`/services/${s.slug}`)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="group relative flex flex-col rounded-2xl border border-border/60 bg-background p-6 text-start transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <ServiceIcon name={s.icon} className="h-6 w-6" />
                </span>
                {s.featured && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary">
                    {t("common.featured")}
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                {localized(s, "title", locale)}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {localized(s, "shortDesc", locale)}
              </p>
              <div className="mt-5 flex items-center gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {locale === "fa" ? s.durationFa : s.durationEn}
                </span>
                {s.feeFrom && (
                  <span className="inline-flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5" />
                    {locale === "fa" ? `از ${s.feeFrom}` : `from ${s.feeFrom}`}
                  </span>
                )}
                <Arrow className="ms-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 group-hover:text-primary" />
              </div>
            </motion.button>
          ))}
        </div>
      </Section>
    </div>
  );
}
