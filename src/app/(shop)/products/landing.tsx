export default function Loading() {
  return (
    <main className="px-6 md:px-12 pt-16 pb-24 max-w-5xl mx-auto">
      <div className="mb-10">
        <div className="h-3 w-24 rounded-sm mb-3 animate-pulse" style={{ backgroundColor: "var(--trace)" }} />
        <div className="h-10 w-64 rounded-sm animate-pulse" style={{ backgroundColor: "var(--trace)" }} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-square rounded-sm animate-pulse" style={{ backgroundColor: "var(--trace)" }} />
            <div className="h-4 w-3/4 rounded-sm mt-3 animate-pulse" style={{ backgroundColor: "var(--trace)" }} />
            <div className="h-3 w-1/2 rounded-sm mt-2 animate-pulse" style={{ backgroundColor: "var(--trace)" }} />
          </div>
        ))}
      </div>
    </main>
  );
}