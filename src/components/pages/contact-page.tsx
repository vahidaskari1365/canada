"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { useLocale } from "@/lib/app-context";
import { PageHero } from "../site/page-hero";
import { Section } from "../site/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ContactPage() {
  const { locale } = useLocale();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    fetch("/api/public")
      .then((r) => r.json())
      .then((d) => setSettings(d?.settings || {}))
      .catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(locale === "fa" ? "لطفاً فیلدها را پر کنید" : "Please fill the fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(locale === "fa" ? "پیام شما ارسال شد!" : "Message sent!");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(locale === "fa" ? "خطا در ارسال" : "Failed to send");
      }
    } catch {
      toast.error(locale === "fa" ? "خطا در ارسال" : "Failed to send");
    }
    setSubmitting(false);
  }

  const contactInfo = [
    {
      icon: Phone,
      label: locale === "fa" ? "تلفن" : "Phone",
      value: settings["site.phone"] || "+1 (416) 555-0142",
      dir: "ltr" as const,
    },
    {
      icon: Mail,
      label: locale === "fa" ? "ایمیل" : "Email",
      value: settings["site.email"] || "hello@maplebridge.ca",
    },
    {
      icon: MapPin,
      label: locale === "fa" ? "آدرس" : "Address",
      value:
        locale === "fa"
          ? settings["site.addressFa"] || "تورنتو، انتاریو، کانادا"
          : settings["site.addressEn"] || "Toronto, ON, Canada",
    },
  ];

  return (
    <div>
      <PageHero
        eyebrow={locale === "fa" ? "تماس با ما" : "Contact us"}
        title={locale === "fa" ? "سؤالی دارید؟ در خدمتیم." : "Have a question? We're here."}
        desc={
          locale === "fa"
            ? "فرم زیر را پر کنید یا مستقیم با ما تماس بگیرید. پاسخ زیر ۲۴ ساعت."
            : "Fill the form below or reach out directly. Reply within 24 hours."
        }
      />
      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={submit} className="rounded-2xl border border-border/60 bg-background p-6 md:p-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <MessageSquare className="h-5 w-5 text-primary" />
                {locale === "fa" ? "ارسال پیام" : "Send a message"}
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label>{locale === "fa" ? "نام" : "Name"} *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>{locale === "fa" ? "ایمیل" : "Email"} *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>{locale === "fa" ? "موضوع" : "Subject"}</Label>
                  <Input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>{locale === "fa" ? "پیام" : "Message"} *</Label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="mt-6 gap-1.5">
                {submitting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {t(locale)}
              </Button>
            </form>
          </div>

          {/* Info */}
          <aside className="lg:col-span-5">
            <div className="space-y-4">
              {contactInfo.map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 rounded-2xl border border-border/60 bg-background p-5"
                  >
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                      <p className="mt-1 font-medium" dir={c.dir}>{c.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6">
              <h3 className="text-lg font-semibold">
                {locale === "fa" ? "ساعات کاری" : "Office hours"}
              </h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{locale === "fa" ? "دوشنبه - جمعه" : "Mon - Fri"}</dt>
                  <dd className="font-mono">9:00 - 18:00 EST</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{locale === "fa" ? "شنبه" : "Saturday"}</dt>
                  <dd className="font-mono">10:00 - 14:00 EST</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{locale === "fa" ? "یکشنبه" : "Sunday"}</dt>
                  <dd className="font-mono text-muted-foreground">{locale === "fa" ? "تعطیل" : "Closed"}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );

  function t(l: "fa" | "en") {
    return l === "fa" ? "ارسال پیام" : "Send message";
  }
}
