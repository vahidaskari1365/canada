"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { PageHero, BackButton } from "../site/page-hero";
import { Section } from "../site/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { localized, formatCurrency } from "@/lib/content";

type Package = {
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
type Service = {
  id: string;
  slug: string;
  titleEn: string;
  titleFa: string;
};

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

export function BookingPage({ initialPkg = "" }: { initialPkg?: string }) {
  const { t, locale } = useLocale();
  const { navigate } = useRouter();
  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [pkgSlug, setPkgSlug] = useState(initialPkg);
  const [serviceSlug, setServiceSlug] = useState("general");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+98",
    preferredLang: "fa",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/public")
      .then((r) => r.json())
      .then((d) => {
        setPackages(Array.isArray(d?.packages) ? d.packages : []);
        // auto-advance to step 2 if a package was pre-selected
        if (initialPkg) setStep(2);
      })
      .catch(() => {});
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setServices(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [initialPkg]);

  const selectedPkg = packages.find((p) => p.slug === pkgSlug);

  const days = (() => {
    const arr: { date: string; day: number; weekday: string }[] = [];
    const wdf = ["یک", "دو", "سه", "چهار", "پنج", "جم", "شن"];
    const wde = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push({
        date: d.toISOString().slice(0, 10),
        day: d.getDate(),
        weekday: locale === "fa" ? wdf[d.getDay()] : wde[d.getDay()],
      });
    }
    return arr;
  })();

  async function submit() {
    if (!form.fullName || !form.email || !form.phone || !date || !timeSlot) {
      toast.error(locale === "fa" ? "لطفاً همه فیلدها را پر کنید" : "Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          serviceSlug,
          packageSlug: pkgSlug,
          date,
          timeSlot,
          amountUSD: selectedPkg?.priceUSD || 0,
        }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        if (selectedPkg && selectedPkg.priceUSD > 0) {
          navigate(`/payment?booking=${data.id}&pkg=${pkgSlug}`);
        } else {
          toast.success(locale === "fa" ? "رزرو ثبت شد! به‌زودی تماس می‌گیریم." : "Booking received! We'll contact you soon.");
          navigate("/");
        }
      } else {
        toast.error(data.error || (locale === "fa" ? "خطا در ثبت" : "Booking failed"));
      }
    } catch {
      toast.error(locale === "fa" ? "خطا در ثبت" : "Booking failed");
    }
    setSubmitting(false);
  }

  return (
    <div>
      <PageHero
        eyebrow={locale === "fa" ? "رزرو مشاوره" : "Consultation booking"}
        title={t("booking.title")}
        desc={
          locale === "fa"
            ? "در سه گام ساده مشاوره خود را رزرو کنید: پکیج، زمان و اطلاعات."
            : "Book your consultation in three simple steps: package, time and details."
        }
      />

      <Section>
        <BackButton to="/" label={locale === "fa" ? "بازگشت به خانه" : "Back to home"} />

        {/* Stepper */}
        <div className="mt-8 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="h-4 w-4" /> : s}
              </span>
              {s < 3 && (
                <span
                  className={`h-0.5 flex-1 rounded-full transition-colors ${
                    step > s ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* STEP 1: package */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-semibold">
                  {locale === "fa" ? "پکیج مشاوره را انتخاب کنید" : "Choose a consultation package"}
                </h2>
                <div className="mt-5 space-y-3">
                  {packages.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPkgSlug(p.slug)}
                      className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-start transition-all ${
                        pkgSlug === p.slug
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/60 hover:border-primary/40"
                      }`}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          pkgSlug === p.slug ? "border-primary bg-primary text-primary-foreground" : "border-border"
                        }`}
                      >
                        {pkgSlug === p.slug && <Check className="h-3 w-3" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{localized(p, "name", locale)}</p>
                          {p.popular && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                              {locale === "fa" ? "محبوب" : "Popular"}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {localized(p, "desc", locale)}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {locale === "fa" ? p.durationFa : p.durationEn}
                        </p>
                      </div>
                      <span className="font-mono text-lg font-semibold">
                        {formatCurrency(p.priceUSD, locale)}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    disabled={!pkgSlug}
                    onClick={() => setStep(2)}
                    className="gap-1.5"
                  >
                    {t("common.next")}
                    <ChevronRight className="h-4 w-4 rtl:hidden" />
                    <ChevronLeft className="h-4 w-4 hidden rtl:block" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: date/time */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-semibold">
                  {locale === "fa" ? "تاریخ و ساعت را انتخاب کنید" : "Pick a date and time"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {locale === "fa"
                    ? "همه زمان‌ها به وقت تورنتو (EST) هستند."
                    : "All times are in Toronto (EST)."}
                </p>

                {/* date scroller */}
                <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {days.map((d) => (
                    <button
                      key={d.date}
                      onClick={() => setDate(d.date)}
                      className={`flex w-16 shrink-0 flex-col items-center gap-1 rounded-xl border py-3 transition-colors ${
                        date === d.date
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/60 hover:border-primary/40"
                      }`}
                    >
                      <span className="text-[10px] uppercase">{d.weekday}</span>
                      <span className="font-mono text-lg font-semibold">{d.day}</span>
                    </button>
                  ))}
                </div>

                {/* time slots */}
                {date && (
                  <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {timeSlots.map((ts) => (
                      <button
                        key={ts}
                        onClick={() => setTimeSlot(ts)}
                        className={`rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                          timeSlot === ts
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border/60 hover:border-primary/40"
                        }`}
                      >
                        {ts}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    {t("common.prev")}
                  </Button>
                  <Button
                    disabled={!date || !timeSlot}
                    onClick={() => setStep(3)}
                    className="gap-1.5"
                  >
                    {t("common.next")}
                    <ChevronRight className="h-4 w-4 rtl:hidden" />
                    <ChevronLeft className="h-4 w-4 hidden rtl:block" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: details */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-semibold">
                  {locale === "fa" ? "اطلاعات تماس شما" : "Your contact details"}
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
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
                    <div className="mt-1.5 flex gap-2">
                      <Select
                        value={form.countryCode}
                        onValueChange={(v) => setForm({ ...form, countryCode: v })}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+98">+98</SelectItem>
                          <SelectItem value="+1">+1</SelectItem>
                          <SelectItem value="+44">+44</SelectItem>
                          <SelectItem value="+971">+971</SelectItem>
                          <SelectItem value="+966">+966</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>{t("booking.service")}</Label>
                    <Select value={serviceSlug} onValueChange={setServiceSlug}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">
                          {locale === "fa" ? "مشاوره عمومی" : "General"}
                        </SelectItem>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.slug}>
                            {localized(s, "title", locale)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("booking.lang")}</Label>
                    <Select
                      value={form.preferredLang}
                      onValueChange={(v) => setForm({ ...form, preferredLang: v })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fa">فارسی</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>{t("booking.notes")}</Label>
                    <Textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={3}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    {t("common.prev")}
                  </Button>
                  <Button onClick={submit} disabled={submitting} className="gap-1.5">
                    {submitting
                      ? t("common.loading")
                      : selectedPkg && selectedPkg.priceUSD > 0
                      ? `${t("action.pay")} · ${formatCurrency(selectedPkg.priceUSD, locale)}`
                      : t("action.submit")}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border/60 bg-background p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {locale === "fa" ? "خلاصه رزرو" : "Booking summary"}
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">{t("booking.package")}</dt>
                  <dd className="text-end font-medium">
                    {selectedPkg ? localized(selectedPkg, "name", locale) : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">{t("booking.date")}</dt>
                  <dd className="text-end font-medium">{date || "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">{t("booking.time")}</dt>
                  <dd className="text-end font-medium">{timeSlot || "—"}</dd>
                </div>
                {selectedPkg && (
                  <div className="flex justify-between gap-2 border-t border-border/60 pt-3">
                    <dt className="text-muted-foreground">{t("payment.amount")}</dt>
                    <dd className="text-end font-mono text-lg font-semibold text-primary">
                      {formatCurrency(selectedPkg.priceUSD, locale)}
                    </dd>
                  </div>
                )}
              </dl>
              {selectedPkg && (
                <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
                  {(locale === "fa" ? selectedPkg.featuresFa : selectedPkg.featuresEn)
                    .split("\n")
                    .filter(Boolean)
                    .map((f, i) => (
                      <p key={i} className="flex gap-2 text-xs text-muted-foreground">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        {f.trim()}
                      </p>
                    ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );
}
