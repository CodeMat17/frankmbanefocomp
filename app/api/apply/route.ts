import { NextRequest, NextResponse } from "next/server";

function generateRefId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "FM2026-";
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { leadName, leadEmail, university, country, program, yearOfStudy } = body;

    if (!leadName || !leadEmail || !university || !country || !program || !yearOfStudy) {
      return NextResponse.json({ message: "Please fill in all required fields." }, { status: 400 });
    }

    const referenceId = generateRefId();

    return NextResponse.json({ success: true, referenceId });
  } catch (err) {
    console.error("[apply]", err);
    return NextResponse.json(
      { message: "Failed to process application. Please try again or contact info@gouni.edu.ng" },
      { status: 500 }
    );
  }
}
