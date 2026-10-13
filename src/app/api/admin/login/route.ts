import { NextRequest, NextResponse } from "next/server";
import {
  verifyCredentials,
  createSession,
  setAdminSessionCookie,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!verifyCredentials(username, password)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const token = createSession();
    await setAdminSessionCookie(token);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
