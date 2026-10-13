"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/app-context";
import { Trash2, Mail, Phone, Clock, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/content";

type Booking = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  serviceSlug: string;
  packageSlug: string;
  date: string;
  timeSlot: string;
  notes: string;
  status: string;
  amountUSD: number;
  paid: boolean;
  paymentRef: string;
  createdAt: string;
};

const statusMeta: Record<string, { fa: string; en: string; cls: string }> = {
  pending: { fa: "در انتظار", en: "Pending", cls: "bg-amber-500/10 text-amber-600" },
  confirmed: { fa: "تأیید شده", en: "Confirmed", cls: "bg-emerald-500/10 text-emerald-600" },
  completed: { fa: "تکمیل شده", en: "Completed", cls: "bg-blue-500/10 text-blue-600" },
  cancelled: { fa: "لغو شده", en: "Cancelled", cls: "bg-red-500/10 text-red-600" },
};

export function AdminBookings() {
  const { locale } = useLocale();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("all");

  async function load() {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) { toast.success(locale === "fa" ? "به‌روز شد" : "Updated"); load(); }
  }
  async function remove(id: string) {
    if (!confirm(locale === "fa" ? "حذف شود؟" : "Delete?")) return;
    const res = await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success(locale === "fa" ? "حذف شد" : "Deleted"); load(); }
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const tabs = ["all", "pending", "confirmed", "completed", "cancelled"];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{locale === "fa" ? "رزروهای مشاوره" : "Consultation bookings"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{locale === "fa" ? "مدیریت رزروهای مشتریان" : "Manage client bookings"}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tb) => (
          <button key={tb} onClick={() => setFilter(tb)} className={`rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors ${filter === tb ? "bg-primary text-primary-foreground" : "border border-border/60 text-muted-foreground hover:text-foreground"}`}>
            {tb === "all" ? (locale === "fa" ? "همه" : "All") : (locale === "fa" ? statusMeta[tb]?.fa : tb)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <p className="py-20 text-center text-sm text-muted-foreground">—</p>}
        {filtered.map((b) => {
          const meta = statusMeta[b.status] || statusMeta.pending;
          return (
            <div key={b.id} className="rounded-2xl border border-border/60 bg-background p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{b.fullName}</h3>
                    <Badge className={meta.cls}>{locale === "fa" ? meta.fa : meta.en}</Badge>
                    {b.paid && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">{locale === "fa" ? "پرداخت شده" : "Paid"}</Badge>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {b.email}</span>
                    <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> <span dir="ltr">{b.countryCode} {b.phone}</span></span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {b.date} · {b.timeSlot}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatDate(b.createdAt, locale)}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">{locale === "fa" ? "خدمت:" : "Service:"}</span> <span className="font-medium">{b.serviceSlug}</span>
                    {b.packageSlug && <> · <span className="text-muted-foreground">{locale === "fa" ? "پکیج:" : "Pkg:"}</span> <span className="font-medium">{b.packageSlug}</span></>}
                    {b.amountUSD > 0 && <> · <span className="font-mono font-semibold text-primary">{formatCurrency(b.amountUSD, locale)}</span></>}
                  </div>
                  {b.notes && <p className="mt-2 rounded-lg bg-muted/40 p-2 text-sm">{b.notes}</p>}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => setStatus(b.id, "confirmed")} className="gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {locale === "fa" ? "تأیید" : "Confirm"}</Button>
                    <Button size="sm" variant="outline" onClick={() => setStatus(b.id, "completed")} className="gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-blue-500" /> {locale === "fa" ? "تکمیل" : "Done"}</Button>
                    <Button size="sm" variant="outline" onClick={() => setStatus(b.id, "cancelled")} className="gap-1"><XCircle className="h-3.5 w-3.5 text-red-500" /> {locale === "fa" ? "لغو" : "Cancel"}</Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(b.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
