import { NextRequest, NextResponse } from "next/server";
import { db, DB_WRITABLE } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!DB_WRITABLE) {
      return NextResponse.json({ ok: true, demo: true });
    }
    await db.setting.upsert({
      where: { key: `newsletter:${email.toLowerCase()}` },
      update: {},
      create: { key: `newsletter:${email.toLowerCase()}`, value: new Date().toISOString() },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
