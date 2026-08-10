import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { Product } from "@/types";

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

export async function getFeaturedProducts(): Promise<Product[]> {
  const snap = await db.collection("products").where("featured", "==", true).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product);
}

export async function getAllProducts(): Promise<Product[]> {
  const snap = await db.collection("products").get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const doc = await db.collection("products").doc(slug).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Product;
}