import { motion } from 'framer-motion'
import { Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react'
import { useState } from 'react'
import { getDownloadUrl } from '@/lib/api'
import { cn } from '@/lib/utils'

const FORMATS = [
  {
    id:      'xlsx',
    label:   'Excel',
    ext:     '.xlsx',
    icon:    FileSpreadsheet,
    desc:    'Multi-sheet workbook',
    color:   'text-green-600 dark:text-green-400',
    bg:      'bg-green-50 dark:bg-green-950/30',
    border:  'border-green-200 dark:border-green-900/30 hover:border-green-400 dark:hover:border-green-600',
  },
  {
    id:      'csv',
    label:   'CSV',
    ext:     '.csv',
    icon:    FileText,
    desc:    'Comma-separated values',
    color:   'text-blue-600 dark:text-blue-400',
    bg:      'bg-blue-50 dark:bg-blue-950/30',
    border:  'border-blue-200 dark:border-blue-900/30 hover:border-blue-400 dark:hover:border-blue-600',
  },
  {
    id:      'json',
    label:   'JSON',
    ext:     '.json',
    icon:    FileJson,
    desc:    'Structured data',
    color:   'text-purple-600 dark:text-purple-400',
    bg:      'bg-purple-50 dark:bg-purple-950/30',
    border:  'border-purple-200 dark:border-purple-900/30 hover:border-purple-400 dark:hover:border-purple-600',
  },
]

export function DownloadButtons({ sessionId }) {
  const [downloading, setDownloading] = useState(null)

  const handleDownload = async (fmt) => {
    if (!sessionId) return
    setDownloading(fmt)
    try {
      const url = getDownloadUrl(sessionId, fmt)
      const a = document.createElement('a')
      a.href = url
      a.click()
      setTimeout(() => setDownloading(null), 1200)
    } catch {
      setDownloading(null)
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">
        Download Extracted Data
      </p>
      <div className="grid grid-cols-3 gap-3">
        {FORMATS.map((fmt, i) => (
          <motion.button
            key={fmt.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleDownload(fmt.id)}
            disabled={downloading === fmt.id}
            className={cn(
              'group flex flex-col items-center gap-2.5 rounded-2xl border bg-white dark:bg-[#111] px-4 py-5 transition-all duration-200',
              'hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              fmt.border,
              downloading === fmt.id && 'opacity-70',
            )}
          >
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', fmt.bg)}>
              {downloading === fmt.id ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <Download className={cn('h-5 w-5', fmt.color)} />
                </motion.div>
              ) : (
                <fmt.icon className={cn('h-5 w-5', fmt.color)} />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{fmt.label}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-0.5">{fmt.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
