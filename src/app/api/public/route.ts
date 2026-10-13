import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
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

  return NextResponse.json({
    testimonials,
    team,
    packages,
    faqs,
    categories,
    settings: settingsMap,
  });
}
