import { NextRequest, NextResponse } from "next/server";
import { db, DB_WRITABLE } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      countryCode = "+98",
      preferredLang = "fa",
      serviceSlug = "general",
      packageSlug = "",
      date,
      timeSlot,
      notes = "",
      amountUSD = 0,
    } = body;

    if (!fullName || !email || !phone || !date || !timeSlot) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // On read-only serverless (e.g. Vercel with file SQLite) we can't persist.
    // Acknowledge the booking so the UX flow completes; in production wire up
    // a real DB (Vercel Postgres / Neon / Supabase) for persistence.
    if (!DB_WRITABLE) {
      return NextResponse.json({
        ok: true,
        id: "demo-" + Date.now(),
        demo: true,
        message: "Booking received (demo mode — connect a database to persist).",
      });
    }

    const booking = await db.booking.create({
      data: {
        fullName,
        email,
        phone,
        countryCode,
        preferredLang,
        serviceSlug,
        packageSlug,
        date,
        timeSlot,
        notes,
        amountUSD,
        status: "pending",
        paid: amountUSD > 0 ? false : true,
      },
    });

    return NextResponse.json({ ok: true, id: booking.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const authed = await getAdminSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where: any = {};
  if (status) where.status = status;
  try {
    const bookings = await db.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json([]);
  }
}
