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
      age,
      educationEn,
      experienceYears,
      ieltsScore = "",
      fieldEn = "",
      targetProgram = "express-entry",
      notes = "",
    } = body;

    if (!fullName || !email || !phone || !age || !educationEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // simple eligibility scoring
    let score = 0;
    if (age >= 20 && age <= 29) score += 110;
    else if (age >= 30 && age <= 35) score += 80;
    else if (age >= 36 && age <= 45) score += 40;
    if (experienceYears >= 6) score += 70;
    else if (experienceYears >= 3) score += 50;
    else if (experienceYears >= 1) score += 30;
    const edu = educationEn.toLowerCase();
    if (edu.includes("phd")) score += 150;
    else if (edu.includes("master")) score += 126;
    else if (edu.includes("bachelor")) score += 110;
    else if (edu.includes("diploma")) score += 80;
    const ielts = parseFloat(ieltsScore);
    if (!isNaN(ielts)) {
      if (ielts >= 7.5) score += 120;
      else if (ielts >= 7) score += 90;
      else if (ielts >= 6) score += 50;
    }

    let eligibility = "review";
    if (score >= 400) eligibility = "high";
    else if (score >= 300) eligibility = "medium";
    else eligibility = "low";

    if (!DB_WRITABLE) {
      return NextResponse.json({
        ok: true,
        id: "demo-" + Date.now(),
        score,
        eligibility,
        demo: true,
      });
    }

    const assessment = await db.assessment.create({
      data: {
        fullName,
        email,
        phone,
        age: Number(age),
        educationEn,
        experienceYears: Number(experienceYears),
        ieltsScore,
        fieldEn,
        targetProgram,
        notes,
        score,
        eligibility,
      },
    });

    return NextResponse.json({ ok: true, id: assessment.id, score, eligibility });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const authed = await getAdminSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const assessments = await db.assessment.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json(assessments);
  } catch {
    return NextResponse.json([]);
  }
}
