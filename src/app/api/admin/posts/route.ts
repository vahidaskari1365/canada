import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/content";

export const dynamic = "force-dynamic";

async function auth() {
  return await getAdminSession();
}

// LIST all (including unpublished) or CREATE
export async function GET(req: NextRequest) {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const where: any = {};
  if (type) where.type = type;
  const posts = await db.post.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    let slug = body.slug ? slugify(body.slug) : slugify(body.titleEn || body.titleFa);
    if (!slug) slug = "post-" + Date.now();

    const exists = await db.post.findUnique({ where: { slug } });
    if (exists) slug = slug + "-" + Date.now().toString(36);

    const post = await db.post.create({
      data: {
        slug,
        titleEn: body.titleEn || "",
        titleFa: body.titleFa || "",
        excerptEn: body.excerptEn || "",
        excerptFa: body.excerptFa || "",
        contentEn: body.contentEn || "",
        contentFa: body.contentFa || "",
        coverImage: body.coverImage || "",
        type: body.type || "blog",
        categoryId: body.categoryId || null,
        authorEn: body.authorEn || "Maple Bridge Team",
        authorFa: body.authorFa || "تیم میپل بریج",
        readingTime: Number(body.readingTime) || 5,
        featured: !!body.featured,
        published: body.published !== false,
        tagsEn: body.tagsEn || "",
        tagsFa: body.tagsFa || "",
        metaTitleEn: body.metaTitleEn || "",
        metaTitleFa: body.metaTitleFa || "",
        metaDescEn: body.metaDescEn || "",
        metaDescFa: body.metaDescFa || "",
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      },
    });
    return NextResponse.json(post);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await auth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (data.slug) data.slug = slugify(data.slug);
    if (data.publishedAt) data.publishedAt = new Date(data.publishedAt);
    if (data.readingTime) data.readingTime = Number(data.readingTime);
    if (data.categoryId === "") data.categoryId = null;
    const post = await db.post.update({ where: { id }, data });
    return NextResponse.json(post);
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
    await db.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
