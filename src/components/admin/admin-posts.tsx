"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/app-context";
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { localized, formatDate, slugify } from "@/lib/content";

type Post = {
  id: string;
  slug: string;
  titleEn: string;
  titleFa: string;
  excerptEn: string;
  excerptFa: string;
  contentEn: string;
  contentFa: string;
  coverImage: string;
  type: string;
  categoryId: string | null;
  authorEn: string;
  authorFa: string;
  readingTime: number;
  featured: boolean;
  published: boolean;
  tagsEn: string;
  tagsFa: string;
  publishedAt: string;
  category?: { nameEn: string; nameFa: string } | null;
};
type Category = { id: string; nameEn: string; nameFa: string };

const empty = {
  slug: "",
  titleEn: "",
  titleFa: "",
  excerptEn: "",
  excerptFa: "",
  contentEn: "",
  contentFa: "",
  coverImage: "",
  type: "blog",
  categoryId: "",
  authorEn: "Maple Bridge Team",
  authorFa: "تیم میپل بریج",
  readingTime: 5,
  featured: false,
  published: true,
  tagsEn: "",
  tagsFa: "",
};

export function AdminPosts() {
  const { locale } = useLocale();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [p, pub] = await Promise.all([
      fetch("/api/admin/posts").then((r) => r.json()),
      fetch("/api/public").then((r) => r.json()),
    ]);
    setPosts(Array.isArray(p) ? p : []);
    setCategories(Array.isArray(pub?.categories) ? pub.categories : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function newPost() {
    setEditing({ ...empty, publishedAt: new Date().toISOString().slice(0, 10) });
  }

  async function save() {
    const isEdit = !!editing.id;
    const body = { ...editing };
    if (!isEdit && !body.slug && body.titleEn) body.slug = slugify(body.titleEn);
    const res = await fetch("/api/admin/posts", {
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
    const res = await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success(locale === "fa" ? "حذف شد" : "Deleted");
      load();
    }
  }

  if (editing) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            {editing.id ? (locale === "fa" ? "ویرایش مقاله" : "Edit article") : (locale === "fa" ? "مقاله جدید" : "New article")}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(null)} className="gap-1.5">
              <X className="h-4 w-4" /> {locale === "fa" ? "انصراف" : "Cancel"}
            </Button>
            <Button size="sm" onClick={save} className="gap-1.5">
              <Save className="h-4 w-4" /> {locale === "fa" ? "ذخیره" : "Save"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Meta */}
          <div className="rounded-2xl border border-border/60 bg-background p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {locale === "fa" ? "اطلاعات اصلی" : "Core info"}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Slug (URL)</Label>
                <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="mt-1.5 font-mono text-sm" dir="ltr" />
              </div>
              <div>
                <Label>{locale === "fa" ? "نوع" : "Type"}</Label>
                <Select value={editing.type} onValueChange={(v) => setEditing({ ...editing, type: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">{locale === "fa" ? "بلاگ" : "Blog"}</SelectItem>
                    <SelectItem value="news">{locale === "fa" ? "خبر" : "News"}</SelectItem>
                    <SelectItem value="guide">{locale === "fa" ? "راهنما" : "Guide"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{locale === "fa" ? "عنوان (فارسی)" : "Title (Fa)"}</Label>
                <Input value={editing.titleFa} onChange={(e) => setEditing({ ...editing, titleFa: e.target.value })} className="mt-1.5" dir="rtl" />
              </div>
              <div>
                <Label>{locale === "fa" ? "عنوان (انگلیسی)" : "Title (En)"}</Label>
                <Input value={editing.titleEn} onChange={(e) => setEditing({ ...editing, titleEn: e.target.value })} className="mt-1.5" dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                <Label>{locale === "fa" ? "خلاصه (فارسی)" : "Excerpt (Fa)"}</Label>
                <Textarea value={editing.excerptFa} onChange={(e) => setEditing({ ...editing, excerptFa: e.target.value })} rows={2} className="mt-1.5" dir="rtl" />
              </div>
              <div className="sm:col-span-2">
                <Label>{locale === "fa" ? "خلاصه (انگلیسی)" : "Excerpt (En)"}</Label>
                <Textarea value={editing.excerptEn} onChange={(e) => setEditing({ ...editing, excerptEn: e.target.value })} rows={2} className="mt-1.5" dir="ltr" />
              </div>
              <div>
                <Label>{locale === "fa" ? "تصویر کاور (URL)" : "Cover image (URL)"}</Label>
                <Input value={editing.coverImage} onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })} className="mt-1.5" dir="ltr" placeholder="https://..." />
              </div>
              <div>
                <Label>{locale === "fa" ? "دسته‌بندی" : "Category"}</Label>
                <Select value={editing.categoryId || "none"} onValueChange={(v) => setEditing({ ...editing, categoryId: v === "none" ? "" : v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">—</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{locale === "fa" ? c.nameFa : c.nameEn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{locale === "fa" ? "نویسنده (فارسی)" : "Author (Fa)"}</Label>
                <Input value={editing.authorFa} onChange={(e) => setEditing({ ...editing, authorFa: e.target.value })} className="mt-1.5" dir="rtl" />
              </div>
              <div>
                <Label>{locale === "fa" ? "نویسنده (انگلیسی)" : "Author (En)"}</Label>
                <Input value={editing.authorEn} onChange={(e) => setEditing({ ...editing, authorEn: e.target.value })} className="mt-1.5" dir="ltr" />
              </div>
              <div>
                <Label>{locale === "fa" ? "زمان مطالعه (دقیقه)" : "Reading time (min)"}</Label>
                <Input type="number" value={editing.readingTime} onChange={(e) => setEditing({ ...editing, readingTime: Number(e.target.value) })} className="mt-1.5" />
              </div>
              <div>
                <Label>{locale === "fa" ? "تاریخ انتشار" : "Publish date"}</Label>
                <Input type="date" value={editing.publishedAt?.slice(0, 10)} onChange={(e) => setEditing({ ...editing, publishedAt: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>{locale === "fa" ? "برچسب (فارسی، با کاما)" : "Tags (Fa, comma)"}</Label>
                <Input value={editing.tagsFa} onChange={(e) => setEditing({ ...editing, tagsFa: e.target.value })} className="mt-1.5" dir="rtl" />
              </div>
              <div>
                <Label>{locale === "fa" ? "برچسب (انگلیسی، با کاما)" : "Tags (En, comma)"}</Label>
                <Input value={editing.tagsEn} onChange={(e) => setEditing({ ...editing, tagsEn: e.target.value })} className="mt-1.5" dir="ltr" />
              </div>
              <div className="flex items-center gap-6 sm:col-span-2">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} />
                  {locale === "fa" ? "منتشر شده" : "Published"}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} />
                  {locale === "fa" ? "ویژه" : "Featured"}
                </label>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {locale === "fa" ? "محتوای فارسی (Markdown)" : "Persian content (Markdown)"}
              </h2>
              <Textarea value={editing.contentFa} onChange={(e) => setEditing({ ...editing, contentFa: e.target.value })} rows={20} className="font-mono text-sm" dir="rtl" />
            </div>
            <div className="rounded-2xl border border-border/60 bg-background p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {locale === "fa" ? "محتوای انگلیسی (Markdown)" : "English content (Markdown)"}
              </h2>
              <Textarea value={editing.contentEn} onChange={(e) => setEditing({ ...editing, contentEn: e.target.value })} rows={20} className="font-mono text-sm" dir="ltr" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {locale === "fa"
              ? "از # برای تیتر و - برای لیست استفاده کنید. **bold** برای پررنگ."
              : "Use # for headings, - for lists, **bold** for emphasis."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {locale === "fa" ? "مقالات و اخبار" : "Articles & News"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {locale === "fa" ? "مدیریت محتوای بلاگ، اخبار و راهنماها" : "Manage blog, news and guide content"}
          </p>
        </div>
        <Button onClick={newPost} className="gap-1.5">
          <Plus className="h-4 w-4" /> {locale === "fa" ? "مقاله جدید" : "New article"}
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-muted-foreground">{locale === "fa" ? "در حال بارگذاری..." : "Loading..."}</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60">
          <div className="divide-y divide-border/60">
            {posts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-4">
                <span className={`inline-flex h-2 w-2 shrink-0 rounded-full ${p.published ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{localized(p, "title", locale) || <span className="text-muted-foreground">untitled</span>}</p>
                  <p className="truncate text-xs text-muted-foreground">/{p.slug} · {formatDate(p.publishedAt, locale)} · {p.views} views</p>
                </div>
                <Badge variant="secondary" className="capitalize">{p.type}</Badge>
                {p.featured && <Badge>★</Badge>}
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(p)} className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(p.id)} className="h-8 w-8 text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
