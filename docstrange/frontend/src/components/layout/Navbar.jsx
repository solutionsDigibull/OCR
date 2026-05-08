import { motion } from 'framer-motion'
import { Moon, PanelLeft, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

export function Navbar({ onToggleSidebar, breadcrumbs = [] }) {
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-gray-200 dark:border-[#1a1a1a] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl px-4">
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        <PanelLeft className="h-4 w-4" />
      </button>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm min-w-0">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-gray-300 dark:text-gray-700">/</span>}
            <span
              className={cn(
                'truncate max-w-[160px]',
                i === breadcrumbs.length - 1
                  ? 'text-gray-900 dark:text-gray-100 font-medium'
                  : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer',
              )}
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Status badge */}
      <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/30 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        API Connected
      </div>

      {/* Dark mode toggle */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={toggle}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        aria-label="Toggle dark mode"
      >
        <AnimatedIcon isDark={theme === 'dark'} />
      </motion.button>
    </header>
  )
}

function AnimatedIcon({ isDark }) {
  return (
    <motion.div
      key={isDark ? 'moon' : 'sun'}
      initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
      animate={{ rotate: 0, opacity: 1, scale: 1 }}
      exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.2 }}
    >
      {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </motion.div>
  )
}
