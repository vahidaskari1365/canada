"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/app-context";
import { Plus, Pencil, Trash2, X, Save, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { localized, slugify } from "@/lib/content";

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
  order: number;
  featured: boolean;
  published: boolean;
  requirements: { id?: string; textEn: string; textFa: string }[];
  steps: { id?: string; step: number; titleEn: string; titleFa: string; descEn: string; descFa: string }[];
};

const empty: Service = {
  id: "",
  slug: "",
  titleEn: "",
  titleFa: "",
  shortDescEn: "",
  shortDescFa: "",
  descEn: "",
  descFa: "",
  icon: "file-text",
  durationEn: "",
  durationFa: "",
  feeFrom: "",
  order: 0,
  featured: false,
  published: true,
  requirements: [],
  steps: [],
};

const icons = ["rocket", "map", "graduation-cap", "briefcase", "heart-handshake", "landmark", "lightbulb", "plane", "badge-check", "credit-card", "file-text"];

export function AdminServices() {
  const { locale } = useLocale();
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    const isEdit = !!editing?.id;
    const body: any = { ...editing };
    if (!isEdit && !body.slug && body.titleEn) body.slug = slugify(body.titleEn);
    const res = await fetch("/api/admin/services", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      toast.success(locale === "fa" ? "ذخیره شد" : "Saved");
      setEditing(null);
      load();
    } else {
      toast.error(locale === "fa" ? "خطا" : "Error");
    }
  }

  async function remove(id: string) {
    if (!confirm(locale === "fa" ? "حذف شود؟" : "Delete?")) return;
    const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success(locale === "fa" ? "حذف شد" : "Deleted"); load(); }
  }

  if (editing) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            {editing.id ? (locale === "fa" ? "ویرایش خدمت" : "Edit service") : (locale === "fa" ? "خدمت جدید" : "New service")}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(null)} className="gap-1.5"><X className="h-4 w-4" /> {locale === "fa" ? "انصراف" : "Cancel"}</Button>
            <Button size="sm" onClick={save} className="gap-1.5"><Save className="h-4 w-4" /> {locale === "fa" ? "ذخیره" : "Save"}</Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-background p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="mt-1.5 font-mono text-sm" dir="ltr" /></div>
              <div>
                <Label>{locale === "fa" ? "آیکن" : "Icon"}</Label>
                <Select value={editing.icon} onValueChange={(v) => setEditing({ ...editing, icon: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{icons.map((ic) => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>{locale === "fa" ? "عنوان (فارسی)" : "Title (Fa)"}</Label><Input value={editing.titleFa} onChange={(e) => setEditing({ ...editing, titleFa: e.target.value })} className="mt-1.5" dir="rtl" /></div>
              <div><Label>{locale === "fa" ? "عنوان (انگلیسی)" : "Title (En)"}</Label><Input value={editing.titleEn} onChange={(e) => setEditing({ ...editing, titleEn: e.target.value })} className="mt-1.5" dir="ltr" /></div>
              <div className="sm:col-span-2"><Label>{locale === "fa" ? "توضیح کوتاه (فارسی)" : "Short desc (Fa)"}</Label><Input value={editing.shortDescFa} onChange={(e) => setEditing({ ...editing, shortDescFa: e.target.value })} className="mt-1.5" dir="rtl" /></div>
              <div className="sm:col-span-2"><Label>{locale === "fa" ? "توضیح کوتاه (انگلیسی)" : "Short desc (En)"}</Label><Input value={editing.shortDescEn} onChange={(e) => setEditing({ ...editing, shortDescEn: e.target.value })} className="mt-1.5" dir="ltr" /></div>
              <div className="sm:col-span-2"><Label>{locale === "fa" ? "توضیح کامل (فارسی)" : "Description (Fa)"}</Label><Textarea value={editing.descFa} onChange={(e) => setEditing({ ...editing, descFa: e.target.value })} rows={5} className="mt-1.5" dir="rtl" /></div>
              <div className="sm:col-span-2"><Label>{locale === "fa" ? "توضیح کامل (انگلیسی)" : "Description (En)"}</Label><Textarea value={editing.descEn} onChange={(e) => setEditing({ ...editing, descEn: e.target.value })} rows={5} className="mt-1.5" dir="ltr" /></div>
              <div><Label>{locale === "fa" ? "مدت زمان (فارسی)" : "Duration (Fa)"}</Label><Input value={editing.durationFa} onChange={(e) => setEditing({ ...editing, durationFa: e.target.value })} className="mt-1.5" dir="rtl" /></div>
              <div><Label>{locale === "fa" ? "مدت زمان (انگلیسی)" : "Duration (En)"}</Label><Input value={editing.durationEn} onChange={(e) => setEditing({ ...editing, durationEn: e.target.value })} className="mt-1.5" dir="ltr" /></div>
              <div><Label>{locale === "fa" ? "هزینه از" : "Fee from"}</Label><Input value={editing.feeFrom} onChange={(e) => setEditing({ ...editing, feeFrom: e.target.value })} className="mt-1.5" dir="ltr" /></div>
              <div><Label>{locale === "fa" ? "ترتیب" : "Order"}</Label><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} className="mt-1.5" /></div>
              <div className="flex items-center gap-6 sm:col-span-2">
                <label className="flex items-center gap-2 text-sm"><Switch checked={editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} />{locale === "fa" ? "منتشر شده" : "Published"}</label>
                <label className="flex items-center gap-2 text-sm"><Switch checked={editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} />{locale === "fa" ? "ویژه" : "Featured"}</label>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="rounded-2xl border border-border/60 bg-background p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{locale === "fa" ? "الزامات" : "Requirements"}</h2>
              <Button size="sm" variant="outline" onClick={() => setEditing({ ...editing, requirements: [...editing.requirements, { textEn: "", textFa: "" }] })} className="gap-1.5"><Plus className="h-3.5 w-3.5" /> {locale === "fa" ? "افزودن" : "Add"}</Button>
            </div>
            <div className="space-y-2">
              {editing.requirements.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={r.textFa} onChange={(e) => { const arr = [...editing.requirements]; arr[i] = { ...arr[i], textFa: e.target.value }; setEditing({ ...editing, requirements: arr }); }} placeholder="فارسی" dir="rtl" />
                  <Input value={r.textEn} onChange={(e) => { const arr = [...editing.requirements]; arr[i] = { ...arr[i], textEn: e.target.value }; setEditing({ ...editing, requirements: arr }); }} placeholder="English" dir="ltr" />
                  <Button size="icon" variant="ghost" onClick={() => setEditing({ ...editing, requirements: editing.requirements.filter((_, j) => j !== i) })} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="rounded-2xl border border-border/60 bg-background p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{locale === "fa" ? "مراحل" : "Steps"}</h2>
              <Button size="sm" variant="outline" onClick={() => setEditing({ ...editing, steps: [...editing.steps, { step: editing.steps.length + 1, titleEn: "", titleFa: "", descEn: "", descFa: "" }] })} className="gap-1.5"><Plus className="h-3.5 w-3.5" /> {locale === "fa" ? "افزودن" : "Add"}</Button>
            </div>
            <div className="space-y-3">
              {editing.steps.map((s, i) => (
                <div key={i} className="rounded-xl border border-border/60 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm font-semibold">{i + 1}</span>
                    <Button size="icon" variant="ghost" onClick={() => setEditing({ ...editing, steps: editing.steps.filter((_, j) => j !== i) })} className="ms-auto text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Input value={s.titleFa} onChange={(e) => { const arr = [...editing.steps]; arr[i] = { ...arr[i], titleFa: e.target.value }; setEditing({ ...editing, steps: arr }); }} placeholder="عنوان فارسی" dir="rtl" />
                    <Input value={s.titleEn} onChange={(e) => { const arr = [...editing.steps]; arr[i] = { ...arr[i], titleEn: e.target.value }; setEditing({ ...editing, steps: arr }); }} placeholder="Title English" dir="ltr" />
                    <Textarea value={s.descFa} onChange={(e) => { const arr = [...editing.steps]; arr[i] = { ...arr[i], descFa: e.target.value }; setEditing({ ...editing, steps: arr }); }} placeholder="توضیح فارسی" rows={2} dir="rtl" />
                    <Textarea value={s.descEn} onChange={(e) => { const arr = [...editing.steps]; arr[i] = { ...arr[i], descEn: e.target.value }; setEditing({ ...editing, steps: arr }); }} placeholder="Description English" rows={2} dir="ltr" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{locale === "fa" ? "خدمات" : "Services"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{locale === "fa" ? "مدیریت خدمات مهاجرتی" : "Manage immigration services"}</p>
        </div>
        <Button onClick={() => setEditing({ ...empty })} className="gap-1.5"><Plus className="h-4 w-4" /> {locale === "fa" ? "خدمت جدید" : "New service"}</Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-muted-foreground">{locale === "fa" ? "در حال بارگذاری..." : "Loading..."}</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60">
          <div className="divide-y divide-border/60">
            {services.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-4">
                <span className={`inline-flex h-2 w-2 shrink-0 rounded-full ${s.published ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{localized(s, "title", locale)}</p>
                  <p className="truncate text-xs text-muted-foreground">/{s.slug} · {s.order}</p>
                </div>
                {s.featured && <Badge>★</Badge>}
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(s)} className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(s.id)} className="h-8 w-8 text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
