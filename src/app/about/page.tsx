import LegalPage from "@/components/layout/LegalPage";

export default function AboutPage() {
  return (
    <LegalPage title="About circuit.parts">
      <p>
        circuit.parts started as a small stock of Arduino and ESP32 boards for a
        local maker community — tired of waiting weeks for imported parts, or
        paying import markups for gear that should ship overnight.
      </p>
      <p>
        Today we stock development boards, sensors, and prototyping essentials,
        picked because we&apos;d actually use them ourselves. No knockoffs, no
        guesswork — just parts that work the first time.
      </p>
      <p>
        Have a question about a part, a project, or an order? Reach out on our{" "}
        <a href="/contact" className="underline">contact page</a> — we read
        every message.
      </p>
    </LegalPage>
  );
}