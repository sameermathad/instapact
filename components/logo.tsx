import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Logo({ 
  showBeta = true, 
  variant = 'default',
  className = ""
}: { 
  showBeta?: boolean; 
  variant?: 'default' | 'inverted';
  className?: string;
}) {
  const textColor = variant === 'inverted' ? 'text-white' : 'text-slate-900';
  
  return (
    <div className={cn("flex items-center space-x-2.5 group select-none", className)}>
      <div className={cn(
        "relative flex items-center justify-center transition-all duration-300 ease-out rounded-lg",
        "group-hover:scale-110 group-hover:-rotate-3",
        variant === 'default' ? "group-hover:shadow-lg group-hover:shadow-slate-200/50" : "shadow-none"
      )}>
        <Image 
          src="/logo/logo.png" 
          alt="InstaPact Logo" 
          width={36} 
          height={36} 
          className="rounded-lg object-contain block"
          priority
        />
      </div>
      <span className={cn("text-2xl font-black tracking-tight", textColor)}>
        Insta<span className="text-indigo-600">Pact</span>
      </span>
      {showBeta && (
        <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] uppercase tracking-wider font-bold bg-indigo-50 text-indigo-600 border-indigo-100 rounded-lg px-2 py-0.5 self-center ml-1">Beta</Badge>
      )}
    </div>
  )
}
