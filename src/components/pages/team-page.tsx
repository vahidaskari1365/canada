"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Award } from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { PageHero } from "../site/page-hero";
import { Section } from "../site/ui-bits";
import { Button } from "@/components/ui/button";
import { localized } from "@/lib/content";

type Member = {
  id: string;
  nameEn: string;
  nameFa: string;
  roleEn: string;
  roleFa: string;
  bioEn: string;
  bioFa: string;
  photo: string;
  linkedin: string;
  email: string;
};

export function TeamPage() {
  const { locale } = useLocale();
  const { navigate } = useRouter();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch("/api/public")
      .then((r) => r.json())
      .then((d) => setMembers(Array.isArray(d?.team) ? d.team : []))
      .catch(() => {});
  }, []);

  return (
    <div>
      <PageHero
        eyebrow={locale === "fa" ? "تیم ما" : "Our team"}
        title={locale === "fa" ? "مشاورانی که مسیر را می‌شناسند" : "Advisors who know the journey"}
        desc={
          locale === "fa"
            ? "تیمی از مشاوران رسمی RCIC و متخصصان مهاجرت با سال‌ها تجربه."
            : "A team of licensed RCICs and immigration specialists with years of experience."
        }
      />
      <Section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="group rounded-2xl border border-border/60 bg-background p-6"
            >
              <div className="flex items-center gap-4">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo} alt="" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-mono text-xl font-semibold text-primary">
                    {localized(m, "name", locale).charAt(0)}
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold">{localized(m, "name", locale)}</h3>
                  <p className="text-sm text-primary">{localized(m, "role", locale)}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {localized(m, "bio", locale)}
              </p>
              <div className="mt-5 flex gap-2 border-t border-border/60 pt-4">
                {m.linkedin && (
                  <a
                    href={m.linkedin}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-6">
          <Award className="h-6 w-6 text-primary" />
          <p className="text-sm text-muted-foreground">
            {locale === "fa"
              ? "تمام مشاوران ما دارای پروانه رسمی RCIC و عضو کالج مشاوران مهاجرت کانادا هستند."
              : "All our advisors are licensed RCICs and members of the College of Immigration Consultants."}
          </p>
        </div>
        <div className="mt-8 text-center">
          <Button onClick={() => navigate("/booking")}>
            {locale === "fa" ? "با تیم ما مشاوره کنید" : "Consult with our team"}
          </Button>
        </div>
      </Section>
    </div>
  );
}
