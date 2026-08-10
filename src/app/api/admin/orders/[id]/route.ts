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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { ok } = await verifyAdmin(req);
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();

  await db.collection("orders").doc(id).update({ status });

  return NextResponse.json({ success: true });
}