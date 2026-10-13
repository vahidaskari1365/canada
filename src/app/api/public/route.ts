import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Short in-memory cache so we don't hit the DB on every page load.
// 60s is plenty — content changes are rare and admin can refresh.
let cache: { data: any; at: number } | null = null;
const TTL = 60_000;

export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  if (cache && now - cache.at < TTL) {
    return NextResponse.json(cache.data);
  }

  const [testimonials, team, packages, faqs, settings, categories] = await Promise.all([
    db.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    db.teamMember.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    db.consultationPackage.findMany({ orderBy: { order: "asc" } }),
    db.faq.findMany({ orderBy: { order: "asc" } }),
    db.setting.findMany(),
    db.category.findMany(),
  ]);

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  const data = {
    testimonials,
    team,
    packages,
    faqs,
    categories,
    settings: settingsMap,
  };
  cache = { data, at: now };
  return NextResponse.json(data);
}
