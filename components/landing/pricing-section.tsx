"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap, Shield, Crown, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function PricingSection() {
  const [isGlobal, setIsGlobal] = useState(true); // Default to Global (USD)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simple heuristic: If timezone is Indian Standard Time, show INR.
    // This avoids blocking IP API calls and works instantly.
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timeZone === 'Asia/Calcutta' || timeZone === 'Asia/Kolkata') {
        setIsGlobal(false);
      }
    } catch (e) {
      // Fallback to USD
    }
  }, []);

  // Currency Utils
  const currency = isGlobal ? "$" : "₹";
  
  // Pricing Values
  const paygPrice = isGlobal ? "5.00" : "99";
  const standardPrice = isGlobal ? "12.00" : "399";
  const agencyPrice = isGlobal ? "29.00" : "999";

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-black text-slate-900 mb-6"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-slate-500 mb-8"
          >
            Choose the plan that fits your workflow.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
           {/* Single Doc (Pay As You Go) */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             whileHover={{ y: -5 }}
             viewport={{ once: true }}
             transition={{ duration: 0.4, delay: 0.2 }}
             className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
           >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 text-slate-600">
                  <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Single Doc</h3>
              <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Perfect for one-off agreements.</p>
              
              <div className="flex items-baseline mb-8">
                 <span className="text-4xl font-black text-slate-900">{currency}{paygPrice}</span>
                 <span className="text-slate-500 font-medium ml-2">/ doc</span>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                 <div className="flex items-center text-sm text-slate-600">
                    <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                    <span>1 Clean Document</span>
                 </div>
                 <div className="flex items-center text-sm text-slate-600">
                    <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                    <span>No Watermark</span>
                 </div>
                 <div className="flex items-center text-sm text-slate-600">
                    <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                    <span>Valid for 24 hrs</span>
                 </div>
              </div>

              <Link href="/auth" className="block w-full">
                <Button variant="outline" className="w-full h-12 text-base font-semibold border-2 hover:bg-slate-50 rounded-xl">
                   Buy Credits
                </Button>
              </Link>
           </motion.div>

           {/* Standard (Most Popular) */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             whileHover={{ y: -5 }}
             viewport={{ once: true }}
             transition={{ duration: 0.4, delay: 0.3 }}
             className="bg-slate-900 p-8 rounded-2xl border-2 border-indigo-500 shadow-2xl relative group flex flex-col"
           >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase shadow-lg">
                 Most Popular
              </div>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-400">
                  <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
              <p className="text-sm text-indigo-200 mb-6 min-h-[40px]">For regular freelancers.</p>
              
              <div className="flex items-baseline mb-8">
                 <span className="text-4xl font-black text-white">{currency}{standardPrice}</span>
                 <span className="text-indigo-200 font-medium ml-2">/ month</span>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                 <div className="flex items-center text-sm text-white">
                    <Check className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
                    <span><strong>10 Docs</strong> / month</span>
                 </div>
                 <div className="flex items-center text-sm text-white">
                    <Check className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
                    <span>No Watermark</span>
                 </div>
                  <div className="flex items-center text-sm text-white">
                    <Check className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
                    <span>Standard Branding</span>
                 </div>
              </div>

              <Link href="/auth" className="block w-full">
                <Button className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/50 rounded-xl">
                   Start Free Trial
                </Button>
              </Link>
           </motion.div>

           {/* Agency (Unlimited) */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             whileHover={{ y: -5 }}
             viewport={{ once: true }}
             transition={{ duration: 0.4, delay: 0.4 }}
             className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
           >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                  <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Agency</h3>
              <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Power users & agencies.</p>
              
              <div className="flex items-baseline mb-8">
                 <span className="text-4xl font-black text-slate-900">{currency}{agencyPrice}</span>
                 <span className="text-slate-500 font-medium ml-2">/ month</span>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                 <div className="flex items-center text-sm text-slate-600">
                    <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                    <span><strong>Unlimited</strong> Docs</span>
                 </div>
                 <div className="flex items-center text-sm text-slate-600">
                    <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                    <span>Custom Branding (Your Logo)</span>
                 </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                    <span>Priority Support</span>
                 </div>
              </div>

              <Link href="/auth" className="block w-full">
                <Button variant="outline" className="w-full h-12 text-base font-semibold border-indigo-100 text-indigo-600 hover:bg-indigo-50 rounded-xl">
                   Contact Sales
                </Button>
              </Link>
           </motion.div>
        </div>
        
        <div className="mt-12 text-center">
            <a href="/dashboard/new" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-4">
                Just started? Create your first agreement for free
            </a>
        </div>
      </div>
    </section>
  );
}
