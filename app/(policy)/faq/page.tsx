import { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about InstaPact's legal agreements, pricing, and security.",
};

const faqs = [
  {
    question: "Is InstaPact legally binding?",
    answer: "Yes. InstaPact agreements are legally binding and designed to be compliant with the Information Technology Act (2000) in India, as well as global standards like the ESIGN Act (USA) and eIDAS (EU). We provide a digital audit trail for every document to verify authenticity."
  },
  {
    question: "Do my clients need an account to sign?",
    answer: "No. Your clients can sign the agreement directly from the link you send them. We've removed all friction to ensure you get your deals signed as fast as possible."
  },
  {
    question: "How does the pricing work?",
    answer: "We offer a Free plan for occasional users, a 'Pay-per-document' option for one-off deals (₹99), and monthly subscriptions (Standard & Agency) for power users who need custom branding and higher document limits."
  },
  {
    question: "Can I use my own logo on the agreements?",
    answer: "Yes, our Standard and Agency plans allow you to upload your brand logo and set a primary brand color. This ensures the signing experience feels like a professional extension of your own business."
  },
  {
    question: "What types of agreements can I create?",
    answer: "Currently, we offer templates for Scope Change (Statement of Work), Mutual Non-Disclosure Agreements (NDA), and Simple Deal Memos (Freelance Service Agreements). We are constantly adding new industry-standard templates."
  },
  {
    question: "Is my data secure?",
    answer: "We take security seriously. All data is encrypted using AES-256 at rest and transmitted over secure SSL. Our audit trails track IP addresses, timestamps, and browser fingerprinting to prevent fraud."
  },
  {
    question: "What happens if I cancel my subscription?",
    answer: "If you cancel, you will maintain access to your premium features until the end of your current billing cycle. After that, your account will move to the Free plan, but all your previously signed agreements will remain safely stored and accessible."
  }
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h1>

      <JsonLd 
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.instapact.in"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "FAQ",
              "item": "https://www.instapact.in/faq"
            }
          ]
        }}
      />
        <p className="text-xl text-slate-600 font-light">
          Everything you need to know about InstaPact.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-100 last:border-0 px-6">
              <AccordionTrigger className="text-left font-bold text-slate-900 hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="bg-indigo-50 rounded-2xl p-8 text-center space-y-4 border border-indigo-100">
        <h3 className="text-lg font-bold text-indigo-900">Still have questions?</h3>
        <p className="text-indigo-800/70">
          We're here to help you move faster. Reach out to our support team.
        </p>
        <div className="pt-2">
           <a 
             href="mailto:support@instapact.in" 
             className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
           >
             Contact Support
           </a>
        </div>
      </div>
    </div>
  );
}
