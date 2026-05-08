import { AnimatePresence, motion } from 'framer-motion'
import { FileText, HelpCircle, Home, MoreHorizontal, Pencil, Settings, Trash2, Upload, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/',          icon: Home,      label: 'Home' },
  { to: '/dashboard', icon: Upload,    label: 'Upload' },
]

const secondary = [
  { to: '#', icon: Settings, label: 'Settings' },
  { to: '#', icon: HelpCircle, label: 'Help' },
]

function NavItem({ to, icon: Icon, label, collapsed }) {
  const location = useLocation()
  const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <NavLink to={to}>
      <motion.div
        whileHover={{ x: 2 }}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-150 select-none',
          isActive
            ? 'bg-gray-100 dark:bg-white/8 text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5',
          collapsed && 'justify-center px-2',
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span>{label}</span>}
        {!collapsed && isActive && (
          <motion.span
            layoutId="active-dot"
            className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500"
          />
        )}
      </motion.div>
    </NavLink>
  )
}

export function Sidebar({ collapsed = false }) {
  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] transition-all duration-300',
        collapsed ? 'w-14' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-2.5 px-4 py-4 border-b border-gray-100 dark:border-[#1a1a1a]', collapsed && 'justify-center px-2')}>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-900 dark:bg-white shrink-0">
          <Zap className="h-4 w-4 text-white dark:text-gray-900" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-gray-900 dark:text-white text-sm tracking-tight overflow-hidden whitespace-nowrap"
            >
              OCR
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {nav.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}

        <div className="my-3 border-t border-gray-100 dark:border-[#1a1a1a]" />

        {!collapsed && (
          <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
            Recent
          </p>
        )}
        <RecentDocs collapsed={collapsed} />
      </nav>

      {/* Footer nav */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-gray-100 dark:border-[#1a1a1a] pt-3">
        {secondary.map((item) => (
          <NavItem key={item.label} {...item} collapsed={collapsed} />
        ))}
      </div>
    </aside>
  )
}

function RecentDocs({ collapsed }) {
  const [docs, setDocs] = useState(() =>
    JSON.parse(localStorage.getItem('ds-recent') || '[]').slice(0, 5)
  )
  const [openMenuId, setOpenMenuId] = useState(null)
  const [editingId, setEditingId]   = useState(null)
  const [editName, setEditName]     = useState('')

  // Close menu on outside click
  useEffect(() => {
    if (!openMenuId) return
    const handler = () => setOpenMenuId(null)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [openMenuId])

  const persist = (updated) => {
    setDocs(updated)
    localStorage.setItem('ds-recent', JSON.stringify(updated))
  }

  const handleDelete = (id) => {
    persist(docs.filter((d) => d.id !== id))
    setOpenMenuId(null)
  }

  const startEdit = (doc) => {
    setEditingId(doc.id)
    setEditName(doc.filename)
    setOpenMenuId(null)
  }

  const confirmEdit = (id) => {
    if (editName.trim()) {
      persist(docs.map((d) => (d.id === id ? { ...d, filename: editName.trim() } : d)))
    }
    setEditingId(null)
  }

  if (docs.length === 0 || collapsed) return null

  return (
    <div className="space-y-0.5">
      {docs.map((item) => (
        <div key={item.id} className="relative group">
          <NavLink
            to={`/results/${item.id}`}
            onClick={(e) => editingId === item.id && e.preventDefault()}
          >
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <FileText className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              {editingId === item.id ? (
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => confirmEdit(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmEdit(item.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  onClick={(e) => e.preventDefault()}
                  className="flex-1 min-w-0 bg-transparent border-b border-gray-400 dark:border-gray-500 outline-none text-gray-700 dark:text-gray-300 text-xs"
                />
              ) : (
                <span className="truncate flex-1">{item.filename}</span>
              )}
            </div>
          </NavLink>

          {/* Three-dot button */}
          {editingId !== item.id && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpenMenuId(openMenuId === item.id ? null : item.id)
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Dropdown */}
          <AnimatePresence>
            {openMenuId === item.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute left-2 top-full mt-1 z-50 w-36 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] shadow-lg overflow-hidden py-1"
              >
                <button
                  onClick={() => startEdit(item)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5 text-gray-400" />
                  Rename
                </button>
                <div className="border-t border-gray-100 dark:border-[#2a2a2a] my-0.5" />
                <button
                  onClick={() => handleDelete(item.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
