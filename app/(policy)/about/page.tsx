import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about InstaPact's mission to simplify digital agreements for the global gig economy.",
};

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Professional infrastructure for the gig economy.</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          InstaPact was built to bridge the gap between a handshake deal and a month-long legal process.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Our Mission</h2>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
          <p>
            In the modern economy, business moves at the speed of thought. Yet, the legal framework that protects our work is still stuck in the past—hidden behind paywalls, complex jargon, and clunky legacy software.
          </p>
          <p>
            <strong>Freelancers, agencies, and consultants lose millions every year</strong> to scope creep, unpaid invoices, and simple misunderstandings. InstaPact was born from a simple frustration: "Why is it so hard to get a basic agreement signed in 30 seconds?"
          </p>
          <p>
            We are here to provide the standard, frictionless, and professional infrastructure that protects every creator, no matter the size of the deal.
          </p>
        </div>
      </section>

      <section className="space-y-6 bg-indigo-50/50 p-8 rounded-2xl border border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-900">Why InstaPact?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <h3 className="font-bold text-indigo-900">Speed First</h3>
            <p className="text-sm text-indigo-800/70">Create and sign agreements in under 30 seconds. No more back-and-forth emails or PDF editors.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-indigo-900">Legally Sound</h3>
            <p className="text-sm text-indigo-800/70">Standardized templates built for real-world business scenarios, from copyright transfers to payment schedules.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-indigo-900">Built for Agencies</h3>
            <p className="text-sm text-indigo-800/70">Remove watermarks, use custom logos, and manage all your client deal-flow in one professional dashboard.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-indigo-900">Frictionless Signing</h3>
            <p className="text-sm text-indigo-800/70">A seamless, beautiful signing experience for your clients that works on any device.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6 pt-6 text-center border-t border-slate-100">
        <p className="text-slate-500 italic">
          Based in India, serving creators worldwide. 🇮🇳
        </p>
        <p className="text-slate-400 text-sm">
          A project by <a href="https://vybetech.in" target="_blank" className="underline hover:text-indigo-600">VybeTech</a>.
        </p>
      </section>
    </div>
  );
}
