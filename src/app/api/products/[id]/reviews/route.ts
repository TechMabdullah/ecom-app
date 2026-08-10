import { NextRequest, NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { rateLimit } from "@/lib/rate-limit";

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
const db = getFirestore(app);



export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, rating, body } = await req.json();

    if (!name || !rating || !body) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const review = {
      id: crypto.randomUUID(),
      name,
      rating: Math.min(5, Math.max(1, Number(rating))),
      body,
      createdAt: Date.now(),
    };

    await db
      .collection("products")
      .doc(id)
      .update({ reviews: FieldValue.arrayUnion(review) });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}