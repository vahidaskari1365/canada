import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const service = await db.service.findUnique({
      where: { slug },
      include: { requirements: true, steps: { orderBy: { step: "asc" } } },
    });
    if (!service || !service.published) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(service);
  }

  const services = await db.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { _count: { select: { requirements: true, steps: true } } },
  });
  return NextResponse.json(services);
}
