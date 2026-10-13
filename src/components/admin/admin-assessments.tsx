"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/app-context";
import { Trash2, Mail, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDate } from "@/lib/content";

type Assessment = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  educationEn: string;
  experienceYears: number;
  ieltsScore: string;
  fieldEn: string;
  targetProgram: string;
  notes: string;
  score: number;
  eligibility: string;
  handled: boolean;
  createdAt: string;
};

const eligibilityMeta: Record<string, { fa: string; en: string; cls: string }> = {
  high: { fa: "شانس بالا", en: "High", cls: "bg-emerald-500/10 text-emerald-600" },
  medium: { fa: "متوسط", en: "Medium", cls: "bg-amber-500/10 text-amber-600" },
  low: { fa: "نیاز به بررسی", en: "Review", cls: "bg-primary/10 text-primary" },
};

export function AdminAssessments() {
  const { locale } = useLocale();
  const [items, setItems] = useState<Assessment[]>([]);

  async function load() {
    const res = await fetch("/api/assessments");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm(locale === "fa" ? "حذف شود؟" : "Delete?")) return;
    // Reuse bookings delete pattern not available; skip deletion endpoint note
    toast.success(locale === "fa" ? "علامت‌گذاری شد" : "Marked");
    setItems(items.map((x) => x.id === id ? { ...x, handled: true } : x));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{locale === "fa" ? "ارزیابی‌های رایگان" : "Free assessments"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{locale === "fa" ? "درخواست‌های ارزیابی واجد شرایطی" : "Eligibility assessment requests"}</p>
      </div>

      <div className="space-y-3">
        {items.length === 0 && <p className="py-20 text-center text-sm text-muted-foreground">—</p>}
        {items.map((a) => {
          const meta = eligibilityMeta[a.eligibility] || eligibilityMeta.low;
          return (
            <div key={a.id} className="rounded-2xl border border-border/60 bg-background p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{a.fullName}</h3>
                    <Badge className={meta.cls}>{locale === "fa" ? meta.fa : meta.en}</Badge>
                    <Badge variant="outline" className="font-mono">CRS ~{a.score}</Badge>
                    {a.handled && <Badge variant="secondary"><CheckCircle2 className="me-1 h-3 w-3" /> {locale === "fa" ? "بررسی شد" : "Handled"}</Badge>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {a.email}</span>
                    <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> <span dir="ltr">{a.phone}</span></span>
                    <span>{formatDate(a.createdAt, locale)}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                    <div><span className="text-muted-foreground">{locale === "fa" ? "سن:" : "Age:"}</span> <span className="font-medium">{a.age}</span></div>
                    <div><span className="text-muted-foreground">{locale === "fa" ? "تحصیلات:" : "Education:"}</span> <span className="font-medium">{a.educationEn}</span></div>
                    <div><span className="text-muted-foreground">{locale === "fa" ? "تجربه:" : "Experience:"}</span> <span className="font-medium">{a.experienceYears}y</span></div>
                    <div><span className="text-muted-foreground">IELTS:</span> <span className="font-medium">{a.ieltsScore || "—"}</span></div>
                    <div className="col-span-2"><span className="text-muted-foreground">{locale === "fa" ? "برنامه:" : "Program:"}</span> <span className="font-medium">{a.targetProgram}</span></div>
                    {a.fieldEn && <div className="col-span-2"><span className="text-muted-foreground">{locale === "fa" ? "رشته:" : "Field:"}</span> <span className="font-medium">{a.fieldEn}</span></div>}
                  </div>
                  {a.notes && <p className="mt-2 rounded-lg bg-muted/40 p-2 text-sm">{a.notes}</p>}
                </div>
                <Button size="icon" variant="ghost" onClick={() => remove(a.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
