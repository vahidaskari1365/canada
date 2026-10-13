import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

let cache: { data: any; at: number } | null = null;
const TTL = 60_000;

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

  const now = Date.now();
  if (cache && now - cache.at < TTL) {
    return NextResponse.json(cache.data);
  }

  const services = await db.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { _count: { select: { requirements: true, steps: true } } },
  });
  cache = { data: services, at: now };
  return NextResponse.json(services);
}
