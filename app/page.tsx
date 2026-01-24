"use client";

import { HeroWidget } from "@/components/landing/hero-widget";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PricingSection } from "@/components/landing/pricing-section";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, CheckCircle2, ArrowRight, Lock, Scale, FileText, FileCheck, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <Navbar />

      <main className="flex-grow">
        {/* Massive Hero Section */}
        <section className="relative pt-20 pb-0 lg:pt-32 overflow-hidden">
          {/* Background decoration */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.7 }}
             transition={{ duration: 1.5 }}
             className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-transparent pointer-events-none"
           ></motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              
              {/* Left Column: Copy */}
              <div className="flex-1 text-center lg:text-left space-y-10">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center space-x-2 bg-slate-900 rounded-full pl-1 pr-4 py-1 mb-4"
                >
                  <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
                  <span className="text-sm font-medium text-slate-200">Instant Scope Change Agreements</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-tight mb-8"
                >
                  Agreements <br/>
                  at the speed of <br/>
                  <span className="text-indigo-600">chat.</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light mb-10"
                >
                  The "Calendly for Contracts." Create legally binding micro-agreements in seconds. No logins for clients. Just a link.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8"
                >
                  <div className="flex items-center group">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3 group-hover:bg-emerald-200 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-slate-900 font-semibold text-lg">Legally Binding</span>
                  </div>
                  <div className="flex items-center group">
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-slate-900 font-semibold text-lg">Under 30s</span>
                  </div>
                </motion.div>
              </div>
              
              {/* Right Column: Functional Widget Only */}
              <div className="flex-1 w-full max-w-md mx-auto lg:max-w-none flex justify-center lg:justify-end relative">
                {/* Decorative Elements around Widget */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>
                
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9, y: 50 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   transition={{ delay: 0.8, type: "spring", duration: 1 }}
                   className="w-full max-w-[440px]"
                >
                   <HeroWidget />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Why InstaPact - Value Proposition */}
        <section className="py-32 bg-white border-b border-slate-50 relative overflow-hidden">
           {/* Background Grid */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
           <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>

           <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
              <motion.span 
                 {...fadeInUp}
                 className="inline-flex items-center py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 font-bold tracking-wide uppercase text-[10px] mb-8 border border-indigo-100 shadow-sm"
              >
                 <Zap className="w-3 h-3 mr-1.5" /> Why InstaPact?
              </motion.span>
              <motion.h2 
                 {...fadeInUp}
                 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-tight mb-8 tracking-tight"
              >
                 Professional infrastructure <br /> for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">independent creators</span>.
              </motion.h2>
              <motion.p 
                 {...fadeInUp}
                 transition={{ delay: 0.2 }}
                 className="text-xl sm:text-2xl text-slate-500 max-w-3xl mx-auto font-normal leading-relaxed mb-12"
              >
                 Stop relying on "handshake deals" over email. <br className="hidden sm:block" />
                 We provide the <span className="text-slate-900 font-semibold underline decoration-indigo-300 decoration-2 underline-offset-4">legal layer</span> so you can focus on the work.
              </motion.p>
              
              {/* Stats / Social Proof */}
              <motion.div 
                 initial="hidden"
                 whileInView="show"
                 viewport={{ once: true }}
                 variants={staggerContainer}
                 className="flex flex-wrap justify-center gap-8 md:gap-16 border-t border-slate-100 pt-12 max-w-4xl mx-auto"
              >
                 <motion.div variants={fadeInUp} className="flex flex-col items-center group cursor-default">
                    <div className="p-4 bg-indigo-50 rounded-2xl mb-4 text-indigo-600 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-indigo-100">
                       <Shield className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-slate-900 text-lg">Bank-Grade Security</div>
                 </motion.div>
                 <div className="hidden md:block w-px bg-slate-200"></div>
                 <motion.div variants={fadeInUp} className="flex flex-col items-center group cursor-default">
                    <div className="p-4 bg-emerald-50 rounded-2xl mb-4 text-emerald-600 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-emerald-100">
                        <Scale className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-slate-900 text-lg">Legally Binding</div>
                 </motion.div>
                 <div className="hidden md:block w-px bg-slate-200"></div>
                 <motion.div variants={fadeInUp} className="flex flex-col items-center group cursor-default">
                    <div className="p-4 bg-blue-50 rounded-2xl mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100">
                       <Zap className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-slate-900 text-lg">Instant Creation</div>
                 </motion.div>
              </motion.div>
           </div>
        </section>

        {/* 2. Pain Section - The "Quick Favor" Trap */}
        <section className="py-24 bg-slate-50 overflow-hidden">
           <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                 <motion.h2 {...fadeInUp} className="text-indigo-600 font-bold tracking-wide uppercase mb-3 text-sm">Revenue Protection</motion.h2>
                 <motion.h3 {...fadeInUp} className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">The "Quick Favor" Trap</motion.h3>
              </div>
              
              <div className="relative max-w-4xl mx-auto h-[500px] mb-12">
                 {/* Chat Bubbles using Motion */}
                 <motion.div 
                    initial={{ opacity: 0, x: -50, rotate: -10 }}
                    whileInView={{ opacity: 1, x: 0, rotate: -3 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="absolute top-0 left-0 md:left-20 bg-white p-6 rounded-2xl rounded-bl-none shadow-xl border border-slate-100 max-w-xs"
                 >
                    <p className="text-lg font-medium text-slate-800">"Can you just change the logo?"</p>
                 </motion.div>
                 
                 <motion.div 
                    initial={{ opacity: 0, x: 50, rotate: 10 }}
                    whileInView={{ opacity: 1, x: 0, rotate: 3 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="absolute top-24 right-0 md:right-20 bg-white p-6 rounded-2xl rounded-br-none shadow-xl border border-slate-100 max-w-xs"
                 >
                    <p className="text-lg font-medium text-slate-800">"Can we add a dark mode?"</p>
                 </motion.div>
                 
                 <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0, rotate: -1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="absolute top-48 left-10 md:left-40 bg-white p-6 rounded-2xl rounded-tl-none shadow-xl border border-slate-100 max-w-sm"
                 >
                    <p className="text-lg font-medium text-slate-800">"Let's chat, but sign an NDA first."</p>
                 </motion.div>
                 
                 {/* The Insight */}
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-slate-900 p-8 rounded-3xl shadow-2xl text-center z-10"
                 >
                    <p className="text-xl text-white leading-relaxed font-medium">
                       These small requests <span className="text-orange-400 font-bold decoration-wavy underline decoration-orange-400/30">kill your profit</span>. <br/>
                       <span className="text-base text-slate-400 font-normal mt-3 block">
                         Sending a Word Doc takes too long. Sending an email isn't legally binding.
                       </span>
                    </p>
                    <div className="mt-6 inline-flex items-center bg-indigo-600/20 text-indigo-300 px-4 py-1.5 rounded-full border border-indigo-500/30 text-sm font-semibold">
                       <Zap className="w-4 h-4 mr-2" /> InstaPact bridges the gap.
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* 3. How It Works - 30 Seconds to Signed */}
        <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
           {/* Abstract Background */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-20">
                 <motion.h2 {...fadeInUp} className="text-4xl sm:text-5xl font-black tracking-tight mb-6">30 Seconds to Signed</motion.h2>
                 <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="text-xl text-slate-400 max-w-2xl mx-auto">
                   The workflow built for speed. No more "I'll send it over tonight." Send it now.
                 </motion.p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-16 text-center relative">
                 {/* Connector Line (Desktop) */}
                 <motion.div 
                   initial={{ scaleX: 0 }}
                   whileInView={{ scaleX: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, delay: 0.5 }}
                   className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-800 z-0 origin-left"
                 ></motion.div>

                 <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.2 }}
                   className="relative z-10 group"
                 >
                    <div className="w-24 h-24 bg-slate-800 group-hover:bg-indigo-600 transition-colors duration-300 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-slate-700 group-hover:border-indigo-500">
                       <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">1. Create</h3>
                    <p className="text-slate-400 leading-relaxed">Select a template (Scope Change, NDA, Deal Memo). Type the details in seconds.</p>
                 </motion.div>
                 
                 <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="relative z-10 group"
                 >
                    <div className="w-24 h-24 bg-slate-800 group-hover:bg-indigo-600 transition-colors duration-300 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-slate-700 group-hover:border-indigo-500">
                       <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">2. Link</h3>
                    <p className="text-slate-400 leading-relaxed">Get a secure instapact.in link. WhatsApp or Slack it simply to your client.</p>
                 </motion.div>
                 
                 <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="relative z-10 group"
                 >
                    <div className="w-24 h-24 bg-slate-800 group-hover:bg-emerald-500 transition-colors duration-300 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-slate-700 group-hover:border-emerald-400">
                       <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">3. Signed</h3>
                    <p className="text-slate-400 leading-relaxed">Client clicks 'Approve' on mobile. You get a signed PDF instantly.</p>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* 4. Use Cases - Tools for Every Stage */}
        <section className="py-32 bg-white">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                <motion.h2 {...fadeInUp} className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-6">Tools for Every Stage</motion.h2>
                <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="text-xl text-slate-500">From the first meeting to the final handoff.</motion.p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                 {/* Card 1: Scope Guard */}
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
                 >
                    <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center text-slate-300 mb-6 border border-slate-800 group-hover:border-slate-700 group-hover:text-white transition-colors">
                       <Zap className="w-6 h-6" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">Scope Guard</h3>
                    <p className="text-slate-400 leading-relaxed mb-8 flex-1 text-sm">
                      Project creeping beyond the brief? Send this link to get paid for the extras instantly.
                    </p>
                    
                    <Link href="/dashboard/new?type=SCOPE" className="mt-auto">
                       <Button variant="ghost" className="w-full bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800 hover:border-slate-700 justify-between group-hover:pl-6 transition-all duration-300 h-11 rounded-lg">
                          Create Scope Guard <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </Button>
                    </Link>
                 </motion.div>
                 
                 {/* Card 2: Instant NDA */}
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
                 >
                    <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center text-slate-300 mb-6 border border-slate-800 group-hover:border-slate-700 group-hover:text-white transition-colors">
                       <Lock className="w-6 h-6" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">Instant NDA</h3>
                    <p className="text-slate-400 leading-relaxed mb-8 flex-1 text-sm">
                      Need to talk business safely? Generate a binding non-disclosure agreement in 30 seconds.
                    </p>
                    
                    <Link href="/dashboard/new?type=NDA" className="mt-auto">
                       <Button variant="ghost" className="w-full bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800 hover:border-slate-700 justify-between group-hover:pl-6 transition-all duration-300 h-11 rounded-lg">
                          Draft NDA <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </Button>
                    </Link>
                 </motion.div>
                 
                 {/* Card 3: Freelance Deal */}
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
                 >
                    <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center text-slate-300 mb-6 border border-slate-800 group-hover:border-slate-700 group-hover:text-white transition-colors">
                       <DollarSign className="w-6 h-6" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">Freelance Deal</h3>
                    <p className="text-slate-400 leading-relaxed mb-8 flex-1 text-sm">
                      Lock in deposits, deliverables, and deadlines before you start working. Simple.
                    </p>
                    
                    <Link href="/dashboard/new?type=DEAL" className="mt-auto">
                       <Button variant="ghost" className="w-full bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800 hover:border-slate-700 justify-between group-hover:pl-6 transition-all duration-300 h-11 rounded-lg">
                          Start Deal <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </Button>
                    </Link>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* 5. Pricing - Simple Pricing */}
        <PricingSection />

        {/* 6. Trust Signals - New "Iron-Clad" Section */}
        <section className="py-16 bg-slate-100 border-t border-slate-200">
           <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                 <div className="flex items-center space-x-3">
                    <Lock className="w-6 h-6" />
                    <span className="font-bold text-slate-900 text-lg">AES-256 Security</span>
                 </div>
                 <div className="flex items-center space-x-3">
                    <Scale className="w-6 h-6" />
                    <span className="font-bold text-slate-900 text-lg">Legally Binding</span>
                 </div>
                 <div className="flex items-center space-x-3">
                    <FileCheck className="w-6 h-6" />
                    <span className="font-bold text-slate-900 text-lg">Digital Audit Trail</span>
                 </div>
              </div>
              <p className="text-center text-slate-400 text-sm mt-8">
                 Secure. Encrypted. Compliant.
              </p>
           </div>
        </section>

        {/* Massive CTA */}
        <section className="py-32 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden">
           <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]"
              >
                Professionalize your <br/> business today.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-2xl text-slate-500 mb-12 max-w-2xl mx-auto font-light"
              >
                Join thousands of designers, developers, and consultants who use InstaPact.
              </motion.p>
              <Link href="/dashboard">
                 <motion.div
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                    <Button size="lg" className="h-16 px-10 text-xl rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl shadow-indigo-200">
                      Get Started for Free <ArrowRight className="ml-3 w-6 h-6" />
                    </Button>
                 </motion.div>
              </Link>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
