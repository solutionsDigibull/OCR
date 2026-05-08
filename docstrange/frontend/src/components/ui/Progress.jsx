import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Progress({ value = 0, className, variant = 'blue', showLabel = false, size = 'md' }) {
  const clamp = Math.min(100, Math.max(0, value))

  const trackSizes = { xs: 'h-1', sm: 'h-1.5', md: 'h-2', lg: 'h-3' }
  const barColors  = {
    blue:  'bg-blue-600',
    green: 'bg-green-500',
    gray:  'bg-gray-400',
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{clamp}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden', trackSizes[size])}>
        <motion.div
          className={cn('h-full rounded-full', barColors[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${clamp}%` }}
          transition={{ ease: 'easeOut', duration: 0.4 }}
        />
      </div>
    </div>
  )
}
