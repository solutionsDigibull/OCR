import { motion } from 'framer-motion'
import { FileSearch, Hash, MessageSquare, Table2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

function useCounter(target, duration = 800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!target) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const prog = Math.min((ts - start) / duration, 1)
      setValue(Math.round(prog * target))
      if (prog < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return value
}

const CARDS = [
  {
    key:     'field_count',
    label:   'Document Fields',
    desc:    'Key-value pairs extracted',
    icon:    Hash,
    color:   'text-blue-600 dark:text-blue-400',
    bg:      'bg-blue-50 dark:bg-blue-950/30',
    border:  'border-blue-100 dark:border-blue-900/30',
  },
  {
    key:     'table_count',
    label:   'Tables Found',
    desc:    'Structured data tables',
    icon:    Table2,
    color:   'text-purple-600 dark:text-purple-400',
    bg:      'bg-purple-50 dark:bg-purple-950/30',
    border:  'border-purple-100 dark:border-purple-900/30',
  },
  {
    key:     'note_count',
    label:   'Notes & Annotations',
    desc:    'Free-text observations',
    icon:    MessageSquare,
    color:   'text-green-600 dark:text-green-400',
    bg:      'bg-green-50 dark:bg-green-950/30',
    border:  'border-green-100 dark:border-green-900/30',
  },
]

function InsightCard({ label, desc, icon: Icon, color, bg, border, value, index }) {
  const count = useCounter(value, 600 + index * 100)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        'rounded-2xl border bg-white dark:bg-[#111] p-5 flex items-start gap-4',
        border,
      )}
    >
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl shrink-0', bg)}>
        <Icon className={cn('h-5 w-5', color)} />
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{count}</p>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">{label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">{desc}</p>
      </div>
    </motion.div>
  )
}

export function InsightCards({ stats }) {
  if (!stats) return null
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {CARDS.map((card, i) => (
        <InsightCard key={card.key} {...card} value={stats[card.key] ?? 0} index={i} />
      ))}
    </div>
  )
}
