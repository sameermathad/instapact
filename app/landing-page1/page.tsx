import { Footer } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneMockup } from "@/components/landing/phone-mockup";
import { Shield, Lock, FileText, CheckCircle2, ArrowRight, Zap, Scale, FileCheck, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Logo } from "@/components/logo";

export default function LandingPageVariant1() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navigation */}
      <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo showBeta={false} />
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Login
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800">Start for Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* 1. Hero Section */}
        <section className="pt-20 pb-24 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <Badge variant="outline" className="mb-6 border-indigo-200 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                 Solution to Scope Creep
              </Badge>
              <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                Stop Doing Extra <br/> Work For <span className="text-indigo-600 underline decoration-wavy decoration-indigo-300">Free</span>.
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Create legally binding Change Orders, NDAs, and Freelance Agreements in 30 seconds. Just send a link.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                 <Link href="/dashboard">
                   <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700">
                     Create Free Agreement
                   </Button>
                 </Link>
                 <Link href="#demo">
                   <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2">
                     View Demo
                   </Button>
                 </Link>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                No credit card required. Free forever for 3 docs/month.
              </p>
            </div>

            {/* Visual: Split Screen */}
            <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
               {/* Left: Pain */}
               <div className="relative rounded-2xl overflow-hidden shadow-2xl skew-y-1 transform transition-transform hover:skew-y-0 duration-500 border-4 border-white">
                  <div className="absolute inset-0 bg-indigo-900/10 z-10"></div>
                  <Image 
                    src="/images/stressed-freelancer.png" 
                    alt="Stressed Freelancer" 
                    width={800} 
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                  {/* Email Overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl max-w-[80%] z-20">
                     <p className="text-xs text-slate-400 mb-2">From: demanding_client@client.com</p>
                     <p className="font-serif italic text-slate-800 text-lg">
                       "Hey! Love the work. Can you just add these 5 'small' features real quick? We need them by tomorrow."
                     </p>
                  </div>
               </div>

               {/* Right: Solution */}
               <div className="flex justify-center transform md:-skew-y-1 md:translate-y-12 transition-transform hover:skew-y-0 duration-500 hover:translate-y-0">
                  <PhoneMockup />
               </div>
            </div>
          </div>
        </section>

        {/* 2. Pain Section */}
        <section className="py-24 bg-white">
           <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-indigo-600 font-bold tracking-wide uppercase mb-3">The "Quick Favor" Trap</h2>
              <h3 className="text-4xl font-bold text-slate-900 mb-12">"Can you just..."</h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                 <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-lg font-medium text-slate-800">"...change the logo?"</p>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-lg font-medium text-slate-800">"...add a dark mode?"</p>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-lg font-medium text-slate-800">"...sign an NDA first?"</p>
                 </div>
              </div>
              
              <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
                 <p className="text-xl text-slate-800 leading-relaxed font-serif">
                   "These small requests kill your profit. <br/>Sending a Word Doc takes too long. Sending an email isn't legally binding. <br/><span className="font-bold text-indigo-700">InstaPact bridges the gap.</span>"
                 </p>
              </div>
           </div>
        </section>

        {/* 3. How It Works */}
        <section className="py-24 bg-slate-900 text-white">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold">30 Seconds to Signed</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-12 text-center relative">
                 {/* Connector Line */}
                 <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-700 -z-0"></div>

                 <div className="relative z-10">
                    <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-900/50 text-3xl font-bold border-4 border-slate-900">1</div>
                    <h3 className="text-xl font-bold mb-3">Create</h3>
                    <p className="text-slate-400">Select a template (Scope Change, NDA, Deal Memo). Type the details.</p>
                 </div>
                 
                 <div className="relative z-10">
                    <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-900/50 text-3xl font-bold border-4 border-slate-900">2</div>
                    <h3 className="text-xl font-bold mb-3">Link</h3>
                    <p className="text-slate-400">Get a secure instapact.in link. WhatsApp or Slack it to your client.</p>
                 </div>
                 
                 <div className="relative z-10">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-900/50 text-3xl font-bold border-4 border-slate-900">3</div>
                    <h3 className="text-xl font-bold mb-3">Signed</h3>
                    <p className="text-slate-400">Client clicks 'Approve' on their phone. You get a signed PDF instantly.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* 4. Trust Signals */}
        <section className="py-12 bg-slate-100 border-b border-slate-200">
           <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                 <div className="flex items-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span className="font-bold text-slate-900">AES-256 Bank-Grade Security</span>
                 </div>
                 <div className="flex items-center space-x-2">
                    <Scale className="w-5 h-5" />
                    <span className="font-bold text-slate-900">Legally Binding (ESIGN Compliant)</span>
                 </div>
                 <div className="flex items-center space-x-2">
                    <FileCheck className="w-5 h-5" />
                    <span className="font-bold text-slate-900">Audit Trails Included</span>
                 </div>
              </div>
           </div>
        </section>

        {/* 5. Use Cases */}
        <section className="py-24 bg-white">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">Tools for Every Stage</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                 <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                       <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Scope Guard</h3>
                    <p className="text-slate-600">For when the project grows beyond the original plan. Get paid for extras.</p>
                 </div>
                 
                 <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 text-purple-600">
                       <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Instant NDA</h3>
                    <p className="text-slate-600">For when you need to talk business but keep ideas safe. 30 seconds to protection.</p>
                 </div>
                 
                 <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 text-emerald-600">
                       <DollarSign className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Freelance Deal</h3>
                    <p className="text-slate-600">Lock in the deposit and deliverables before you start. Simple and effective.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* 6. Pricing */}
        <section className="py-24 bg-slate-50">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">Simple Pricing</h2>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
                 {/* Free */}
                 <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
                    <div className="text-4xl font-black text-slate-900 mb-6">Free</div>
                    <ul className="space-y-4 mb-8 flex-1">
                       <li className="flex items-center text-slate-600"><CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2" /> 3 Docs / Month</li>
                       <li className="flex items-center text-slate-600"><CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2" /> Watermarked PDFs</li>
                       <li className="flex items-center text-slate-600"><CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2" /> Standard Security</li>
                    </ul>
                    <Button variant="outline" className="w-full">Start Free</Button>
                 </div>
                 
                 {/* Pro */}
                 <div className="bg-slate-900 p-8 rounded-2xl border border-indigo-500 shadow-xl relative flex flex-col transform md:-translate-y-4">
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                    <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                    <div className="text-4xl font-black text-white mb-6">₹499<span className="text-lg font-normal text-slate-400">/mo</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                       <li className="flex items-center text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-400 mr-2" /> Unlimited Docs</li>
                       <li className="flex items-center text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-400 mr-2" /> No Branding</li>
                       <li className="flex items-center text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-400 mr-2" /> Custom Logo</li>
                    </ul>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12">Get Pro</Button>
                 </div>
                 
                 {/* One-Time */}
                 <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Pay As You Go</h3>
                    <div className="text-4xl font-black text-slate-900 mb-6">₹99<span className="text-lg font-normal text-slate-400">/doc</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                       <li className="flex items-center text-slate-600"><CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2" /> Single Use</li>
                       <li className="flex items-center text-slate-600"><CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2" /> No Subscription</li>
                       <li className="flex items-center text-slate-600"><CheckCircle2 className="w-5 h-5 text-indigo-600 mr-2" /> All Features</li>
                    </ul>
                    <Button variant="outline" className="w-full">Buy Credits</Button>
                 </div>
              </div>
           </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
