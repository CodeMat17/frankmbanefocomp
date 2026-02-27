import { NextRequest, NextResponse } from "next/server";

/**
 * Verifies a submission code against the SUBMISSION_CODES env variable.
 *
 * Setup: Set SUBMISSION_CODES=CODE1,CODE2,CODE3 in your .env.local
 * Each approved candidate receives their unique code via email.
 *
 * In development (no env set): any non-empty code is accepted for testing.
 */
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json({ valid: false, message: "No code provided." });
    }

    const submittedCode = code.trim().toUpperCase();
    const rawCodes = process.env.SUBMISSION_CODES;

    // Development mode: if no codes are configured, accept anything for testing
    if (!rawCodes) {
      console.warn("[verify-code] SUBMISSION_CODES not set. Dev mode: accepting all codes.");
      return NextResponse.json({ valid: true, dev: true });
    }

    const validCodes = rawCodes
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);

    const isValid = validCodes.includes(submittedCode);

    // Rate limiting hint (implement with Upstash Redis or similar in production)
    return NextResponse.json({ valid: isValid });
  } catch (err) {
    console.error("[verify-code]", err);
    return NextResponse.json({ valid: false, message: "Verification error." }, { status: 500 });
  }
}
