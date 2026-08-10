import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { adminAuth } from "@/lib/firebase-admin";
import { renderEmailLayout } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * @swagger
 * /api/auth/request-reset:
 *   post:
 *     summary: Send a password reset email with a branded template
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Reset email sent (or silently no-op if email doesn't exist)
 */

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const resetLink = await adminAuth.generatePasswordResetLink(email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/reset-confirm`,
      handleCodeInApp: true,
    });

    // Extract the real oobCode ourselves and build our own direct link,
    // bypassing Firebase's hosted redirect page (which was dropping the param)
    const oobCode = new URL(resetLink).searchParams.get("oobCode");
    const directLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-confirm?oobCode=${oobCode}`;
    console.log("Continue URL used:", `${process.env.NEXT_PUBLIC_APP_URL}/reset-confirm`);
console.log("Generated reset link:", resetLink);

    await resend.emails.send({
      from: "circuit.parts <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      html: renderEmailLayout({
        previewText: "Reset your circuit.parts password",
        heading: "Reset your password",
        bodyHtml: `<p>Click the button below to choose a new password. This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>`,
        ctaText: "reset password",
        ctaUrl: directLink,
      }),
    });

    console.log("Direct link (use this one):", directLink);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Failed to send password reset email:", err);
    // Don't reveal whether an email exists in your system — always return success
    return NextResponse.json({ success: true });
  }
}