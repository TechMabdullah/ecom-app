import Link from "next/link";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <main className="px-6 md:px-12 pt-24 pb-24 max-w-2xl mx-auto text-center">
      <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "var(--amber)" }}>
        Order confirmed
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">
        Thanks — it&apos;s on the way.
      </h1>
      <p className="opacity-60 mb-2">Order ID</p>
      <p className="font-mono text-sm mb-10 opacity-80">{orderId}</p>
      <Link
        href="/products"
        className="font-mono text-sm px-6 py-3 rounded-sm border inline-block"
        style={{ borderColor: "var(--amber)", color: "var(--amber)" }}
      >
        continue shopping
      </Link>
    </main>
  );
}