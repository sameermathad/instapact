export default function BlogPage() {
  return (
     <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Blog</h1>
        <p className="mt-4 text-slate-600">
          Insights on freelancing, agreements, and growing your agency.
        </p>
      </div>

      <div className="grid gap-8 mt-8">
        <article className="prose prose-slate max-w-none">
          <h3><a href="#"className="no-underline hover:text-indigo-600">Why "Scope Creep" is Silent Killer of Profit</a></h3>
          <p className="text-slate-500 mb-2">January 20, 2026</p>
          <p>
            We've all been there. "Just one small change" becomes five, then ten. 
            Learn how to manage client expectations and get paid for extra work.
          </p>
        </article>

        <article className="prose prose-slate max-w-none">
           <h3><a href="#" className="no-underline hover:text-indigo-600">The 3 Clauses Every Freelance Agreement Needs</a></h3>
           <p className="text-slate-500 mb-2">January 15, 2026</p>
           <p>
             Don't start work without these essential protections. Your future self will thank you.
           </p>
        </article>
      </div>
    </div>
  );
}
