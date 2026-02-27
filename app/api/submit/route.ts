import { NextRequest, NextResponse } from "next/server";

function generateConfirmationId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "TF2026-";
  for (let i = 0; i < 10; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

async function notifyViaWeb3Forms(fields: Record<string, string>) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey || process.env.NODE_ENV === "development") {
    console.log("[DEV] Web3Forms would send:", JSON.stringify(fields, null, 2));
    return;
  }
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ access_key: accessKey, ...fields }),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(`Web3Forms error: ${data.message}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      code,
      teamName,
      projectTitle,
      applicationRef,
      leadEmail,
      siteLocation,
      pdfUrl,
      fileName,
      fileSize,
      aiDisclosure,
    } = body;

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
    const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Africa/Lagos" }) + " WAT";
    const fileSizeMB = fileSize ? `${(fileSize / (1024 * 1024)).toFixed(2)} MB` : "—";

    await notifyViaWeb3Forms({
      subject: `[TF2026 SUBMISSION] ${teamName} — "${projectTitle}" (${confirmationId})`,
      from_name: "Tropical Futures 2026",
      replyto: leadEmail,
      "Confirmation ID": confirmationId,
      "Received": timestamp,
      "Submission Code": code,
      "Team / Applicant": teamName,
      "Project Title": projectTitle,
      "Application Ref": applicationRef,
      "Lead Email": leadEmail,
      "Site Location": siteLocation,
      "File Name": fileName || "—",
      "File Size": fileSizeMB,
      "PDF Download Link": pdfUrl,
      "AI Disclosure": aiDisclosure ? "Yes — disclosed in submission" : "No AI content declared",
    });

    return NextResponse.json({ success: true, confirmationId });
  } catch (err) {
    console.error("[submit]", err);
    return NextResponse.json(
      { message: "Submission failed. Please try again or contact info@gouni.edu.ng" },
      { status: 500 }
    );
  }
}
