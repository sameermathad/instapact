import { FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function Logo({ showBeta = true }: { showBeta?: boolean }) {
  return (
    <div className="flex items-center space-x-2 group select-none">
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-2 rounded-xl shadow-sm shadow-indigo-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out">
        <FileText className="h-5 w-5" />
      </div>
      <span className="text-2xl font-black tracking-tight text-slate-900">
        Insta<span className="text-indigo-600">Pact</span>
      </span>
      {showBeta && (
        <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] uppercase tracking-wider font-bold bg-indigo-50 text-indigo-600 border-indigo-100 rounded-lg px-2 py-0.5 self-center ml-1">Beta</Badge>
      )}
    </div>
  )
}
