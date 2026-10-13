"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Lock, CheckCircle2, ShieldCheck } from "lucide-react";
import { useLocale, useRouter } from "@/lib/app-context";
import { PageHero, BackButton } from "../site/page-hero";
import { Section } from "../site/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/content";

type Package = {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
  priceUSD: number;
};

export function PaymentPage({ bookingId, pkgSlug }: { bookingId: string; pkgSlug: string }) {
  const { t, locale } = useLocale();
  const { navigate } = useRouter();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [ref, setRef] = useState("");
  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    fetch("/api/public")
      .then((r) => r.json())
      .then((d) => {
        const found = (d?.packages || []).find((p: Package) => p.slug === pkgSlug);
        setPkg(found || null);
      })
      .catch(() => {});
  }, [pkgSlug]);

  function formatCard(v: string) {
    return v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }
  function formatExpiry(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    if (d.length >= 3) return d.slice(0, 2) + "/" + d.slice(2);
    return d;
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || form.cardNumber.replace(/\s/g, "").length < 13 || !form.expiry || form.cvv.length < 3) {
      toast.error(locale === "fa" ? "اطلاعات کارت ناقص است" : "Card details incomplete");
      return;
    }
    setProcessing(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          ...form,
          amountUSD: pkg?.priceUSD || 0,
        }),
      });
      const data = await res.json();
      if (res.ok && data.paid) {
        setRef(data.ref);
        setDone(true);
        toast.success(t("payment.success"));
      } else {
        toast.error(data.error || (locale === "fa" ? "پرداخت ناموفق" : "Payment failed"));
      }
    } catch {
      toast.error(locale === "fa" ? "پرداخت ناموفق" : "Payment failed");
    }
    setProcessing(false);
  }

  if (done) {
    return (
      <div>
        <PageHero eyebrow={t("payment.title")} title={t("payment.success")} />
        <Section>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-lg rounded-3xl border border-border/60 bg-background p-8 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="h-9 w-9" />
            </motion.span>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight">
              {locale === "fa" ? "رزرو شما تأیید شد!" : "Your booking is confirmed!"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {locale === "fa"
                ? "یک ایمیل تأیید ارسال شد. به‌زودی برای هماهنگی تماس می‌گیریم."
                : "A confirmation email has been sent. We'll contact you shortly to coordinate."}
            </p>
            <div className="mt-6 rounded-xl border border-border/60 bg-muted/30 p-4 text-start">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{locale === "fa" ? "شماره مرجع" : "Reference"}</span>
                <span className="font-mono font-medium">{ref}</span>
              </div>
              {pkg && (
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("payment.amount")}</span>
                  <span className="font-mono font-medium">{formatCurrency(pkg.priceUSD, locale)}</span>
                </div>
              )}
            </div>
            <Button className="mt-6 w-full" onClick={() => navigate("/")}>
              {locale === "fa" ? "بازگشت به خانه" : "Back to home"}
            </Button>
          </motion.div>
        </Section>
      </div>
    );
  }

  return (
    <div>
      <PageHero eyebrow={t("payment.title")} title={t("payment.title")} />
      <Section>
        <BackButton to="/booking" label={locale === "fa" ? "بازگشت به رزرو" : "Back to booking"} />
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <form onSubmit={pay} className="lg:col-span-7">
            <div className="rounded-2xl border border-border/60 bg-background p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <CreditCard className="h-5 w-5 text-primary" />
                {locale === "fa" ? "اطلاعات کارت" : "Card details"}
              </h2>
              <div className="mt-5 space-y-4">
                <div>
                  <Label>{t("payment.name")}</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1.5"
                    placeholder={locale === "fa" ? "نام روی کارت" : "Name on card"}
                  />
                </div>
                <div>
                  <Label>{t("payment.card")}</Label>
                  <div className="relative mt-1.5">
                    <Input
                      value={form.cardNumber}
                      onChange={(e) => setForm({ ...form, cardNumber: formatCard(e.target.value) })}
                      className="font-mono ltr:pr-16 rtl:pl-16"
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                    />
                    <span className="pointer-events-none absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("payment.expiry")}</Label>
                    <Input
                      value={form.expiry}
                      onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                      className="mt-1.5 font-mono"
                      placeholder="MM/YY"
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <Label>{t("payment.cvv")}</Label>
                    <Input
                      value={form.cvv}
                      onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      className="mt-1.5 font-mono"
                      placeholder="123"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={processing} className="mt-6 w-full gap-2">
                {processing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    {t("common.loading")}
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    {pkg ? `${t("action.pay")} · ${formatCurrency(pkg.priceUSD, locale)}` : t("action.pay")}
                  </>
                )}
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                {locale === "fa"
                  ? "پرداخت امن — این یک صفحه نمایشی است"
                  : "Secure payment — this is a demo page"}
              </p>
            </div>
          </form>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-border/60 bg-background p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {locale === "fa" ? "خلاصه سفارش" : "Order summary"}
              </h3>
              {pkg ? (
                <>
                  <p className="mt-3 text-lg font-semibold">
                    {locale === "fa" ? pkg.nameFa : pkg.nameEn}
                  </p>
                  <div className="mt-4 space-y-2 border-t border-border/60 pt-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("payment.amount")}</span>
                      <span className="font-mono">{formatCurrency(pkg.priceUSD, locale)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{locale === "fa" ? "کارمزد" : "Processing fee"}</span>
                      <span className="font-mono">$0.00</span>
                    </div>
                    <div className="flex justify-between border-t border-border/60 pt-2 text-base font-semibold">
                      <span>{locale === "fa" ? "مجموع" : "Total"}</span>
                      <span className="font-mono text-primary">{formatCurrency(pkg.priceUSD, locale)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">{t("common.loading")}</p>
              )}
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );
}
