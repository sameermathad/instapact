"use client";

import { HeroWidget } from "@/components/landing/hero-widget";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { PricingSection } from "@/components/landing/pricing-section";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, CheckCircle2, ArrowRight, Lock, Scale, FileCheck, DollarSign, FormIcon, SquarePen, Share2 } from "lucide-react";
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
        <section className="relative pt-16 pb-16 lg:pt-24 lg:pb-24 overflow-hidden">
          {/* Background decoration */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.7 }}
             transition={{ duration: 1.5 }}
             className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-transparent pointer-events-none"
           ></motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              
              {/* Left Column: Copy */}
              <div className="flex-1 text-center lg:text-left space-y-8">
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
                  className="text-5xl sm:text-6xl lg:text-[4rem] font-black tracking-tight text-slate-900 leading-[1.1] mb-6"
                >
                  Agreements <br/>
                  at the speed of <br/>
                  <span className="text-indigo-600 inline-flex">
                    {"chat.".split("").map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.1,
                          delay: 1 + index * 0.1,
                          ease: "easeIn"
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                    <motion.span
                      animate={{ opacity: [1, 1] }}
                      className="ml-0.5"
                    />
                  </span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg sm:text-xl text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light mb-8"
                >
                  The "Calendly for Agreements." Create legally binding micro-agreements in seconds. No logins for clients. Just a link.
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
                    <span className="text-slate-900 font-semibold text-lg">Under 30secs</span>
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
                    <div className="flex flex-col items-center">
                       <div className="font-bold text-slate-900 text-lg">Legally Binding</div>
                       <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">ESIGN, UETA, eIDAS & IT Act 2000</div>
                    </div>
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

         {/* New: Template Showcase Section */}
        <section className="py-24 bg-white overflow-hidden relative border-b border-slate-100">
           <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                 <motion.h2 {...fadeInUp} className="text-indigo-600 font-bold tracking-wide uppercase mb-3 text-sm">Template Library</motion.h2>
                 <motion.h3 {...fadeInUp} className="text-5xl font-black text-slate-900 tracking-tight">Industry-Standard Templates. <br/>Zero Friction.</motion.h3>
                 <motion.p {...fadeInUp} className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto font-light">
                    Professional, simple, and legally sound documents designed for the speed of modern business.
                 </motion.p>
              </div>

              <div className="grid lg:grid-cols-2 gap-16 items-center">
                 <motion.div 
                   initial={{ opacity: 0, x: -30 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   className="space-y-6"
                 >
                   {[
                     { 
                       title: "Scope Change Agreement", 
                       desc: "Project creeping? Send this to lock in extra deliverables as paid work instantly.", 
                       icon: <Zap className="w-5 h-5 text-indigo-600" /> 
                     },
                     { 
                       title: "Mutual Non-Disclosure", 
                       desc: "Simple, balanced NDA for discovery calls and initial partnership discussions.", 
                       icon: <Lock className="w-5 h-5 text-indigo-600" /> 
                     },
                     { 
                       title: "The Simple Deal Memo", 
                       desc: "A simplified client agreement covering fees, deposits, and ownership.", 
                       icon: <DollarSign className="w-5 h-5 text-indigo-600" /> 
                     }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-5 p-7 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
                       <div className="flex-shrink-0 w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                         {item.icon}
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h4>
                         <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                       </div>
                     </div>
                   ))}
                 </motion.div>

                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   className="relative"
                 >
                   <div className="absolute -inset-10 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                   <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                      <div className="relative p-1.5 bg-slate-50/50">
                         <div className="bg-white rounded-xl overflow-hidden shadow-inner border border-slate-200/50">
                           <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600" />
                           <div className="p-10 space-y-8">
                             <div className="flex justify-between items-start">
                               <div className="space-y-3">
                                 <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                                 <div className="h-8 w-64 bg-slate-200 rounded" />
                               </div>
                               <div className="h-8 px-4 bg-emerald-50 border border-emerald-100 rounded-full flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                                  <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Signed & Verified</div>
                               </div>
                             </div>
                             <div className="space-y-4">
                               <div className="h-3.5 w-full bg-slate-50 rounded" />
                               <div className="h-3.5 w-full bg-slate-50 rounded" />
                               <div className="h-3.5 w-full bg-slate-50 rounded" />
                               <div className="h-3.5 w-4/5 bg-slate-50 rounded" />
                             </div>
                             <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
                               <div className="space-y-2">
                                 <div className="h-3 w-20 bg-slate-50 rounded" />
                                 <div className="text-3xl font-signature text-indigo-400 tracking-tighter">Johnathan Ross</div>
                               </div>
                               <div className="h-12 px-6 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest">
                                  PDF Generated
                               </div>
                             </div>
                           </div>
                         </div>
                      </div>
                      
                      {/* Floating Feature Tags */}
                      <div className="absolute top-1/2 -right-4 bg-white shadow-2xl border border-indigo-100 p-4 rounded-xl rotate-3 animate-bounce-slow">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                               <FileCheck className="w-5 h-5" />
                            </div>
                            <div>
                               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Legal Grade</div>
                               <div className="text-sm font-bold text-slate-900">Audit Trail Active</div>
                            </div>
                         </div>
                      </div>
                   </div>
                 </motion.div>
              </div>
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

       


        {/* 2.5 Balanced Testimonials - Professional & Distinct */}
        <section className="py-24 bg-white border-b border-slate-50">
           <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                 <motion.h2 {...fadeInUp} className="text-indigo-600 font-bold tracking-wide uppercase mb-3 text-sm">Community Love</motion.h2>
                 <motion.h3 {...fadeInUp} className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Loved by Independent Builders</motion.h3>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                 {[
                    {
                      text: "I used to spend 2 hours drafting contracts. Now it takes 20 seconds. InstaPact is a literal money printer for my agency.",
                      name: "Sarah Jenkins",
                      role: "Brand Strategist @ Studio A",
                      gradient: "from-indigo-50 to-white",
                      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
                    },
                    {
                      text: "Finally, a tool that doesn't feel like a legacy enterprise software. My clients actually compliment the signing experience.",
                      name: "Davide Rossi",
                      role: "Freelance UI/UX Designer",
                      gradient: "from-purple-50 to-white",
                      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                    },
                    {
                      text: "Scope creep used to kill my margins. Now I just send an InstaPact link mid-call and lock in the extra fees.",
                      name: "Marcus Chen",
                      role: "Full Stack Developer",
                      gradient: "from-blue-50 to-white",
                      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
                    }
                 ].map((t, i) => (
                    <motion.div 
                       key={i}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: i * 0.1 }}
                       className={`p-8 rounded-2xl bg-gradient-to-b ${t.gradient} border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 md:hover:-translate-y-1`}
                    >
                       <div className="flex gap-1 mb-6">
                          {[1,2,3,4,5].map(star => <div key={star} className="w-4 h-4 text-orange-400 fill-orange-400">★</div>)}
                       </div>
                       <p className="text-slate-800 leading-relaxed mb-8 text-lg font-medium">"{t.text}"</p>
                       <div className="flex items-center gap-4 pt-6 border-t border-slate-100/50">
                          <img 
                             src={t.image} 
                             alt={t.name}
                             className="w-12 h-12 rounded-xl object-cover shadow-sm border border-white"
                          />
                          <div>
                             <div className="font-bold text-slate-900 text-base">{t.name}</div>
                             <div className="text-xs text-slate-500 font-bold uppercase tracking-wide opacity-80">{t.role}</div>
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>
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
                       <FormIcon className="w-10 h-10 text-white" />
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
                       <Share2 className="w-10 h-10 text-white" />
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
                       <SquarePen className="w-10 h-10 text-white" />
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
                    
                    <h3 className="text-xl font-bold text-white mb-3">Freelance Service Agreement</h3>
                    <p className="text-slate-400 leading-relaxed mb-8 flex-1 text-sm">
                      Lock in deposits, deliverables, and deadlines before you start working. Simple.
                    </p>
                    
                    <Link href="/dashboard/new?type=DEAL" className="mt-auto">
                       <Button variant="ghost" className="w-full bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800 hover:border-slate-700 justify-between group-hover:pl-6 transition-all duration-300 h-11 rounded-lg">
                          Get Started <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </Button>
                    </Link>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* 5. Pricing - Simple Pricing */}
        <PricingSection />

        {/* 6. Trust Signals Section */}
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
              <p className="text-center text-slate-400 text-sm mt-8 font-medium">
                 Compliant with ESIGN, UETA, eIDAS & IT Act 2000.
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
              <Link href="/auth">
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
