"use client";

import { useEffect, useState } from "react";
import { useLocale, useRouter } from "@/lib/app-context";
import { FileText, CalendarClock, FileSearch, MessageSquare, TrendingUp, Eye } from "lucide-react";
import { localized, formatDate } from "@/lib/content";

type Post = { id: string; titleEn: string; titleFa: string; views: number; published: boolean; publishedAt: string };
type Booking = { id: string; fullName: string; serviceSlug: string; date: string; status: string; amountUSD: number; paid: boolean; createdAt: string };
type Assessment = { id: string; fullName: string; eligibility: string; score: number; createdAt: string };
type Message = { id: string; name: string; subject: string; createdAt: string; handled: boolean };

export function AdminDashboard() {
  const { locale } = useLocale();
  const { navigate } = useRouter();
  const [stats, setStats] = useState({ posts: 0, bookings: 0, assessments: 0, messages: 0, totalViews: 0 });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [recentAssessments, setRecentAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/posts").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/bookings").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/assessments").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/contact").then((r) => (r.ok ? r.json() : [])),
    ]).then(([p, b, a, m]) => {
      const posts: Post[] = Array.isArray(p) ? p : [];
      const bookings: Booking[] = Array.isArray(b) ? b : [];
      const assessments: Assessment[] = Array.isArray(a) ? a : [];
      const messages: Message[] = Array.isArray(m) ? m : [];
      setStats({
        posts: posts.length,
        bookings: bookings.length,
        assessments: assessments.length,
        messages: messages.length,
        totalViews: posts.reduce((s, x) => s + (x.views || 0), 0),
      });
      setRecentBookings(bookings.slice(0, 5));
      setRecentPosts(posts.slice(0, 5));
      setRecentAssessments(assessments.slice(0, 5));
    });
  }, []);

  const cards = [
    { label: locale === "fa" ? "مقالات" : "Articles", value: stats.posts, icon: FileText, color: "text-blue-500" },
    { label: locale === "fa" ? "رزروها" : "Bookings", value: stats.bookings, icon: CalendarClock, color: "text-emerald-500" },
    { label: locale === "fa" ? "ارزیابی‌ها" : "Assessments", value: stats.assessments, icon: FileSearch, color: "text-amber-500" },
    { label: locale === "fa" ? "پیام‌ها" : "Messages", value: stats.messages, icon: MessageSquare, color: "text-purple-500" },
    { label: locale === "fa" ? "بازدید کل" : "Total views", value: stats.totalViews, icon: Eye, color: "text-primary" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {locale === "fa" ? "داشبورد" : "Dashboard"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {locale === "fa" ? "نمای کلی فعالیت‌های سایت" : "Overview of site activity"}
      </p>

      {/* stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="rounded-2xl border border-border/60 bg-background p-5">
              <Icon className={`h-6 w-6 ${c.color}`} />
              <p className="mt-3 font-mono text-3xl font-semibold">{c.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
            </div>
          );
        })}
      </div>

      {/* recent activity */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* recent bookings */}
        <div className="rounded-2xl border border-border/60 bg-background p-5">
          <h2 className="flex items-center justify-between text-sm font-semibold">
            <span>{locale === "fa" ? "رزروهای اخیر" : "Recent bookings"}</span>
            <button onClick={() => navigate("/admin/bookings")} className="text-xs text-primary hover:underline">
              {locale === "fa" ? "همه" : "View all"}
            </button>
          </h2>
          <div className="mt-3 divide-y divide-border/60">
            {recentBookings.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">—</p>}
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-2 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{b.fullName}</p>
                  <p className="text-xs text-muted-foreground">{b.serviceSlug} · {b.date}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-600"
                    : b.status === "completed" ? "bg-blue-500/10 text-blue-600"
                    : b.status === "cancelled" ? "bg-red-500/10 text-red-600"
                    : "bg-amber-500/10 text-amber-600"
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* recent assessments */}
        <div className="rounded-2xl border border-border/60 bg-background p-5">
          <h2 className="flex items-center justify-between text-sm font-semibold">
            <span>{locale === "fa" ? "ارزیابی‌های اخیر" : "Recent assessments"}</span>
            <button onClick={() => navigate("/admin/assessments")} className="text-xs text-primary hover:underline">
              {locale === "fa" ? "همه" : "View all"}
            </button>
          </h2>
          <div className="mt-3 divide-y divide-border/60">
            {recentAssessments.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">—</p>}
            {recentAssessments.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-2 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{a.fullName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(a.createdAt, locale)}</p>
                </div>
                <span className="shrink-0 font-mono text-sm font-semibold text-primary">{a.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* top posts */}
        <div className="rounded-2xl border border-border/60 bg-background p-5 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" />
            {locale === "fa" ? "مقالات پربازدید" : "Top articles"}
          </h2>
          <div className="mt-3 divide-y divide-border/60">
            {recentPosts.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">—</p>}
            {recentPosts.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-2 py-3 text-sm">
                <p className="min-w-0 truncate font-medium">{localized(p, "title", locale)}</p>
                <span className="shrink-0 font-mono text-sm text-muted-foreground">{p.views} <Eye className="ms-1 inline h-3.5 w-3.5" /></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
