export default function Loading() {
  return (
    <main className="px-6 md:px-12 pt-16 pb-24 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square rounded-sm animate-pulse" style={{ backgroundColor: "var(--trace)" }} />
        <div>
          <div className="h-3 w-20 rounded-sm mb-3 animate-pulse" style={{ backgroundColor: "var(--trace)" }} />
          <div className="h-8 w-3/4 rounded-sm mb-4 animate-pulse" style={{ backgroundColor: "var(--trace)" }} />
          <div className="h-6 w-24 rounded-sm mb-6 animate-pulse" style={{ backgroundColor: "var(--trace)" }} />
          <div className="h-4 w-full rounded-sm mb-2 animate-pulse" style={{ backgroundColor: "var(--trace)" }} />
          <div className="h-4 w-2/3 rounded-sm animate-pulse" style={{ backgroundColor: "var(--trace)" }} />
        </div>
      </div>
    </main>
  );
}