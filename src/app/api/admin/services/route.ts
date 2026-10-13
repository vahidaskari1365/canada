import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/content";

export const dynamic = "force-dynamic";

async function auth() {
  return await getAdminSession();
}

export async function GET() {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const services = await db.service.findMany({
    orderBy: { order: "asc" },
    include: { requirements: true, steps: { orderBy: { step: "asc" } } },
  });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { requirements = [], steps = [], ...rest } = body;
    let slug = rest.slug ? slugify(rest.slug) : slugify(rest.titleEn || rest.titleFa);
    if (!slug) slug = "service-" + Date.now();
    const exists = await db.service.findUnique({ where: { slug } });
    if (exists) slug = slug + "-" + Date.now().toString(36);

    const service = await db.service.create({
      data: {
        slug,
        titleEn: rest.titleEn || "",
        titleFa: rest.titleFa || "",
        shortDescEn: rest.shortDescEn || "",
        shortDescFa: rest.shortDescFa || "",
        descEn: rest.descEn || "",
        descFa: rest.descFa || "",
        icon: rest.icon || "file-text",
        durationEn: rest.durationEn || "",
        durationFa: rest.durationFa || "",
        feeFrom: rest.feeFrom || "",
        order: Number(rest.order) || 0,
        featured: !!rest.featured,
        published: rest.published !== false,
        requirements: {
          create: requirements.map((r: any) => ({ textEn: r.textEn || "", textFa: r.textFa || "" })),
        },
        steps: {
          create: steps.map((s: any, i: number) => ({
            step: i + 1,
            titleEn: s.titleEn || "",
            titleFa: s.titleFa || "",
            descEn: s.descEn || "",
            descFa: s.descFa || "",
          })),
        },
      },
      include: { requirements: true, steps: true },
    });
    return NextResponse.json(service);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, requirements, steps, ...rest } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (rest.slug) rest.slug = slugify(rest.slug);
    if (rest.order) rest.order = Number(rest.order);

    const service = await db.service.update({ where: { id }, data: rest });

    if (Array.isArray(requirements)) {
      await db.serviceRequirement.deleteMany({ where: { serviceId: id } });
      await db.serviceRequirement.createMany({
        data: requirements.map((r: any) => ({ serviceId: id, textEn: r.textEn || "", textFa: r.textFa || "" })),
      });
    }
    if (Array.isArray(steps)) {
      await db.serviceStep.deleteMany({ where: { serviceId: id } });
      await db.serviceStep.createMany({
        data: steps.map((s: any, i: number) => ({
          serviceId: id,
          step: i + 1,
          titleEn: s.titleEn || "",
          titleFa: s.titleFa || "",
          descEn: s.descEn || "",
          descFa: s.descFa || "",
        })),
      });
    }
    return NextResponse.json(service);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.service.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
