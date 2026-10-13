"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/app-context";
import { Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Block = {
  id: string;
  page: string;
  section: string;
  key: string;
  valueEn: string;
  valueFa: string;
};

export function AdminContent() {
  const { locale } = useLocale();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [page, setPage] = useState("home");
  const [section, setSection] = useState("");
  const [key, setKey] = useState("");
  const [valueEn, setValueEn] = useState("");
  const [valueFa, setValueFa] = useState("");

  async function load() {
    const res = await fetch("/api/admin/content");
    const data = await res.json();
    setBlocks(Array.isArray(data) ? data : []);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!page || !section || !key) {
      toast.error(locale === "fa" ? "page/section/key الزامی است" : "page/section/key required");
      return;
    }
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, section, key, valueEn, valueFa }),
    });
    if (res.ok) {
      toast.success(locale === "fa" ? "ذخیره شد" : "Saved");
      setPage("home"); setSection(""); setKey(""); setValueEn(""); setValueFa("");
      load();
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/content?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success(locale === "fa" ? "حذف شد" : "Deleted"); load(); }
  }

  // group by page
  const grouped: Record<string, Block[]> = {};
  for (const b of blocks) {
    (grouped[b.page] = grouped[b.page] || []).push(b);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{locale === "fa" ? "مدیریت محتوا" : "Content management"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {locale === "fa"
            ? "متن‌های قابل ویرایش سایت را اینجا مدیریت کنید (برای توسعه‌دهنده: کلیدها در صفحه خوانده می‌شوند)."
            : "Manage editable site text here (keys are read on the page by developers)."}
        </p>
      </div>

      {/* Add/edit */}
      <div className="mb-8 rounded-2xl border border-border/60 bg-background p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {locale === "fa" ? "افزودن/ویرایش محتوا" : "Add/edit content"}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div><Label>Page</Label><Input value={page} onChange={(e) => setPage(e.target.value)} className="mt-1.5 font-mono text-sm" dir="ltr" placeholder="home" /></div>
          <div><Label>Section</Label><Input value={section} onChange={(e) => setSection(e.target.value)} className="mt-1.5 font-mono text-sm" dir="ltr" placeholder="hero" /></div>
          <div><Label>Key</Label><Input value={key} onChange={(e) => setKey(e.target.value)} className="mt-1.5 font-mono text-sm" dir="ltr" placeholder="title" /></div>
          <div><Label>Value (Fa)</Label><Textarea value={valueFa} onChange={(e) => setValueFa(e.target.value)} rows={2} className="mt-1.5" dir="rtl" /></div>
          <div className="sm:col-span-2"><Label>Value (En)</Label><Textarea value={valueEn} onChange={(e) => setValueEn(e.target.value)} rows={2} className="mt-1.5" dir="ltr" /></div>
        </div>
        <Button onClick={save} className="mt-4 gap-1.5"><Save className="h-4 w-4" /> {locale === "fa" ? "ذخیره" : "Save"}</Button>
      </div>

      {/* Existing */}
      {Object.entries(grouped).map(([pg, items]) => (
        <div key={pg} className="mb-6">
          <h3 className="mb-2 font-mono text-sm font-semibold text-muted-foreground">{pg}</h3>
          <div className="overflow-hidden rounded-2xl border border-border/60">
            <div className="divide-y divide-border/60">
              {items.map((b) => (
                <div key={b.id} className="flex items-start gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-muted-foreground">{b.section} / {b.key}</p>
                    <p className="mt-1 text-sm" dir="rtl">{b.valueFa}</p>
                    <p className="text-sm text-muted-foreground" dir="ltr">{b.valueEn}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => remove(b.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
