import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET all content blocks grouped by page
export async function GET() {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const blocks = await db.contentBlock.findMany({ orderBy: [{ page: "asc" }, { section: "asc" }] });
  return NextResponse.json(blocks);
}

// UPSERT a content block
export async function POST(req: NextRequest) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { page, section, key, valueEn, valueFa } = await req.json();
    const block = await db.contentBlock.upsert({
      where: { page_section_key: { page, section, key } },
      update: { valueEn, valueFa },
      create: { page, section, key, valueEn, valueFa },
    });
    return NextResponse.json(block);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      await db.contentBlock.delete({ where: { id } });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
