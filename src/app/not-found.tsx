import Link from "next/link";

export default function NotFound() {
  return (
    <main className="px-6 md:px-12 pt-32 pb-24 max-w-lg mx-auto text-center">
      <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "var(--amber)" }}>
        404
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">
        This part&apos;s not in stock.
      </h1>
      <p className="opacity-60 mb-10">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/products"
        className="font-mono text-sm px-6 py-3 rounded-sm border inline-block"
        style={{ borderColor: "var(--amber)", color: "var(--amber)" }}
      >
        browse parts
      </Link>
    </main>
  );
}