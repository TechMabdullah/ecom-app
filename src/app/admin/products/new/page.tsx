import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <main className="px-6 md:px-12 pt-16 pb-24 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl font-semibold mb-10">Add product</h1>
      <ProductForm />
    </main>
  );
}