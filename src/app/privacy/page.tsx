import LegalPage from "@/components/layout/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        We collect the information you provide when creating an account,
        placing an order, or contacting us — including your name, email,
        shipping address, and order history.
      </p>
      <p>
        We use this information solely to process orders, provide customer
        support, and — if you&apos;ve opted in — send occasional emails about
        new products and restocks. You can unsubscribe from marketing emails
        at any time.
      </p>
      <p>
        Payment information is processed directly by Stripe and is never
        stored on our servers. We do not sell your personal information to
        third parties.
      </p>
      <p>
        You can request access to, correction of, or deletion of your
        personal data at any time by contacting us.
      </p>
    </LegalPage>
  );
}