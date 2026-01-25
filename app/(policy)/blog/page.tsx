import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on freelancing, legal agreements, and building a professional agency service.",
};

const posts = [
  {
    title: "Why Scope Creep is the Silent Killer of Agency Profit",
    slug: "scope-creep-agency-profit",
    description: "It starts with 'just one small change.' Learn how a solid agreement can save you thousands in hidden costs.",
    date: "Jan 24, 2026",
    readTime: "5 min read",
    tag: "Profitability"
  },
  {
    title: "The 3 Clauses Every Freelancer Needs in 2026",
    slug: "essential-freelancer-clauses-2026",
    description: "From Intellectual Property to Termination—protect your assets and your time with these essential contract additions.",
    date: "Jan 20, 2026",
    readTime: "4 min read",
    tag: "Legal Tools"
  },
  {
    title: "First Impressions: How Digital Signing Builds Client Trust",
    slug: "digital-signing-client-trust",
    description: "First impressions are final. Moving from messy PDF attachments to a clean signing link increases your professional standing.",
    date: "Jan 12, 2026",
    readTime: "6 min read",
    tag: "Professionalism"
  }
];

export default function BlogPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="space-y-4">
        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-100">The InstaPact Blog</Badge>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Scaling your creative business safely.</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Legal insights, operational tips, and growth strategies for the modern freelancer and agency owner.
        </p>
      </div>

      <div className="grid gap-12 mt-12">
        {posts.map((post, idx) => (
          <Link key={idx} href={`/blog/${post.slug}`} className="group cursor-pointer">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                  <span className="text-indigo-600 uppercase tracking-wider">{post.tag}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                  {post.title}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {post.description}
                </p>
                <div className="pt-2 flex items-center text-indigo-600 font-bold group-hover:gap-2 transition-all">
                  Read Article <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center space-y-6 mt-20">
        <h3 className="text-2xl font-bold text-white">Join 1,000+ business owners</h3>
        <p className="text-slate-400 max-w-md mx-auto">
          Get weekly tips on contract negotiation and scaling your agency directly in your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-4">
          <input 
            type="email" 
            placeholder="Work email address" 
            className="bg-slate-800 border-none rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none flex-grow"
          />
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl h-auto">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}

// Added for the Badge and Button to resolve errors
function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
  return <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block", className)}>{children}</span>;
}

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
