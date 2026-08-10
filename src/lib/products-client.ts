import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Product } from "@/types";

export async function getProductBySlugClient(slug: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", slug));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}