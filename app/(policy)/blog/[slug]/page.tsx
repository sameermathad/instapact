import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostContent {
  title: string;
  date: string;
  readTime: string;
  tag: string;
  slug: string;
  description: string;
  content: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
}

const posts: Record<string, PostContent> = {
  "scope-creep-agency-profit": {
    title: "Why Scope Creep is the Silent Killer of Agency Profit",
    slug: "scope-creep-agency-profit",
    description: "It starts with 'just one small change.' Learn how a solid agreement can save you thousands in hidden costs.",
    date: "Jan 24, 2026",
    readTime: "5 min read",
    tag: "Profitability",
    author: {
      name: "Sameer Mathad",
      role: "Founder, InstaPact",
      image: "https://github.com/sameermathad.png"
    },
    content: `
      <p>Every agency owner knows the feeling. You've just finished a project, the client is happy, and then it happens: "Just one more quick thing before we wrap up?"</p>
      
      <p>On the surface, it seems harmless. It's a five-minute tweak, right? But five minutes becomes fifty. Fifty becomes a five-hour rabbit hole. And suddenly, your profitable project is barely breaking even.</p>
      
      <h3>The Cost of "Quick Favors"</h3>
      <p>Scope creep isn't just about extra work; it's about the erosion of boundaries. When you agree to work outside the original scope without a change order or a pre-defined rate for extras, you're telling the client that your time is negotiable.</p>
      
      <p>Over a year, small "favors" can drain 15-20% of an agency's billable capacity. For a boutique agency doing $200k in revenue, that's $40,000 lost to the void.</p>
      
      <h3>How a Digital Agreement Stops the Bleeding</h3>
      <p>A legally binding agreement isn't a wall; it's a map. It defines exactly what is included and, more importantly, what happens when something *isn't* included.</p>
      
      <ul>
        <li><strong>Defined Deliverables:</strong> Be specific. Don't just say "Logo Design." Say "3 Logo Concepts, 2 Rounds of Revisions."</li>
        <li><strong>Change Order Clause:</strong> State clearly that any work outside the scope will be billed at $X/hour or require a new addendum.</li>
        <li><strong>The "Sign-to-Start" Rule:</strong> Never start work without a digitally signed pact. It sets the professional tone from Day 1.</li>
      </ul>
      
      <h3>The InstaPact Advantage</h3>
      <p>Most freelancers skip contracts because they take too long to draft and signatures are a hassle. InstaPact solves this. You can send a scope-defining agreement in 30 seconds. By making the professional step easy, you protect your profit without the friction.</p>
    `
  },
  "essential-freelancer-clauses-2026": {
    title: "The 3 Clauses Every Freelancer Needs in 2026",
    slug: "essential-freelancer-clauses-2026",
    description: "From Intellectual Property to Termination—protect your assets and your time with these essential contract additions.",
    date: "Jan 20, 2026",
    readTime: "4 min read",
    tag: "Legal Tools",
    author: {
      name: "Sameer Mathad",
      role: "Founder, InstaPact",
      image: "https://github.com/sameermathad.png"
    },
    content: `
      <p>In 2026, the freelance economy is faster and more global than ever. But as opportunities grow, so do the risks. Relying on "gentleman's agreements" or handshake deals is a recipe for disaster.</p>
      
      <p>Here are the three heavy-hitting clauses that every modern freelancer must include in their pacts.</p>
      
      <h3>1. Intellectual Property (IP) Transfer</h3>
      <p>A common mistake is assuming the client owns the work once they pay. Legally, it's more complicated. You should include a clause that states IP only transfers <strong>upon full payment</strong>. This gives you massive leverage if a client decides to ghost you after receiving the final files.</p>
      
      <h3>2. The "Kill Fee" (Termination Clause)</h3>
      <p>Projects get cancelled. Directions change. But you shouldn't be left empty-handed. A kill fee ensures that if a client terminates a project mid-way, you are compensated for the work done up to that point—often 50% of the remaining project value.</p>
      
      <h3>3. Limitation of Liability</h3>
      <p>You're a freelancer, not an insurance company. If a bug in your code or a mistake in your design causes a client to lose money, you don't want to be on the hook for their entire business's value. Limit your liability to the total amount of the contract.</p>
      
      <h3>Why Digital Signatures Matter</h3>
      <p>Having these clauses in an email is good, but having them in a signed PDF agreement is ironclad. InstaPact ensures your 2026 contracts are modern, professional, and legally enforceable.</p>
    `
  },
  "digital-signing-client-trust": {
    title: "First Impressions: How Digital Signing Builds Client Trust",
    slug: "digital-signing-client-trust",
    description: "First impressions are final. Moving from messy PDF attachments to a clean signing link increases your professional standing.",
    date: "Jan 12, 2026",
    readTime: "6 min read",
    tag: "Professionalism",
    author: {
      name: "Sameer Mathad",
      role: "Founder, InstaPact",
      image: "https://github.com/sameermathad.png"
    },
    content: `
      <p>When you land a new client, the first few interactions define the entire relationship. You've pitched, they've said yes, and now it's time to make it official.</p>
      
      <p>Compare these two scenarios:</p>
      
      <p><strong>Scenario A:</strong> You email a Word doc. The client has to download it, print it, sign it, scan it, and email it back. It's friction-heavy and feels amateur.</p>
      
      <p><strong>Scenario B:</strong> You send a clean InstaPact link. The client opens it on their phone, reviews the terms, and signs with their finger in 15 seconds. It feels premium, tech-forward, and effortless.</p>
      
      <h3>The Psychology of Authority</h3>
      <p>Clients trust professionals who have systems. By using a dedicated agreement platform, you are signaling that you take your business seriously. This subtle shift in authority makes it easier to request on-time payments and defend your project boundaries later on.</p>
      
      <h3>Friction is the Enemy of Deals</h3>
      <p>Every minute a contract sits unsigned in an inbox is a minute the client has to second-guess their decision. By removing the "print and scan" barrier, you close deals faster. Speed builds momentum.</p>
      
      <h3>Secure, Transparent, Professional</h3>
      <p>InstaPact isn't just about the signature; it's about the experience. From the notifications when they view the document to the automated PDF receipt, every step reinforces that you are the right person for the job.</p>
    `
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts[params.slug];
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Link>

      <div className="space-y-6">
        <div className="space-y-4">
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-100 uppercase tracking-wider text-[10px] px-3 font-bold">
            {post.tag}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-slate-500 pt-2 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2">
              <img src={post.author.image} alt={post.author.name} className="w-8 h-8 rounded-full border border-slate-200" />
              <div>
                <p className="font-bold text-slate-900 leading-none">{post.author.name}</p>
                <p className="text-[10px] mt-0.5">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</div>
            <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</div>
          </div>
        </div>

        <div 
          className="prose prose-slate prose-indigo max-w-none pt-4 
            prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg
            prose-strong:text-slate-900 prose-strong:font-bold
            prose-ul:list-disc prose-li:text-slate-600
            prose-img:rounded-3xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 pt-8 border-t border-slate-100">
          <div className="bg-slate-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-900">Sign your next agreement in seconds.</h3>
              <p className="text-slate-600">The easiest way to professionalize your agency or freelance business.</p>
            </div>
            <Link href="/dashboard">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-14 font-bold shadow-lg shadow-indigo-100">
                Create Free Pact
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
