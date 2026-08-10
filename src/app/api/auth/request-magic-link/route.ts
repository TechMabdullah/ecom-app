import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { adminAuth } from "@/lib/firebase-admin";
import { renderEmailLayout } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const link = await adminAuth.generateSignInWithEmailLink(email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/finish-signin`,
      handleCodeInApp: true,
    });

    await resend.emails.send({
      from: "circuit.parts <onboarding@resend.dev>",
      to: email,
      subject: "Your sign-in link",
      html: renderEmailLayout({
        previewText: "Click to sign in to circuit.parts",
        heading: "Sign in with one click",
        bodyHtml: `<p>Click the button below to sign in instantly — no password needed. This link expires in 1 hour.</p>`,
        ctaText: "sign in",
        ctaUrl: link,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Failed to send sign-in link:", err);

    return NextResponse.json({ error: "Failed to send sign-in link" }, { status: 500 });
  }
}