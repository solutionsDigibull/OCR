import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30 mb-5">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5">{title}</h3>
      {message && (
        <p className="text-sm text-gray-500 dark:text-gray-500 max-w-sm leading-relaxed mb-6 font-mono">
          {message}
        </p>
      )}
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </motion.div>
  )
}
