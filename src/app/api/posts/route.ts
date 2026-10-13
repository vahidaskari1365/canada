import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const type = searchParams.get("type"); // blog | news | guide
  const limit = Number(searchParams.get("limit") || 0);

  if (slug) {
    const post = await db.post.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!post || !post.published) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await db.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
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
  }

  const where: any = { published: true };
  if (type) where.type = type;

  let posts = await db.post.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });
  if (limit > 0) posts = posts.slice(0, limit);
  return NextResponse.json(posts);
}
