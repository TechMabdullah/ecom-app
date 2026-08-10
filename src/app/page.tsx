import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/shop/ProductCard";
import NewsletterSignup from "@/components/shop/NewsLetterSignup";

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <main>
      {/* Hero */}
      <section className="px-6 md:px-12 pt-20 pb-16 max-w-5xl mx-auto text-center">
        <p
          className="font-mono text-xs tracking-widest uppercase mb-4 animate-fade-up"
          style={{ color: "var(--amber)" }}
        >
          Dev boards &amp; components — in stock
        </p>
        <h1
          className="font-display text-5xl md:text-7xl font-semibold leading-[1.05] animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          Build the thing
          <br />
          in your head.
        </h1>
        <p
          className="mt-6 text-base md:text-lg opacity-60 max-w-lg mx-auto animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          Microcontrollers, sensors, and parts for makers — Arduino, ESP32,
          and everything else your next project needs.
        </p>
        <div
          className="mt-8 flex items-center justify-center gap-6 font-mono text-xs opacity-50 animate-fade-up"
          style={{ animationDelay: "220ms" }}
        >
          <span>★★★★★ 4.9 from 300+ makers</span>
        </div>
      </section>

      {/* Trust strip */}
      <section
        className="px-6 md:px-12 py-6 border-y max-w-5xl mx-auto"
        style={{ borderColor: "var(--trace)" }}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 font-mono text-xs opacity-50">
          <span>✓ Ships in 24h</span>
          <span>✓ Cash on delivery available</span>
          <span>✓ 5-day easy exchange</span>
          <span>✓ Talk to us on WhatsApp</span>
        </div>
      </section>

      {/* Featured products */}
      <section className="px-6 md:px-12 pt-16 pb-24 max-w-5xl mx-auto">
        <div
          className="flex items-baseline justify-between mb-8 border-b pb-3"
          style={{ borderColor: "var(--trace)" }}
        >
          <h2 className="font-display text-2xl">Featured</h2>
          <a href="/products" className="text-sm font-mono opacity-60 hover:opacity-100">
            view all →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        className="px-6 md:px-12 py-20 border-t max-w-5xl mx-auto"
        style={{ borderColor: "var(--trace)" }}
      >
        <h2 className="font-display text-2xl mb-12 text-center">How it works</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { step: "01", title: "Pick your parts", body: "Browse boards, sensors, and prototyping gear picked for real projects, not just specs sheets." },
            { step: "02", title: "Check out fast", body: "Card, COD, or order straight over WhatsApp — whichever's easiest for you." },
            { step: "03", title: "Start building", body: "Ships within 24 hours. Track it, get it, start soldering." },
          ].map((item) => (
            <div key={item.step}>
              <p className="font-mono text-3xl mb-3" style={{ color: "var(--amber)" }}>
                {item.step}
              </p>
              <h3 className="font-display text-lg mb-2">{item.title}</h3>
              <p className="text-sm opacity-60 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="px-6 md:px-12 py-20 border-t max-w-5xl mx-auto"
        style={{ borderColor: "var(--trace)" }}
      >
        <h2 className="font-display text-2xl mb-12 text-center">What makers say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { quote: "Ordered an ESP32 at night, had it building a weather station by the weekend. Fast shipping, genuine parts.", name: "Hamza, robotics student" },
            { quote: "Finally a store that doesn't sell knockoff boards. Everything's worked first try.", name: "Sara, hardware hobbyist" },
            { quote: "COD made it easy to trust them the first time. Now I order every month.", name: "Bilal, IoT developer" },
          ].map((t, i) => (
            <div key={i} className="component-card rounded-sm p-6">
              <p className="text-sm opacity-80 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p className="font-mono text-xs opacity-50">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section
        className="px-6 md:px-12 py-16 border-t max-w-5xl mx-auto"
        style={{ borderColor: "var(--trace)" }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl mb-1">Stay in the loop</h2>
            <p className="opacity-60 text-sm">New parts, restocks, and project ideas — no spam.</p>
          </div>
          <NewsletterSignup />
        </div>
      </section>
    </main>
  );
}