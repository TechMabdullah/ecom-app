import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";
import { renderEmailLayout } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * @swagger
 * /api/newsletter:
 *   post:
 *     summary: Subscribe an email to the newsletter
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
 *         description: Subscribed successfully
 *       400:
 *         description: Invalid email
 *       500:
 *         description: Server error
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (!rateLimit(`newsletter:${email}`, 3, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests — try again in a few minutes" }, { status: 429 });
    }

    await setDoc(doc(db, "newsletter_subscribers", email), {
      email,
      subscribedAt: Timestamp.now(),
    });

    await resend.emails.send({
      from: "circuit.parts <onboarding@resend.dev>",
      to: email,
      subject: "You're subscribed!",
      html: renderEmailLayout({
        previewText: "Welcome to circuit.parts",
        heading: "You're on the list",
        bodyHtml: `<p>Thanks for subscribing — we'll email you when new components land and when restocks go live. No spam, just parts.</p>`,
        ctaText: "browse the catalog",
        ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL}/products`,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}