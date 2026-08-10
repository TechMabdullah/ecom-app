import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-24" style={{ borderColor: "var(--trace)" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-lg font-semibold mb-2">
            circuit<span style={{ color: "var(--amber)" }}>.parts</span>
          </p>
          <p className="text-xs opacity-50 leading-relaxed">
            Dev boards &amp; components for makers.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wide opacity-50 mb-3">Shop</p>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <Link href="/products" className="hover:opacity-100">All products</Link>
            <Link href="/cart" className="hover:opacity-100">Cart</Link>
            <Link href="/orders" className="hover:opacity-100">Your orders</Link>
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wide opacity-50 mb-3">Company</p>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <Link href="/about" className="hover:opacity-100">About</Link>
            <Link href="/contact" className="hover:opacity-100">Contact</Link>
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wide opacity-50 mb-3">Legal</p>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <Link href="/privacy" className="hover:opacity-100">Privacy Policy</Link>
            <Link href="/terms" className="hover:opacity-100">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:opacity-100">Refund Policy</Link>
          </div>
        </div>
      </div>

      <div
        className="border-t py-6 text-center font-mono text-xs opacity-40"
        style={{ borderColor: "var(--trace)" }}
      >
        © {new Date().getFullYear()} circuit.parts — All rights reserved.
      </div>
    </footer>
  );
}