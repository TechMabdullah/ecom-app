import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { rateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

/**
 * @swagger
 * /api/otp/send:
 *   post:
 *     summary: Send a 6-digit OTP code to the user's email
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
 *         description: OTP sent successfully
 *       400:
 *         description: Missing or invalid email
 *       500:
 *         description: Server error
 */

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!rateLimit(`otp:${email}`, 3, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests — try again in a few minutes" }, { status: 429 });
    }

    const code = generateCode();
    const expiresAt = Timestamp.fromMillis(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // Store the code in Firestore, keyed by email
    await setDoc(doc(db, "otp_codes", email), {
      code,
      expiresAt,
      attempts: 0,
    });

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your verification code",
      html: `<p>Your verification code is:</p><h2>${code}</h2><p>This code expires in 10 minutes.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}