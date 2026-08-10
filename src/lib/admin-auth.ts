import { NextRequest } from "next/server";
import { adminAuth } from "./firebase-admin";

export async function verifyAdmin(req: NextRequest): Promise<{ ok: boolean; email?: string }> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return { ok: false };

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
    if (decoded.email && adminEmails.includes(decoded.email)) {
      return { ok: true, email: decoded.email };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}