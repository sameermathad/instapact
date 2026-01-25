import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="hover:opacity-80 transition-opacity inline-block mb-4">
               <Logo showBeta={false} variant="inverted" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Professional infrastructure for independent creators. Agreements, payments, and peace of mind.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
               <li><Link href="/dashboard/new?type=scope" className="hover:text-white transition-colors">Scope Change</Link></li>
               <li><Link href="/dashboard/new?type=nda" className="hover:text-white transition-colors">Instant NDA</Link></li>
               <li><Link href="/dashboard/new?type=deal" className="hover:text-white transition-colors">Freelance Service Agreement</Link></li>
               <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
               <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
               <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
             </ul>
           </div>
           
           <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <ul className="space-y-3 text-sm">
                 <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                 <li><a href="https://twitter.com/instapact" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter / X</a></li>
                 <li><a href="mailto:support@instapact.in" className="hover:text-white transition-colors">Support Email</a></li>
              </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs">
           <p>&copy; {new Date().getFullYear()} InstaPact. All rights reserved.</p>
           <p className="mt-4 md:mt-0 flex items-center">
              <span className="opacity-70 mr-2">A product of</span>
              <a href="https://vybetech.in/" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-500 tracking-tight lowercase hover:text-indigo-400 transition-colors">vybetech</a>
           </p>
        </div>
      </div>
    </footer>
  );
}
