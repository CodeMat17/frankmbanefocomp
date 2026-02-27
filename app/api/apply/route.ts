import { NextRequest, NextResponse } from "next/server";

function generateRefId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "FM2026-";
  for (let i = 0; i < 8; i++) {
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

    if (!leadName || !leadEmail || !university || !country || !program || !yearOfStudy) {
      return NextResponse.json({ message: "Please fill in all required fields." }, { status: 400 });
    }

    const referenceId = generateRefId();
    const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Africa/Lagos" }) + " WAT";

    const teamMembersList =
      Array.isArray(teamMembers) && teamMembers.length > 0
        ? teamMembers
            .map(
              (m: { name: string; email: string; university: string }) =>
                `${m.name} <${m.email}> — ${m.university}`
            )
            .join(" | ")
        : "Individual application";

    await notifyViaWeb3Forms({
      subject: `[TF2026] New Application — ${leadName} (${referenceId})`,
      from_name: "Tropical Futures 2026",
      replyto: leadEmail,
      "Reference ID": referenceId,
      "Received": timestamp,
      "Application Type": applicationType,
      "Lead Name": leadName,
      "Lead Email": leadEmail,
      "Phone": leadPhone || "—",
      "University": university,
      "Country": country,
      "Program": program,
      "Year of Study": yearOfStudy,
      "Team Name": teamName || "—",
      "Team Members": teamMembersList,
      "Site Location": siteLocation,
      "Concept Brief": conceptBrief || "—",
      "Heard From": heardFrom || "—",
    });

    return NextResponse.json({ success: true, referenceId });
  } catch (err) {
    console.error("[apply]", err);
    return NextResponse.json(
      { message: "Failed to process application. Please try again or contact info@gouni.edu.ng" },
      { status: 500 }
    );
  }
}
