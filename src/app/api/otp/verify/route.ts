import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { adminAuth } from "@/lib/firebase-admin";

/**
 * @swagger
 * /api/otp/verify:
 *   post:
 *     summary: Verify a 6-digit OTP code for an email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *             required:
 *               - email
 *               - code
 *     responses:
 *       200:
 *         description: Code verified successfully
 *       400:
 *         description: Invalid or expired code
 *       500:
 *         description: Server error
 */
export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const ref = doc(db, "otp_codes", email);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json({ error: "No code found for this email" }, { status: 400 });
    }

    const data = snap.data();

    if (Date.now() > data.expiresAt.toMillis()) {
      await deleteDoc(ref);
      return NextResponse.json({ error: "Code has expired" }, { status: 400 });
    }

    if (data.attempts >= 5) {
      await deleteDoc(ref);
      return NextResponse.json({ error: "Too many attempts, request a new code" }, { status: 400 });
    }

    if (data.code !== code) {
      return NextResponse.json({ error: "Incorrect code" }, { status: 400 });
    }

    // Correct — clean up the used code
    await deleteDoc(ref);

    // Find or create a Firebase Auth user for this email, then issue a custom token
    let uid: string;
    try {
      const existingUser = await adminAuth.getUserByEmail(email);
      uid = existingUser.uid;
    } catch {
      const newUser = await adminAuth.createUser({ email, emailVerified: true });
      uid = newUser.uid;
    }

    const customToken = await adminAuth.createCustomToken(uid);

    return NextResponse.json({ success: true, token: customToken });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}