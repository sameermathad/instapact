"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { CheckCircle2, ChevronLeft, Loader2, Sparkles, Shield, Zap, Lock } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();

  const handleAppleAuth = async () => {
     // Apple Auth not yet implemented in firebase.ts, but we can show a placeholder
     toast.info("Apple Sign-In coming soon!");
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    
    setLoading(true);
    try {
      if (isSignUp) {
        if (!name || password.length < 6) {
           toast.error(password.length < 6 ? "Password must be 6+ chars" : "Please enter your name");
           setLoading(false);
           return;
        }
        const { isNew } = await signUpWithEmail(email, password, name);
        toast.success("Account created successfully!");
        if (isNew) {
          router.push("/onboarding");
          return;
        }
      } else {
        await signInWithEmail(email, password);
        toast.success("Welcome back!");
      }
      router.push(new URLSearchParams(window.location.search).get('from') === 'hero' ? "/dashboard/new?from=hero" : "/dashboard");
    } catch (error: any) {
      console.error(error);
      const msg = error.code === 'auth/user-not-found' ? "Account not found. Please sign up." : 
                  error.code === 'auth/wrong-password' ? "Invalid password" : 
                  "Authentication failed. Please check your credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { isNew } = await signInWithGoogle();
      toast.success("Signed in with Google!");
      
      const params = new URLSearchParams(window.location.search);
      if (isNew) {
          router.push("/onboarding");
      } else if (params.get('from') === 'hero') {
          router.push("/dashboard/new?from=hero");
      } else {
          router.push("/dashboard");
      }
    } catch (error) {
       toast.error("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  const handleTesterLogin = () => {
    setEmail("tester@vybetech.in");
    setPassword("tester123");
    setIsSignUp(false);
    toast.info("Tester credentials pre-filled. Click Continue to login.");
  }

  return (
    <div className="min-h-screen bg-white relative flex items-center justify-center p-4 overflow-hidden">
      {/* Brand Decorative Blurs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-50/60 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] right-[10%] w-[50%] h-[50%] bg-slate-50/80 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[1000px] w-full bg-white rounded-[24px] overflow-hidden shadow-[0_32px_80px_-16px_rgba(79,70,229,0.08)] flex flex-col md:row min-h-[580px] border border-slate-100"
      >
        <div className="flex flex-col md:flex-row w-full min-h-[580px]">
          {/* Left Side: Auth Form */}
          <div className="flex-1 p-6 md:p-12 flex flex-col justify-center relative bg-white">
            <div className="relative z-10 w-full max-w-sm mx-auto">
              <Link href="/" className="inline-flex items-center text-slate-400 hover:text-indigo-600 mb-8 transition-colors group">
                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back to site</span>
              </Link>

              <div className="mb-8">
                <Logo showBeta={false} className="mb-5" />
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                  {isSignUp ? "Create account" : "Sign in"}
                </h1>
              </div>

              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full h-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-sm relative transition-all"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4 absolute left-6" alt="Google" />
                  Continue with Google
                </Button>
                
                <div className="relative flex items-center px-4">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink mx-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Or</span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {isSignUp && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-1.5"
                      >
                        <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</Label>
                        <Input 
                          id="name" 
                          placeholder="Sam Mathad" 
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="h-11 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-indigo-100 transition-all px-4 text-sm"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="user@example.com" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-indigo-100 transition-all px-4 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                      <Label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</Label>
                      {!isSignUp && (
                         <button type="button" className="text-[9px] text-indigo-600 hover:text-indigo-700 font-black uppercase tracking-tighter">Forgot?</button>
                      )}
                    </div>
                    <Input 
                      id="password" 
                      type="password"
                      placeholder="••••••••" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-1 focus:ring-indigo-100 transition-all px-4 text-sm"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] mt-1"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? "Create Account" : "Continue")}
                  </Button>
                </form>
              </div>

              <div className="mt-8 text-center space-y-6">
                <p className="text-xs font-medium text-slate-500">
                  {isSignUp ? "Already a member?" : "New to InstaPact?"} {" "}
                  <button 
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-indigo-600 font-black hover:underline underline-offset-4"
                  >
                    {isSignUp ? "Sign In" : "Get Started"}
                  </button>
                </p>

                <div className="flex flex-col items-center gap-4">
                  <button 
                    type="button"
                    onClick={handleTesterLogin}
                    className="text-[9px] text-slate-400 uppercase tracking-[0.25em] font-black hover:text-slate-900 transition-colors"
                  >
                    Tester portal access
                  </button>
                  <p className="text-[9px] text-slate-400 leading-relaxed max-w-[280px] font-medium uppercase tracking-tight">
                    By joining, you agree to our <Link href="/terms" className="underline hover:text-slate-600">Terms</Link> and <Link href="/privacy" className="underline hover:text-slate-600">Privacy</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Marketing/Pitch */}
          <div className="hidden md:flex flex-1 bg-slate-950 relative overflow-hidden p-16 lg:p-24 flex-col justify-center border-l border-slate-900">
            {/* High-end Light Leaks */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 space-y-16 max-w-[340px] mx-auto">
              <div className="space-y-6">
                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <Sparkles className="w-3 h-3 mr-2" /> Trust Layer
                </div>
                <h2 className="text-4xl font-black text-white leading-[1.05] tracking-tight">
                   Agreements <br/>at the speed <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600 inline-flex">
                    {"of chat.".split("").map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.05,
                          delay: 0.8 + index * 0.05,
                          ease: "easeIn"
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                    <motion.span
                      animate={{ opacity: [1, 1] }}
                      className="ml-1"
                    />
                  </span>
                </h2>
              </div>

              <div className="space-y-10">
                {[
                  { icon: Shield, title: "Legally Binding", text: "Compliant with ESIGN, UETA, eIDAS & IT Act 2000." },
                  { icon: Lock, title: "Audit Trail", text: "Bank-grade activity logging & verification." }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                    className="flex items-start space-x-6"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-lg leading-none tracking-tight">{feature.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{feature.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
