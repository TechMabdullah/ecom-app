import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderEmailLayout } from "@/lib/email-template";
import { rateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!rateLimit(`contact:${email}`, 5, 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests — try again in a minute" }, { status: 429 });
    }

    await resend.emails.send({
      from: "circuit.parts <onboarding@resend.dev>",
      to: "tech.mabdullah@hotmail.com",
      replyTo: email,
      subject: `New contact form message from ${name}`,
      html: renderEmailLayout({
        previewText: `Message from ${name}`,
        heading: "New contact message",
        bodyHtml: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}