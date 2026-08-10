import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { Resend } from "resend";
import { adminAuth } from "@/lib/firebase-admin";
import { renderEmailLayout } from "@/lib/email-template";

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
const resend = new Resend(process.env.RESEND_API_KEY);

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * @swagger
 * /api/orders/create-cod:
 *   post:
 *     summary: Create an order to be paid on delivery (Cash on Delivery)
 *     responses:
 *       200:
 *         description: Order created
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, items, shippingAddress, subtotal, shipping, total } = await req.json();

    if (!items?.length || !shippingAddress?.fullName) {
      return NextResponse.json({ error: "Missing order details" }, { status: 400 });
    }

    const orderRef = db.collection("orders").doc();
    await orderRef.set({
      userId: userId || "guest",
      items,
      subtotal,
      shipping,
      tax: 0,
      total,
      status: "pending", // unpaid — cash due on delivery
      paymentMethod: "cod",
      shippingAddress,
      createdAt: Date.now(),
    });
    
    // Decrement stock for each purchased item
    for (const item of items) {
      const productRef = db.collection("products").doc(item.productId);
      await db.runTransaction(async (t) => {
        const doc = await t.get(productRef);
        if (!doc.exists) return;
        const currentStock = doc.data()?.stock || 0;
        t.update(productRef, { stock: Math.max(0, currentStock - item.quantity) });
      });
    }

    try {
      let recipientEmail = shippingAddress.email;
      if (!recipientEmail && userId && userId !== "guest") {
        const userRecord = await adminAuth.getUser(userId);
        recipientEmail = userRecord.email;
      }

      if (recipientEmail) {
        const itemsHtml = items
          .map(
            (item: { name: string; quantity: number; price: number }) =>
              `<tr><td style="padding:8px 0;">${item.name} × ${item.quantity}</td><td style="padding:8px 0; text-align:right;">${formatPrice(item.price * item.quantity)}</td></tr>`
          )
          .join("");

        await resend.emails.send({
          from: "circuit.parts <onboarding@resend.dev>",
          to: recipientEmail,
          subject: `Order confirmed (Pay on Delivery) — #${orderRef.id.slice(0, 8)}`,
          html: renderEmailLayout({
            previewText: `Pay ${formatPrice(total)} on delivery`,
            heading: "Order confirmed — pay on delivery",
            bodyHtml: `
              <p style="color:#9a9a8f; font-size:13px; margin-bottom:16px;">Order #${orderRef.id.slice(0, 8)}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                ${itemsHtml}
                <tr><td colspan="2" style="padding-top:12px; border-top:1px solid #eeece4;"></td></tr>
                <tr><td style="padding:4px 0; font-weight:bold;">Total due on delivery</td><td style="padding:4px 0; text-align:right; font-weight:bold; color:#c98a1f;">${formatPrice(total)}</td></tr>
              </table>
              <p style="color:#9a9a8f; font-size:13px; margin-top:20px;">
                Shipping to: ${shippingAddress.fullName}, ${shippingAddress.line1}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}
              </p>
              <p style="color:#9a9a8f; font-size:13px;">Please have exact change ready for the courier.</p>
            `,
          }),
        });
      }
    } catch (emailErr) {
      console.error("COD order email failed:", emailErr);
    }

    return NextResponse.json({ success: true, orderId: orderRef.id });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}