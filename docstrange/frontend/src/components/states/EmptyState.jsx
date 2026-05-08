import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function EmptyState({
  icon: Icon = Upload,
  title = 'No documents yet',
  description = 'Upload your first document to get started.',
  action,
  actionLabel = 'Upload Document',
}) {
  const navigate = useNavigate()
  const handleAction = action || (() => navigate('/dashboard'))

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6"
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/6 mb-5"
      >
        <Icon className="h-7 w-7 text-gray-400 dark:text-gray-500" />
      </motion.div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs leading-relaxed mb-6">{description}</p>
      <Button variant="primary" size="sm" icon={Upload} onClick={handleAction}>
        {actionLabel}
      </Button>
    </motion.div>
  )
}
