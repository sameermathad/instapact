import { CheckCircle2, ShieldCheck } from "lucide-react";

export function PhoneMockup() {
  return (
    <div className="relative mx-auto border-slate-900 bg-slate-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
      <div className="w-[148px] h-[18px] bg-slate-900 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
      <div className="h-[32px] w-[3px] bg-slate-900 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-slate-900 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-slate-900 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
      <div className="h-[64px] w-[3px] bg-slate-900 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
      <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-slate-800">
        {/* Screen Content */}
        <div className="flex flex-col h-full bg-slate-50">
           {/* Header */}
           <div className="bg-white border-b border-slate-200 p-4 pt-10 text-center">
              <span className="font-bold text-slate-900">Insta<span className="text-indigo-600">Pact</span></span>
           </div>
           
           {/* Body */}
           <div className="p-4 flex-1 overflow-y-auto space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">SCOPE CHANGE</span>
                    <span className="text-xs text-slate-400">#4291</span>
                 </div>
                 <h3 className="font-bold text-slate-900 mb-1">Additional Logo Design</h3>
                 <p className="text-xs text-slate-500 mb-3">Add 3 variations of the primary logo in monochrome.</p>
                 <div className="text-lg font-bold text-slate-900 border-t border-slate-100 pt-2">
                    $500.00
                 </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-100">
                 <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Legally Binding Agreement</span>
                 </div>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center space-y-2">
                 <div className="mx-auto w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                 </div>
                 <p className="font-bold text-emerald-800 text-lg">APPROVED</p>
                 <p className="text-xs text-emerald-600">Signed by Client at 10:42 AM</p>
              </div>
           </div>
           
           {/* Bottom Bar */}
           <div className="p-4 bg-white border-t border-slate-200 text-center">
              <div className="w-32 h-1 bg-slate-200 rounded-full mx-auto"></div>
           </div>
        </div>
      </div>
    </div>
  )
}
