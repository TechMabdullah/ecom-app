import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { verifyAdmin } from "@/lib/admin-auth";

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

export async function GET(req: NextRequest) {
  const { ok } = await verifyAdmin(req);
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const snap = await db.collection("products").get();
  const products = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const { ok } = await verifyAdmin(req);
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const data = await req.json();
  if (!data.slug || !data.name) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
  }

  await db
    .collection("products")
    .doc(data.slug)
    .set({ ...data, createdAt: Date.now(), updatedAt: Date.now() });

  return NextResponse.json({ success: true, id: data.slug });
}