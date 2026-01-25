import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy",
  description: "Learn about refunds and cancellations for InstaPact digital services and subscriptions.",
};

export default function RefundPolicy() {
  return (
    <>
      <h1>Refund and Cancellation Policy</h1>
      <p>Last updated: January 24, 2026</p>

      <h2>1. Digital Products</h2>
      <p>
        InstaPact provides digital services (agreement generation) and digital goods. Due to the nature of digital content, we generally do not offer refunds once the service has been used (e.g., a document has been generated or downloaded).
      </p>

      <h2>2. Single Document Purchases</h2>
      <p>
        For "Single Document" or pay-per-use purchases, all sales are final. If you encountered a technical error that prevented the generation of your document, please contact support for a resolution or credit.
      </p>

      <h2>3. Subscriptions</h2>
      <p>
        For "Standard" or "Agency" subscriptions:
      </p>
      <ul>
        <li>You may cancel your subscription at any time. Your access will continue until the end of your current billing period.</li>
        <li>We do not offer prorated refunds for partial billing periods.</li>
        <li>If you believe you were charged in error, please contact us within 7 days of the charge.</li>
      </ul>

      <h2>4. Dispute Resolution</h2>
      <p>
        If you have any issues with our services, please contact our support team before initiating a chargeback. We are committed to resolving legitimate issues fairly.
      </p>

      <h2>5. Contact Us</h2>
      <p>
        For any refund requests or cancellation issues, please email us at <a href="mailto:billing@instapact.in" className="text-indigo-600 font-medium">billing@instapact.in</a>.
      </p>
    </>
  );
}
