"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/app-context";
import { Trash2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDate } from "@/lib/content";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  handled: boolean;
  createdAt: string;
};

export function AdminMessages() {
  const { locale } = useLocale();
  const [items, setItems] = useState<Message[]>([]);

  async function load() {
    const res = await fetch("/api/contact");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{locale === "fa" ? "پیام‌های تماس" : "Contact messages"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{locale === "fa" ? "پیام‌های دریافتی از فرم تماس" : "Messages received from the contact form"}</p>
      </div>
      <div className="space-y-3">
        {items.length === 0 && <p className="py-20 text-center text-sm text-muted-foreground">—</p>}
        {items.map((m) => (
          <div key={m.id} className="rounded-2xl border border-border/60 bg-background p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{m.name}</h3>
                  {m.handled && <Badge variant="secondary"><CheckCircle2 className="me-1 h-3 w-3" /> {locale === "fa" ? "بررسی شد" : "Handled"}</Badge>}
                </div>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {m.email}</p>
                {m.subject && <p className="mt-2 text-sm font-medium">{m.subject}</p>}
                <p className="mt-2 rounded-lg bg-muted/40 p-3 text-sm leading-relaxed">{m.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">{formatDate(m.createdAt, locale)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
