import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const NotificationContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertCircle,
  info:    Info,
}

const COLORS = {
  success: 'border-green-500/30 bg-green-50 dark:bg-green-950/40 text-green-900 dark:text-green-100',
  error:   'border-red-500/30 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100',
  warning: 'border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-900 dark:text-yellow-100',
  info:    'border-blue-500/30 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100',
}

const ICON_COLORS = {
  success: 'text-green-500',
  error:   'text-red-500',
  warning: 'text-yellow-500',
  info:    'text-blue-500',
}

function Toast({ id, type = 'info', title, message, onClose }) {
  const Icon = ICONS[type]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'flex items-start gap-3 w-80 rounded-xl border px-4 py-3 shadow-lg glass',
        COLORS[type],
      )}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', ICON_COLORS[type])} />
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold leading-tight">{title}</p>}
        {message && <p className="text-xs opacity-80 mt-0.5 leading-snug">{message}</p>}
      </div>
      <button onClick={() => onClose(id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  )
}

let _counter = 0

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback((type, title, message, duration = 4500) => {
    const id = ++_counter
    setToasts((prev) => [...prev.slice(-4), { id, type, title, message }])
    if (duration > 0) setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  const success = useCallback((title, msg, d) => notify('success', title, msg, d), [notify])
  const error   = useCallback((title, msg, d) => notify('error', title, msg, d), [notify])
  const warning = useCallback((title, msg, d) => notify('warning', title, msg, d), [notify])
  const info    = useCallback((title, msg, d) => notify('info', title, msg, d), [notify])

  return (
    <NotificationContext.Provider value={{ notify, success, error, warning, info, dismiss }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="sync">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <Toast {...t} onClose={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
