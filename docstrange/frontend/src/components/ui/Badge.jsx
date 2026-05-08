import { cn } from '@/lib/utils'

const variants = {
  default:  'bg-gray-100 dark:bg-white/8 text-gray-700 dark:text-gray-300',
  blue:     'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
  green:    'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20',
  yellow:   'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20',
  red:      'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20',
  purple:   'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20',
  outline:  'border border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-400',
}

export function Badge({ children, variant = 'default', className, dot, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className={cn(
          'h-1.5 w-1.5 rounded-full',
          variant === 'green'  && 'bg-green-500',
          variant === 'yellow' && 'bg-yellow-500',
          variant === 'red'    && 'bg-red-500',
          variant === 'blue'   && 'bg-blue-500',
          variant === 'default' && 'bg-gray-500',
        )} />
      )}
      {children}
    </span>
  )
}
