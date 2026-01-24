import { FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function Logo({ 
  showBeta = true, 
  variant = 'default' 
}: { 
  showBeta?: boolean; 
  variant?: 'default' | 'inverted';
}) {
  const textColor = variant === 'inverted' ? 'text-white' : 'text-slate-900';
  
  return (
    <div className="flex items-center space-x-2.5 group select-none">
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-out shadow-sm shadow-indigo-200 rounded-lg"
      >
        <rect width="32" height="32" rx="8" fill="#4F46E5" />
        <path d="M10 10H22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 16H22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 22H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className={`text-2xl font-black tracking-tight ${textColor}`}>
        Insta<span className="text-indigo-600">Pact</span>
      </span>
      {showBeta && (
        <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] uppercase tracking-wider font-bold bg-indigo-50 text-indigo-600 border-indigo-100 rounded-lg px-2 py-0.5 self-center ml-1">Beta</Badge>
      )}
    </div>
  )
}
