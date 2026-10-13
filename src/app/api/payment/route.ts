import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Mock payment processor (simulated). In production this would call Stripe/etc.
export async function POST(req: NextRequest) {
  try {
    const { bookingId, cardNumber, expiry, cvv, name, amountUSD } = await req.json();

    if (!cardNumber || !expiry || !cvv || !name) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 900));

    // Basic Luhn-ish check (just length & digits)
    const digits = String(cardNumber).replace(/\s+/g, "");
    if (digits.length < 13 || digits.length > 19) {
      return NextResponse.json({ error: "Invalid card number" }, { status: 400 });
    }

    const ref = "MB-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random() * 9000 + 1000);

    if (bookingId) {
      await db.booking.update({
        where: { id: bookingId },
        data: { paid: true, paymentRef: ref, status: "confirmed", amountUSD: amountUSD || undefined },
      });
    }

    return NextResponse.json({ ok: true, ref, paid: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
