"use client";

import { useEffect, useState, useCallback } from "react";
import { useLocale, useRouter } from "@/lib/app-context";
import { LogOut, LayoutDashboard, FileText, Wrench, CalendarClock, MessageSquare, Settings, FileSearch, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdminDashboard } from "./admin-dashboard";
import { AdminPosts } from "./admin-posts";
import { AdminServices } from "./admin-services";
import { AdminBookings } from "./admin-bookings";
import { AdminAssessments } from "./admin-assessments";
import { AdminMessages } from "./admin-messages";
import { AdminContent } from "./admin-content";
import { AdminTeam } from "./admin-team";

type Section = "dashboard" | "posts" | "services" | "bookings" | "assessments" | "messages" | "content" | "team";

export function AdminApp({ section }: { section: Section }) {
  const { locale, dir } = useLocale();
  const { navigate } = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      setAuthed(!!data.authed);
    } catch {
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (authed === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin onDone={checkSession} />;
  }

  const nav: { id: Section; label: string; icon: any }[] = [
    { id: "dashboard", label: locale === "fa" ? "داشبورد" : "Dashboard", icon: LayoutDashboard },
    { id: "posts", label: locale === "fa" ? "مقالات" : "Articles", icon: FileText },
    { id: "services", label: locale === "fa" ? "خدمات" : "Services", icon: Wrench },
    { id: "bookings", label: locale === "fa" ? "رزروها" : "Bookings", icon: CalendarClock },
    { id: "assessments", label: locale === "fa" ? "ارزیابی‌ها" : "Assessments", icon: FileSearch },
    { id: "messages", label: locale === "fa" ? "پیام‌ها" : "Messages", icon: MessageSquare },
    { id: "content", label: locale === "fa" ? "محتوا" : "Content", icon: Settings },
    { id: "team", label: locale === "fa" ? "تیم" : "Team", icon: Users },
  ];

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    toast.success(locale === "fa" ? "خارج شدید" : "Logged out");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto flex w-full max-w-[1400px]">
        {/* Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-60 shrink-0 flex-col border-e border-border/60 bg-background p-4 md:flex">
          <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {locale === "fa" ? "پنل مدیریت" : "Admin panel"}
          </p>
          <nav className="flex-1 space-y-1">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = section === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => navigate(`/admin/${n.id === "dashboard" ? "" : n.id}`)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </button>
              );
            })}
          </nav>
          <Button variant="outline" size="sm" onClick={logout} className="mt-2 gap-1.5">
            <LogOut className="h-4 w-4" />
            {locale === "fa" ? "خروج" : "Log out"}
          </Button>
        </aside>

        {/* Mobile nav (top select) */}
        <div className="md:hidden">
          <div className="sticky top-16 z-30 flex gap-1 overflow-x-auto border-b border-border/60 bg-background/90 px-3 py-2 backdrop-blur scrollbar-thin">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = section === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => navigate(`/admin/${n.id === "dashboard" ? "" : n.id}`)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {n.label}
                </button>
              );
            })}
            <button onClick={logout} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-foreground/70">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <main className="min-w-0 flex-1 p-4 md:p-8">
          {section === "dashboard" && <AdminDashboard />}
          {section === "posts" && <AdminPosts />}
          {section === "services" && <AdminServices />}
          {section === "bookings" && <AdminBookings />}
          {section === "assessments" && <AdminAssessments />}
          {section === "messages" && <AdminMessages />}
          {section === "content" && <AdminContent />}
          {section === "team" && <AdminTeam />}
        </main>
      </div>
    </div>
  );
}

function AdminLogin({ onDone }: { onDone: () => void }) {
  const { locale } = useLocale();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        toast.success(locale === "fa" ? "وارد شدید" : "Logged in");
        onDone();
      } else {
        toast.error(locale === "fa" ? "اطلاعات نادرست" : "Invalid credentials");
      }
    } catch {
      toast.error(locale === "fa" ? "خطا" : "Error");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-border/60 bg-background p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {locale === "fa" ? "پنل مدیریت" : "Admin Panel"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {locale === "fa" ? "برای ورود اطلاعات خود را وارد کنید" : "Enter your credentials to continue"}
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <Label>{locale === "fa" ? "نام کاربری" : "Username"}</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1.5" autoComplete="username" />
          </div>
          <div>
            <Label>{locale === "fa" ? "رمز عبور" : "Password"}</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" autoComplete="current-password" />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="mt-6 w-full gap-2">
          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />}
          {locale === "fa" ? "ورود" : "Log in"}
        </Button>
        <div className="mt-4 rounded-lg border border-dashed border-border/60 bg-muted/30 p-3 text-center text-xs text-muted-foreground">
          {locale === "fa" ? "نمونه: admin / maple2025" : "Demo: admin / maple2025"}
        </div>
      </form>
    </div>
  );
}
