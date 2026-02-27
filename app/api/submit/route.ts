import { NextRequest, NextResponse } from "next/server";

function generateConfirmationId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "TF2026-";
  for (let i = 0; i < 10; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

async function sendEmail(payload: {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || "noreply@tropicalfutures.gouni.edu.ng";

  if (!apiKey) {
    console.log("[DEV] Email would be sent:", { to: payload.to, subject: payload.subject });
    return { id: "dev-" + Date.now() };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: fromEmail, ...payload }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
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

    // Verify code server-side again (defense in depth)
    const rawCodes = process.env.SUBMISSION_CODES;
    if (rawCodes) {
      const validCodes = rawCodes.split(",").map((c) => c.trim().toUpperCase());
      if (!validCodes.includes(code?.trim()?.toUpperCase())) {
        return NextResponse.json({ message: "Invalid submission code." }, { status: 403 });
      }
    }

    // Validate required fields
    if (!teamName || !projectTitle || !applicationRef || !leadEmail || !pdfUrl) {
      return NextResponse.json({ message: "Missing required submission fields." }, { status: 400 });
    }

    const confirmationId = generateConfirmationId();
    const timestamp = new Date().toISOString();
    const fileSizeMB = fileSize ? (fileSize / (1024 * 1024)).toFixed(2) : "—";

    const organizerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: auto; }
  h1 { color: #1a5c2a; }
  h2 { color: #1a5c2a; font-size: 16px; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px; }
  .badge { display: inline-block; background: #1a5c2a; color: #fff; padding: 4px 12px; border-radius: 20px; font-weight: bold; }
  .field { margin-bottom: 8px; }
  .label { font-weight: bold; color: #555; font-size: 12px; text-transform: uppercase; }
  .pdf-link { display: inline-block; background: #f0f9f0; border: 2px solid #1a5c2a; color: #1a5c2a; padding: 8px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 12px 0; }
  .warn { background: #fff8e1; border-left: 4px solid #f9a825; padding: 10px 14px; border-radius: 4px; font-size: 13px; }
</style></head>
<body>
  <h1>📄 New Submission — Tropical Futures 2026</h1>
  <p>Confirmation ID: <span class="badge">${confirmationId}</span></p>
  <p>Received: ${timestamp}</p>

  <h2>Submission Details</h2>
  <div class="field"><span class="label">Team / Applicant:</span> ${teamName}</div>
  <div class="field"><span class="label">Project Title:</span> ${projectTitle}</div>
  <div class="field"><span class="label">Application Ref:</span> ${applicationRef}</div>
  <div class="field"><span class="label">Lead Email:</span> ${leadEmail}</div>
  <div class="field"><span class="label">Site:</span> ${siteLocation}</div>
  <div class="field"><span class="label">Submission Code:</span> ${code}</div>
  <div class="field"><span class="label">AI Disclosure:</span> ${aiDisclosure ? "YES — disclosed in submission" : "No AI content declared"}</div>

  <h2>PDF Portfolio</h2>
  <div class="field"><span class="label">File Name:</span> ${fileName || "—"}</div>
  <div class="field"><span class="label">File Size:</span> ${fileSizeMB} MB</div>
  <p><a href="${pdfUrl}" class="pdf-link">📂 Access Submitted PDF</a></p>

  ${
    pdfUrl.startsWith("[DEV MODE")
      ? `<div class="warn">⚠️ Development mode — no actual file was uploaded. Configure Cloudinary for production uploads.</div>`
      : ""
  }

  <hr style="margin-top: 24px;">
  <p style="font-size: 12px; color: #888;">
    Frank Mbanefo Design Competition 2026 · Organized by Godfrey Okoye University, Nigeria
  </p>
</body>
</html>`;

    const confirmHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: auto; }
  h1 { color: #1a5c2a; }
  .badge { display: inline-block; background: #1a5c2a; color: #fff; padding: 6px 16px; border-radius: 20px; font-weight: bold; font-size: 16px; }
  .info { background: #f0f9f0; border-left: 4px solid #1a5c2a; padding: 12px 16px; border-radius: 4px; }
</style></head>
<body>
  <h1>✅ Submission Received — Tropical Futures 2026</h1>
  <p>Dear ${teamName},</p>
  <p>Your final submission has been successfully received.</p>
  <p>Confirmation ID: <span class="badge">${confirmationId}</span></p>
  <p><strong>Project:</strong> ${projectTitle}</p>
  <div class="info">
    The organizing team will acknowledge all submissions. Results will be announced on
    <strong>December 15, 2026</strong>. The Exhibition &amp; Symposium follows in February/March 2027.
  </div>
  <p>Thank you for participating. Best of luck!</p>
  <p style="font-size: 12px; color: #888; margin-top: 24px;">
    Frank Mbanefo Design Competition 2026 · info@gouni.edu.ng
  </p>
</body>
</html>`;

    const organizerEmail = process.env.ORGANIZER_EMAIL || "info@gouni.edu.ng";

    await Promise.all([
      sendEmail({
        to: [organizerEmail],
        subject: `[TF2026 SUBMISSION] ${teamName} — "${projectTitle}" (${confirmationId})`,
        html: organizerHtml,
        replyTo: leadEmail,
      }),
      sendEmail({
        to: [leadEmail],
        subject: `Submission Confirmed — ${confirmationId} | Tropical Futures 2026`,
        html: confirmHtml,
      }),
    ]);

    return NextResponse.json({ success: true, confirmationId });
  } catch (err) {
    console.error("[submit]", err);
    return NextResponse.json(
      { message: "Submission failed. Please try again or contact info@gouni.edu.ng" },
      { status: 500 }
    );
  }
}
