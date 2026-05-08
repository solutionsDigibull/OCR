import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Hash, MessageSquare, Search, StickyNote, Table2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'fields',  label: 'Fields',  icon: Hash },
  { id: 'tables',  label: 'Tables',  icon: Table2 },
  { id: 'notes',   label: 'Notes',   icon: StickyNote },
]

export function TableViewer({ data }) {
  const [activeTab, setActiveTab] = useState('fields')
  const [search, setSearch] = useState('')
  const [tableIdx, setTableIdx] = useState(0)

  if (!data) return null

  const { key_value_pairs = {}, tables = [], notes = [] } = data

  const filteredFields = useMemo(() => {
    const q = search.toLowerCase()
    return Object.entries(key_value_pairs).filter(
      ([k, v]) => k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q),
    )
  }, [key_value_pairs, search])

  const filteredNotes = useMemo(() => {
    const q = search.toLowerCase()
    return notes.filter((n) => String(n).toLowerCase().includes(q))
  }, [notes, search])

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#111] overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-gray-100 dark:border-[#1a1a1a] px-4 pt-1">
        {TABS.map((tab) => {
          const count = tab.id === 'fields' ? Object.keys(key_value_pairs).length
                      : tab.id === 'tables' ? tables.length
                      : notes.length
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearch('') }}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px',
                activeTab === tab.id
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <Badge variant={activeTab === tab.id ? 'default' : 'outline'} className="text-[10px] px-1.5 py-0">
                {count}
              </Badge>
            </button>
          )
        })}

        {/* Search */}
        <div className="ml-auto flex items-center gap-2 pb-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-40 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-white/5 pl-8 pr-3 text-xs text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-auto max-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'fields' && (
            <FieldsTab key="fields" fields={filteredFields} />
          )}
          {activeTab === 'tables' && (
            <TablesTab key="tables" tables={tables} idx={tableIdx} setIdx={setTableIdx} search={search} />
          )}
          {activeTab === 'notes' && (
            <NotesTab key="notes" notes={filteredNotes} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function FieldsTab({ fields }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {fields.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400 dark:text-gray-600">No fields match your search.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 dark:bg-[#0d0d0d]">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider w-2/5">Field</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-[#1a1a1a]">
            {fields.map(([k, v], i) => (
              <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300 truncate max-w-[180px]">{k}</td>
                <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 font-mono text-xs">{String(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  )
}

function TablesTab({ tables, idx, setIdx, search }) {
  if (tables.length === 0) return (
    <p className="py-12 text-center text-sm text-gray-400 dark:text-gray-600">No tables found in this document.</p>
  )

  const table = tables[idx]
  const headers = table?.headers || []
  const rows = (table?.rows || []).filter((row) =>
    !search || row.some((cell) => String(cell).toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
      {/* Table selector */}
      {tables.length > 1 && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-[#1a1a1a]">
          <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
            className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#2a2a2a] text-gray-500 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[220px]">
            {table?.title || `Table ${idx + 1}`}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-600 ml-auto mr-1">{idx + 1} / {tables.length}</span>
          <button onClick={() => setIdx(Math.min(tables.length - 1, idx + 1))} disabled={idx === tables.length - 1}
            className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#2a2a2a] text-gray-500 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {headers.length > 0 && (
            <thead className="sticky top-0 bg-gray-50 dark:bg-[#0d0d0d]">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-gray-50 dark:divide-[#1a1a1a]">
            {rows.length === 0 ? (
              <tr><td colSpan={Math.max(headers.length, 1)} className="px-4 py-8 text-center text-sm text-gray-400">No rows match your search.</td></tr>
            ) : rows.map((row, i) => (
              <tr key={i} className={cn('hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors', i % 2 === 0 ? '' : 'bg-gray-50/30 dark:bg-white/[0.01]')}>
                {(headers.length ? headers : row).map((_, j) => (
                  <td key={j} className="px-4 py-2.5 text-gray-600 dark:text-gray-400 font-mono text-xs whitespace-nowrap">
                    {String(row[j] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-4 py-2 text-right text-xs text-gray-400 dark:text-gray-600 border-t border-gray-50 dark:border-[#1a1a1a]">
        {rows.length} row{rows.length !== 1 ? 's' : ''}
      </p>
    </motion.div>
  )
}

function NotesTab({ notes }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="p-4 space-y-2"
    >
      {notes.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400 dark:text-gray-600">No notes found in this document.</p>
      ) : notes.map((note, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex gap-3 rounded-xl border border-gray-100 dark:border-[#1a1a1a] bg-gray-50/50 dark:bg-white/[0.02] px-4 py-3"
        >
          <span className="shrink-0 text-xs font-mono text-gray-400 dark:text-gray-600 mt-0.5 w-5">{i + 1}.</span>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{note}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
