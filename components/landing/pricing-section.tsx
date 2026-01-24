"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PricingSection() {
  const [isGlobal, setIsGlobal] = useState(true); // Default to Global (USD)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timeZone === 'Asia/Calcutta' || timeZone === 'Asia/Kolkata') {
        setIsGlobal(false);
      }
    } catch (e) {}
  }, []);

  // Currency Utils
  const currency = isGlobal ? "$" : "₹";
  
  // Pricing Values (Global/Local and Monthly/Annual)
  const isMonthly = billingCycle === 'monthly';
  
  const pricing = {
    payg: isGlobal ? "5.00" : "99",
    standard: isMonthly 
      ? (isGlobal ? "12.00" : "399") 
      : (isGlobal ? "99.00" : "3,999"),
    agency: isMonthly 
      ? (isGlobal ? "29.00" : "999") 
      : (isGlobal ? "249.00" : "9,999"),
  };

  if (!mounted) return null;

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
          
          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-200/50 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200 shadow-inner">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                  isMonthly ? "bg-white text-slate-900 shadow-lg scale-[1.02]" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2",
                  !isMonthly ? "bg-white text-slate-900 shadow-lg scale-[1.02]" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                )}
              >
                Annual
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px] py-0 px-2 font-black">
                  SAVE 20%
                </Badge>
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
           {/* Single Doc */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             whileHover={{ y: -5 }}
             viewport={{ once: true }}
             transition={{ duration: 0.4, delay: 0.1 }}
             className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
           >
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-600">
                  <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Single Doc</h3>
              <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Perfect for one-off agreements.</p>
              
              <div className="flex items-baseline mb-8">
                 <span className="text-4xl font-black text-slate-900">{currency}{pricing.payg}</span>
                 <span className="text-slate-500 font-medium ml-2">/ doc</span>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                 {['1 Clean Document', 'No Watermark', 'Lifetime Access', 'Digital Signature'].map((f) => (
                   <div key={f} className="flex items-center text-sm text-slate-600">
                      <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                      <span>{f}</span>
                   </div>
                 ))}
              </div>

              <Link href="/auth" className="block w-full">
                <Button variant="outline" className="w-full h-14 text-base font-bold border-2 hover:bg-slate-50 rounded-2xl transition-all">
                   Buy Now
                </Button>
              </Link>
           </motion.div>

           {/* Standard */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             whileHover={{ y: -5 }}
             viewport={{ once: true }}
             transition={{ duration: 0.4 }}
             className="bg-slate-900 p-8 rounded-3xl border-2 border-indigo-500 shadow-2xl relative group flex flex-col scale-105 z-10"
           >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg">
                 Most Popular
              </div>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
                  <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
              <p className="text-sm text-indigo-200 mb-6 min-h-[40px]">For regular freelancers & pros.</p>
              
              <div className="flex items-baseline mb-8">
                 <span className="text-4xl font-black text-white">{currency}{pricing.standard}</span>
                 <span className="text-indigo-200 font-medium ml-2">/ {isMonthly ? 'month' : 'year'}</span>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                 <div className="flex items-center text-sm text-white font-medium">
                    <Check className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
                    <span><strong>10 Docs</strong> / month</span>
                 </div>
                 {['Custom Branding', 'Priority Support', 'Audit Trails', 'Revision History'].map(f => (
                    <div key={f} className="flex items-center text-sm text-indigo-100/80">
                      <Check className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                 ))}
              </div>

              <Link href="/auth" className="block w-full">
                <Button className="w-full h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-900/50 rounded-2xl transition-all active:scale-[0.98]">
                   Start Free Trial
                </Button>
              </Link>
           </motion.div>

           {/* Agency */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             whileHover={{ y: -5 }}
             viewport={{ once: true }}
             transition={{ duration: 0.4, delay: 0.2 }}
             className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
           >
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                  <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Agency</h3>
              <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Power users & small teams.</p>
              
              <div className="flex items-baseline mb-8">
                 <span className="text-4xl font-black text-slate-900">{currency}{pricing.agency}</span>
                 <span className="text-slate-500 font-medium ml-2">/ {isMonthly ? 'month' : 'year'}</span>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                 <div className="flex items-center text-sm text-slate-900 font-bold">
                    <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                    <span><strong>Unlimited</strong> Docs</span>
                 </div>
                 {['White Label (Own Domain)', 'API Access', '24/7 Dedicated Support', 'Team Collaboration'].map(f => (
                    <div key={f} className="flex items-center text-sm text-slate-600">
                      <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                 ))}
              </div>

              <Link href="/auth" className="block w-full">
                <Button variant="outline" className="w-full h-14 text-base font-semibold border-indigo-100 text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                   Contact Sales
                </Button>
              </Link>
           </motion.div>
        </div>
        
        <div className="mt-12 text-center">
            <Link href="/auth" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 decoration-2">
                Just started? Create your first agreement for free →
            </Link>
        </div>
      </div>
    </section>
  );
}
