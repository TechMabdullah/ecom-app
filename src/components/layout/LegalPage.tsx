export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="px-6 md:px-12 pt-16 pb-24 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl font-semibold mb-10">{title}</h1>
      <div className="space-y-6 text-sm leading-relaxed opacity-80">{children}</div>
    </main>
  );
}