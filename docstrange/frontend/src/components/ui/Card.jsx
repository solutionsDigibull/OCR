import { cn } from '@/lib/utils'

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#111] shadow-xs',
        hover && 'transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-[#2a2a2a] cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('px-6 pt-6 pb-0', className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'px-6 pb-6 pt-0 flex items-center gap-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn('text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn('text-sm text-gray-500 dark:text-gray-400 mt-1', className)} {...props}>
      {children}
    </p>
  )
}
