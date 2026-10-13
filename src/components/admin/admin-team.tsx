"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/app-context";
import { Mail, Linkedin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { localized } from "@/lib/content";

type Member = {
  id: string;
  nameEn: string;
  nameFa: string;
  roleEn: string;
  roleFa: string;
  bioEn: string;
  bioFa: string;
  linkedin: string;
  email: string;
  published: boolean;
};

export function AdminTeam() {
  const { locale } = useLocale();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch("/api/public")
      .then((r) => r.json())
      .then((d) => setMembers(Array.isArray(d?.team) ? d.team : []))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{locale === "fa" ? "تیم" : "Team"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {locale === "fa" ? "اعضای تیم (مدیریت از طریق پایگاه داده)" : "Team members (managed via database)"}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {members.map((m) => (
          <div key={m.id} className="rounded-2xl border border-border/60 bg-background p-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-mono text-lg font-semibold text-primary">
                {localized(m, "name", locale).charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{localized(m, "name", locale)}</p>
                <p className="text-sm text-primary">{localized(m, "role", locale)}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{localized(m, "bio", locale)}</p>
            <div className="mt-3 flex gap-2">
              {m.email && <a href={`mailto:${m.email}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-primary"><Mail className="h-4 w-4" /></a>}
              {m.linkedin && <a href={m.linkedin} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-primary"><Linkedin className="h-4 w-4" /></a>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
        <Users className="h-5 w-5" />
        {locale === "fa" ? "برای افزودن عضو جدید، با مدیر سایت تماس بگیرید." : "Contact the site administrator to add new members."}
      </div>
    </div>
  );
}
