import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";

const SHIPPING_CENTS = 599; // flat $5.99 shipping for now

/**
 * @swagger
 * /api/checkout/create-payment-intent:
 *   post:
 *     summary: Create a Stripe payment intent for the current cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns a client secret to confirm payment
 */
export async function POST(req: NextRequest) {
  try {
    const { items, userId } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: { priceAtAdd: number; quantity: number }) => sum + item.priceAtAdd * item.quantity,
      0
    );
    const total = subtotal + SHIPPING_CENTS;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      metadata: { userId: userId || "guest" },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subtotal,
      shipping: SHIPPING_CENTS,
      total,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}