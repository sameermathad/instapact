import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "Information about digital delivery and instant access to InstaPact services.",
};

export default function ShippingPolicy() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shipping and Delivery Policy</h1>
      <p className="text-slate-500">Last updated: January 24, 2026</p>

      <div className="space-y-8 mt-12">
        <section>
          <h2 className="text-xl font-bold text-slate-900">1. Digital Delivery</h2>
          <p className="text-slate-600 leading-relaxed">
            InstaPact is a SaaS (Software as a Service) platform. We do not sell or ship physical goods. All services are delivered digitally through our web application at <a href="https://www.instapact.in" className="text-indigo-600 font-medium">www.instapact.in</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">2. Instant Access</h2>
          <p className="text-slate-600 leading-relaxed">
            Upon successful payment processing:
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2 text-slate-600">
            <li><strong>Single Documents:</strong> Access to generate and download your document is provided immediately within the dashboard.</li>
            <li><strong>Subscriptions:</strong> Your account is instantly upgraded to the selected plan (Standard or Agency), unlocking premium features without delay.</li>
            <li><strong>Credits:</strong> Any purchased document credits are instantly added to your account balance.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">3. Delivery Confirmation</h2>
          <p className="text-slate-600 leading-relaxed">
            A confirmation email will be sent to your registered email address upon every successful transaction. This email serves as your proof of delivery for the digital service.
          </p>
        </section>

        <section className="bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">4. Issues with Access</h2>
          <p className="text-slate-600 leading-relaxed">
            In rare cases where technical issues prevent immediate delivery, please contact our support team at <a href="mailto:support@instapact.in" className="text-indigo-600 font-semibold underline">support@instapact.in</a> with your transaction ID for manual fulfillment.
          </p>
        </section>
      </div>
    </div>
  );
}

