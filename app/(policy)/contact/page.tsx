import { Mail, MapPin, Phone } from "lucide-react";
import { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the InstaPact team for support, feedback, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
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
              "name": "Contact",
              "item": "https://www.instapact.in/contact"
            }
          ]
        }}
      />
        <p className="mt-4 text-slate-600">
          We're here to help! If you have any questions, concerns, or feedback, please reach out to us using the details below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <Mail className="w-6 h-6 text-indigo-600 mt-1 mr-4" />
              <div>
                <h3 className="font-medium text-slate-900">Email</h3>
                <p className="text-slate-500 text-sm mt-1">Our friendly team is here to help.</p>
                <a href="mailto:support@instapact.in" className="text-indigo-600 font-medium hover:underline mt-1 block">
                  support@instapact.in
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="w-6 h-6 text-indigo-600 mt-1 mr-4" />
              <div>
                <h3 className="font-medium text-slate-900">Phone</h3>
                <p className="text-slate-500 text-sm mt-1">Mon-Fri from 10am to 6pm IST.</p>
                <a href="tel:+918978700050" className="text-indigo-600 font-medium hover:underline mt-1 block">
                  +91-89787 00050
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="w-6 h-6 text-indigo-600 mt-1 mr-4" />
              <div>
                <h3 className="font-medium text-slate-900">Office</h3>
                <p className="text-slate-500 text-sm mt-1">
                  403, Pratyusha Mansion, Alkapur Township,<br />
                  Manikonda, Hyderabad - 500089<br />
                  Telangana, India
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Send us a message</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input type="text" id="name" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" id="email" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@company.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea id="message" rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="How can we help?"></textarea>
            </div>
            <button type="button" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
