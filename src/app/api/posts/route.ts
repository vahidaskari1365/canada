import { NextRequest, NextResponse } from "next/server";
import { db, DB_WRITABLE } from "@/lib/db";

// Cache the list endpoints (without slug) for 60s.
const listCache = new Map<string, { data: any; at: number }>();
const TTL = 60_000;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const type = searchParams.get("type"); // blog | news | guide
  const limit = Number(searchParams.get("limit") || 0);

  if (slug) {
    try {
      const post = await db.post.findUnique({
        where: { slug },
        include: { category: true },
      });
      if (!post || !post.published) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      // increment views (fire and forget — fails silently on read-only FS)
      if (DB_WRITABLE) {
        db.post
          .update({ where: { id: post.id }, data: { views: { increment: 1 } } })
          .catch(() => {});
      }
      const related = await db.post.findMany({
        where: {
          published: true,
          id: { not: post.id },
          OR: [{ categoryId: post.categoryId }, { type: post.type }],
        },
        take: 3,
        orderBy: { publishedAt: "desc" },
      });
      return NextResponse.json({ ...post, related });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  const cacheKey = `${type || "all"}:${limit}`;
  const now = Date.now();
  const hit = listCache.get(cacheKey);
  if (hit && now - hit.at < TTL) {
    return NextResponse.json(hit.data);
  }

  try {
    const where: any = { published: true };
    if (type) where.type = type;

    let posts = await db.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    });
    if (limit > 0) posts = posts.slice(0, limit);
    listCache.set(cacheKey, { data: posts, at: now });
    return NextResponse.json(posts);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
