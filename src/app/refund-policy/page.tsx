import LegalPage from "@/components/layout/LegalPage";

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        <strong>Exchanges:</strong> We offer a 5-day easy exchange window from
        the date of delivery for unopened, unused items in original packaging.
      </p>
      <p>
        <strong>Refunds:</strong> If an item arrives defective or not as
        described, contact us within 5 days of delivery for a full refund or
        replacement.
      </p>
      <p>
        <strong>Non-refundable items:</strong> Opened electronic components
        that have been connected to power cannot be returned, for safety and
        quality-assurance reasons.
      </p>
      <p>
        <strong>How to request:</strong> Email us via the{" "}
        <a href="/contact" className="underline">contact page</a> with your
        order number and the issue — we&apos;ll respond within 1 business day.
      </p>
    </LegalPage>
  );
}