import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { Resend } from "resend";
import { adminAuth } from "@/lib/firebase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

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

/**
 * @swagger
 * /api/orders/create:
 *   post:
 *     summary: Create an order after a successful payment
 *     responses:
 *       200:
 *         description: Order created
 */
export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, userId, items, shippingAddress, subtotal, shipping, total } =
      await req.json();

    // Verify the payment actually succeeded on Stripe's side before trusting the client
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 400 });
    }

    const orderRef = db.collection("orders").doc();
    await orderRef.set({
      userId: userId || "guest",
      items,
      subtotal,
      shipping,
      tax: 0,
      total,
      status: "paid",
      shippingAddress,
      stripePaymentIntentId: paymentIntentId,
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

    // Send an order confirmation email (best-effort — don't fail the order if email fails)
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
              `<tr>
                <td style="padding: 8px 0;">${item.name} × ${item.quantity}</td>
                <td style="padding: 8px 0; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
              </tr>`
          )
          .join("");

        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: recipientEmail,
          subject: `Order confirmed — #${orderRef.id.slice(0, 8)}`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2>Thanks for your order!</h2>
              <p style="color: #666;">Order ID: ${orderRef.id}</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                ${itemsHtml}
                <tr style="border-top: 1px solid #ddd;">
                  <td style="padding: 8px 0;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right;">${formatPrice(subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">Shipping</td>
                  <td style="padding: 8px 0; text-align: right;">${formatPrice(shipping)}</td>
                </tr>
                <tr style="font-weight: bold;">
                  <td style="padding: 8px 0;">Total</td>
                  <td style="padding: 8px 0; text-align: right;">${formatPrice(total)}</td>
                </tr>
              </table>
              <p style="color: #666; font-size: 14px;">
                Shipping to: ${shippingAddress.fullName}, ${shippingAddress.line1}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}
              </p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      // Log but don't block order success on an email failure
      console.error("Order confirmation email failed:", emailErr);
    }

    return NextResponse.json({ success: true, orderId: orderRef.id });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}