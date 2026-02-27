import { NextRequest, NextResponse } from "next/server";

function generateRefId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "FM2026-";
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

async function sendEmail(payload: {
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || "noreply@tropicalfutures.gouni.edu.ng";
  const toEmail = process.env.ORGANIZER_EMAIL || "info@gouni.edu.ng";

  if (!apiKey) {
    // Dev mode: log and continue
    console.log("[DEV] Email would be sent:", { to: toEmail, subject: payload.subject });
    return { id: "dev-" + Date.now() };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: payload.replyTo,
      subject: payload.subject,
      html: payload.html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Email service error: ${err}`);
  }
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      applicationType,
      leadName,
      leadEmail,
      leadPhone,
      university,
      country,
      program,
      yearOfStudy,
      teamName,
      teamMembers,
      siteLocation,
      conceptBrief,
      heardFrom,
    } = body;

    // Basic validation
    if (!leadName || !leadEmail || !university || !country || !program || !yearOfStudy) {
      return NextResponse.json({ message: "Please fill in all required fields." }, { status: 400 });
    }

    const referenceId = generateRefId();
    const timestamp = new Date().toISOString();

    const teamMembersHtml =
      Array.isArray(teamMembers) && teamMembers.length > 0
        ? `<h3>Team Members</h3><ul>${teamMembers
            .map(
              (m: { name: string; email: string; university: string }) =>
                `<li><strong>${m.name}</strong> — ${m.email} (${m.university})</li>`
            )
            .join("")}</ul>`
        : "<p><em>Individual application</em></p>";

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: auto; }
  h1 { color: #1a5c2a; }
  h2 { color: #1a5c2a; font-size: 16px; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px; }
  .badge { display: inline-block; background: #1a5c2a; color: #fff; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; }
  .field { margin-bottom: 8px; }
  .label { font-weight: bold; color: #555; font-size: 12px; text-transform: uppercase; }
</style></head>
<body>
  <h1>🌿 New Application — Tropical Futures 2026</h1>
  <p>Reference ID: <span class="badge">${referenceId}</span></p>
  <p>Received: ${timestamp}</p>

  <h2>Lead Applicant</h2>
  <div class="field"><span class="label">Name:</span> ${leadName}</div>
  <div class="field"><span class="label">Email:</span> ${leadEmail}</div>
  <div class="field"><span class="label">Phone:</span> ${leadPhone || "—"}</div>
  <div class="field"><span class="label">University:</span> ${university}</div>
  <div class="field"><span class="label">Country:</span> ${country}</div>
  <div class="field"><span class="label">Program:</span> ${program}</div>
  <div class="field"><span class="label">Year:</span> ${yearOfStudy}</div>

  <h2>Application Details</h2>
  <div class="field"><span class="label">Type:</span> ${applicationType}</div>
  ${applicationType === "team" ? `<div class="field"><span class="label">Team Name:</span> ${teamName || "—"}</div>` : ""}
  ${teamMembersHtml}

  <h2>Site & Concept</h2>
  <div class="field"><span class="label">Site:</span> ${siteLocation}</div>
  <div class="field"><span class="label">Brief:</span> ${conceptBrief || "—"}</div>
  <div class="field"><span class="label">Heard from:</span> ${heardFrom || "—"}</div>

  <hr style="margin-top: 24px;">
  <p style="font-size: 12px; color: #888;">
    Frank Mbanefo Design Competition 2026 · Organized by Godfrey Okoye University, Nigeria<br>
    Sponsored by OXÏ-ZEN Solutions LLC, Switzerland
  </p>
</body>
</html>`;

    await sendEmail({
      subject: `[TF2026] New Application — ${leadName} (${referenceId})`,
      html,
      replyTo: leadEmail,
    });

    // Also send confirmation to applicant
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
  <h1>🌿 Application Received!</h1>
  <p>Dear ${leadName},</p>
  <p>Thank you for applying to the <strong>Frank Mbanefo Design Competition — Tropical Futures 2026</strong>.</p>
  <p>Your reference ID is: <span class="badge">${referenceId}</span></p>
  <div class="info">
    <strong>What happens next?</strong><br>
    The organizing team will review your eligibility. Successful applicants will receive a unique
    submission code by email, which you will need to upload your final PDF entry by <strong>July 31, 2026 (23:59 WAT)</strong>.
  </div>
  <p>For any queries, please contact <a href="mailto:info@gouni.edu.ng">info@gouni.edu.ng</a>.</p>
  <p>Good luck!</p>
  <hr style="margin-top: 24px;">
  <p style="font-size: 12px; color: #888;">
    Frank Mbanefo Design Competition 2026<br>
    Organized by Godfrey Okoye University · Sponsored by OXÏ-ZEN Solutions LLC
  </p>
</body>
</html>`;

    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || "noreply@tropicalfutures.gouni.edu.ng",
          to: [leadEmail],
          subject: `Application Confirmed — ${referenceId} | Tropical Futures 2026`,
          html: confirmHtml,
        }),
      });
    }

    return NextResponse.json({ success: true, referenceId });
  } catch (err) {
    console.error("[apply]", err);
    return NextResponse.json(
      { message: "Failed to process application. Please try again or contact info@gouni.edu.ng" },
      { status: 500 }
    );
  }
}
