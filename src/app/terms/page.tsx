import LegalPage from "@/components/layout/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        By using circuit.parts, you agree to these terms. Please read them
        carefully before placing an order.
      </p>
      <p>
        <strong>Orders:</strong> All orders are subject to product
        availability. We reserve the right to cancel or refuse any order.
      </p>
      <p>
        <strong>Pricing:</strong> Prices are listed in USD and may change
        without notice. The price at the time of order confirmation is the
        price charged.
      </p>
      <p>
        <strong>Product accuracy:</strong> We do our best to ensure product
        descriptions and images are accurate, but we don&apos;t guarantee
        every detail is error-free.
      </p>
      <p>
        <strong>Limitation of liability:</strong> circuit.parts is not liable
        for any damages resulting from the use or misuse of purchased
        electronic components.
      </p>
    </LegalPage>
  );
}