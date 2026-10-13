"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { PageHero, BackButton } from "../site/page-hero";
import { Section } from "../site/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function AssessmentPage() {
  const { t, locale, dir } = useLocale();
  const { navigate } = useRouter();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; eligibility: string } | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    educationEn: "",
    experienceYears: "",
    ieltsScore: "",
    fieldEn: "",
    targetProgram: "express-entry",
    notes: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.age || !form.educationEn || !form.experienceYears) {
      toast.error(locale === "fa" ? "لطفاً همه فیلدهای الزامی را پر کنید" : "Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ score: data.score, eligibility: data.eligibility });
      } else {
        toast.error(data.error || (locale === "fa" ? "خطا در ارسال" : "Submission failed"));
      }
    } catch {
      toast.error(locale === "fa" ? "خطا در ارسال" : "Submission failed");
    }
    setSubmitting(false);
  }

  const eligibilityMeta: Record<string, { fa: string; en: string; color: string }> = {
    high: { fa: "شانس بالا", en: "High chance", color: "emerald" },
    medium: { fa: "شانس متوسط", en: "Medium chance", color: "amber" },
    low: { fa: "نیاز به بررسی", en: "Needs review", color: "primary" },
  };

  if (result) {
    const meta = eligibilityMeta[result.eligibility] || eligibilityMeta.low;
    return (
      <div>
        <PageHero eyebrow={t("action.freeAssessment")} title={locale === "fa" ? "نتیجه ارزیابی شما" : "Your assessment result"} />
        <Section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl rounded-3xl border border-border/60 bg-background p-8 text-center"
          >
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-8 w-8" />
            </span>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight">
              {locale === "fa" ? "امتیاز تخمینی شما" : "Your estimated score"}
            </h2>
            <p className="mt-2 font-mono text-6xl font-semibold text-primary">{result.score}</p>
            <div className={`mt-4 inline-flex items-center gap-2 rounded-full bg-${meta.color}-500/10 px-4 py-1.5 text-sm font-medium text-${meta.color}-600 dark:text-${meta.color}-400`}>
              <CheckCircle2 className="h-4 w-4" />
              {locale === "fa" ? meta.fa : meta.en}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {locale === "fa"
                ? "این یک تخمین اولیه است. برای تحلیل دقیق و نقشه راه اختصاصی، یک مشاوره تخصصی رزرو کنید."
                : "This is a preliminary estimate. For a detailed analysis and tailored roadmap, book an expert consultation."}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button className="gap-1.5" onClick={() => navigate("/booking")}>
                {t("action.bookConsult")}
                <Arrow className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => navigate("/services")}>
                {t("nav.services")}
              </Button>
            </div>
          </motion.div>
        </Section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow={t("action.freeAssessment")}
        title={locale === "fa" ? "ارزیابی رایگان واجد شرایطی" : "Free eligibility assessment"}
        desc={
          locale === "fa"
            ? "اطلاعات خود را وارد کنید تا در کمتر از ۲۴ ساعت تحلیل اولیه و امتیاز تخمینی دریافت کنید."
            : "Enter your details to get a preliminary analysis and estimated score within 24 hours."
        }
      />
      <Section>
        <BackButton to="/" label={locale === "fa" ? "بازگشت به خانه" : "Back to home"} />
        <form onSubmit={submit} className="mt-8 mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border/60 bg-background p-6 md:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>{t("booking.fullName")} *</Label>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>{t("booking.email")} *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>{t("booking.phone")} *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>{locale === "fa" ? "سن" : "Age"} *</Label>
                <Input
                  type="number"
                  min={18}
                  max={65}
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>{locale === "fa" ? "آخرین مدرک تحصیلی" : "Highest education"} *</Label>
                <Select value={form.educationEn} onValueChange={(v) => setForm({ ...form, educationEn: v })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={locale === "fa" ? "انتخاب کنید" : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">{locale === "fa" ? "دیپلم" : "High School"}</SelectItem>
                    <SelectItem value="Diploma">{locale === "fa" ? "فوق دیپلم" : "Diploma"}</SelectItem>
                    <SelectItem value="Bachelor">{locale === "fa" ? "لیسانس" : "Bachelor"}</SelectItem>
                    <SelectItem value="Master">{locale === "fa" ? "فوق لیسانس" : "Master"}</SelectItem>
                    <SelectItem value="PhD">{locale === "fa" ? "دکتری" : "PhD"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{locale === "fa" ? "سابقه کار (سال)" : "Work experience (years)"} *</Label>
                <Input
                  type="number"
                  min={0}
                  max={40}
                  value={form.experienceYears}
                  onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>{locale === "fa" ? "نمره آیلتس (اختیاری)" : "IELTS score (optional)"}</Label>
                <Input
                  value={form.ieltsScore}
                  onChange={(e) => setForm({ ...form, ieltsScore: e.target.value })}
                  className="mt-1.5"
                  placeholder="7.0"
                  inputMode="decimal"
                />
              </div>
              <div>
                <Label>{locale === "fa" ? "رشته تحصیلی (اختیاری)" : "Field of study (optional)"}</Label>
                <Input
                  value={form.fieldEn}
                  onChange={(e) => setForm({ ...form, fieldEn: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>{locale === "fa" ? "برنامه هدف" : "Target program"}</Label>
                <Select value={form.targetProgram} onValueChange={(v) => setForm({ ...form, targetProgram: v })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="express-entry">{locale === "fa" ? "اکسپرس اینتری" : "Express Entry"}</SelectItem>
                    <SelectItem value="pnp">{locale === "fa" ? "برنامه استانی" : "Provincial Nominee"}</SelectItem>
                    <SelectItem value="study">{locale === "fa" ? "ویزای تحصیلی" : "Study Permit"}</SelectItem>
                    <SelectItem value="work">{locale === "fa" ? "ویزای کار" : "Work Permit"}</SelectItem>
                    <SelectItem value="business">{locale === "fa" ? "تجاری/سرمایه‌گذاری" : "Business/Investor"}</SelectItem>
                    <SelectItem value="family">{locale === "fa" ? "اسپانسر خانوادگی" : "Family Sponsorship"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={submitting} className="mt-6 w-full gap-1.5">
              {submitting ? t("common.loading") : locale === "fa" ? "دریافت ارزیابی رایگان" : "Get free assessment"}
              {!submitting && <Arrow className="h-4 w-4" />}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {locale === "fa"
                ? "اطلاعات شما محرمانه است و فقط برای ارزیابی استفاده می‌شود."
                : "Your information is confidential and used only for assessment."}
            </p>
          </div>
        </form>
      </Section>
    </div>
  );
}
