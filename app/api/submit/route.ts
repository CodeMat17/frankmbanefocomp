import { NextRequest, NextResponse } from "next/server";

function generateConfirmationId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "TF2026-";
  for (let i = 0; i < 10; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { code, teamName, projectTitle, applicationRef, leadEmail, pdfUrl } = body;

    // Verify code server-side (defense in depth)
    const rawCodes = process.env.SUBMISSION_CODES;
    if (rawCodes) {
      const validCodes = rawCodes.split(",").map((c) => c.trim().toUpperCase());
      if (!validCodes.includes(code?.trim()?.toUpperCase())) {
        return NextResponse.json({ message: "Invalid submission code." }, { status: 403 });
      }
    }

    if (!teamName || !projectTitle || !applicationRef || !leadEmail || !pdfUrl) {
      return NextResponse.json({ message: "Missing required submission fields." }, { status: 400 });
    }

    const confirmationId = generateConfirmationId();

    return NextResponse.json({ success: true, confirmationId });
  } catch (err) {
    console.error("[submit]", err);
    return NextResponse.json(
      { message: "Submission failed. Please try again or contact info@gouni.edu.ng" },
      { status: 500 }
    );
  }
}
