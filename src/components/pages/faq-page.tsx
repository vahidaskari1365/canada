"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { PageHero } from "../site/page-hero";
import { Section } from "../site/ui-bits";
import { Button } from "@/components/ui/button";
import { localized } from "@/lib/content";

type Faq = {
  id: string;
  qEn: string;
  qFa: string;
  aEn: string;
  aFa: string;
  category: string;
};

export function FaqPage() {
  const { locale } = useLocale();
  const { navigate } = useRouter();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/public")
      .then((r) => r.json())
      .then((d) => setFaqs(Array.isArray(d?.faqs) ? d.faqs : []))
      .catch(() => {});
  }, []);

  return (
    <div>
      <PageHero
        eyebrow={locale === "fa" ? "سوالات متداول" : "FAQ"}
        title={locale === "fa" ? "پاسخ به پرسش‌های رایج" : "Answers to common questions"}
        desc={
          locale === "fa"
            ? "هرآنچه باید درباره مهاجرت به کانادا بدانید."
            : "Everything you need to know about immigrating to Canada."
        }
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60">
            {faqs.map((f, i) => {
              const isOpen = open === f.id;
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : f.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-start"
                  >
                    <span className="font-medium">{localized(f, "q", locale)}</span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {localized(f, "a", locale)}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6 text-center">
            <h3 className="text-lg font-semibold">
              {locale === "fa" ? "پاسخ خود را پیدا نکردید؟" : "Didn't find your answer?"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {locale === "fa"
                ? "تیم ما آماده پاسخ به سوالات شماست."
                : "Our team is ready to answer your questions."}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button onClick={() => navigate("/contact")}>
                {locale === "fa" ? "تماس با ما" : "Contact us"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/booking")}>
                {locale === "fa" ? "رزرو مشاوره" : "Book consultation"}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
