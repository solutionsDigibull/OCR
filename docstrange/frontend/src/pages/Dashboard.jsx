import { AnimatePresence, motion } from 'framer-motion'
import { FileText, MoreHorizontal, Pencil, Sparkles, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { DropZone } from '@/components/upload/DropZone'
import { UploadProgress } from '@/components/upload/UploadProgress'
import { Badge } from '@/components/ui/Badge'
import { useNotification } from '@/context/NotificationContext'
import { useDocumentProcessor } from '@/hooks/useDocumentProcessor'
import { formatBytes } from '@/lib/utils'

export default function Dashboard() {
  const navigate = useNavigate()
  const { success, error } = useNotification()
  const proc = useDocumentProcessor()

  // Navigate to results when complete
  useEffect(() => {
    if (proc.isCompleted && proc.sessionId) {
      // Save to recent
      const recent = JSON.parse(localStorage.getItem('ds-recent') || '[]')
      const entry = {
        id: proc.sessionId,
        filename: proc.result?.filename || 'Document',
        date: new Date().toISOString(),
      }
      const updated = [entry, ...recent.filter((r) => r.id !== proc.sessionId)].slice(0, 10)
      localStorage.setItem('ds-recent', JSON.stringify(updated))

      success('Extraction complete!', `Redirecting to results…`)
      setTimeout(() => navigate(`/results/${proc.sessionId}`), 800)
    }
  }, [proc.isCompleted, proc.sessionId])

  useEffect(() => {
    if (proc.isFailed) {
      error('Extraction failed', proc.error)
    }
  }, [proc.isFailed, proc.error])

  const [recentDocs, setRecentDocs] = useState(() =>
    JSON.parse(localStorage.getItem('ds-recent') || '[]').slice(0, 6)
  )
  const [openMenuId, setOpenMenuId] = useState(null)
  const [editingId, setEditingId]   = useState(null)
  const [editName, setEditName]     = useState('')

  useEffect(() => {
    if (!openMenuId) return
    const handler = () => setOpenMenuId(null)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [openMenuId])

  const persistRecent = (updated) => {
    setRecentDocs(updated)
    localStorage.setItem('ds-recent', JSON.stringify(updated))
  }

  const handleDelete = (id) => {
    persistRecent(recentDocs.filter((d) => d.id !== id))
    setOpenMenuId(null)
  }

  const startEdit = (doc) => {
    setEditingId(doc.id)
    setEditName(doc.filename)
    setOpenMenuId(null)
  }

  const confirmEdit = (id) => {
    if (editName.trim()) {
      persistRecent(recentDocs.map((d) => (d.id === id ? { ...d, filename: editName.trim() } : d)))
    }
    setEditingId(null)
  }

  return (
    <Layout breadcrumbs={['OCR', 'Upload']}>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Upload Document
            </h1>
            <Badge variant="blue" dot>Ready</Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload a PDF, image, or technical drawing to extract structured data.
          </p>
        </motion.div>

        {/* Upload / Progress area */}
        <AnimatePresence mode="wait">
          {proc.isBusy || proc.isFailed ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <UploadProgress
                state={proc.state}
                uploadProgress={proc.uploadProgress}
                extractionProgress={proc.extractionProgress}
                statusMessage={proc.statusMessage}
                onReset={proc.reset}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <DropZone onFile={proc.process} disabled={proc.isBusy} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Supported formats hint */}
        {proc.isIdle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20 px-5 py-4"
          >
            <Sparkles className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Smart OCR Engine</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 leading-relaxed">
                Extracts all key-value pairs, tables, dimensions, annotations, and notes from technical drawings, invoices, and any document.
              </p>
            </div>
          </motion.div>
        )}

        {/* Recent Documents */}
        {recentDocs.length > 0 && proc.isIdle && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-3">
              Recent
            </h2>
            <div className="space-y-1.5">
              {recentDocs.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex items-center gap-3 rounded-xl border border-gray-100 dark:border-[#1a1a1a] bg-white dark:bg-[#111] px-4 py-3 hover:border-gray-200 dark:hover:border-[#2a2a2a] hover:shadow-xs transition-all duration-150 group"
                >
                  {/* Clickable area */}
                  <div
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    onClick={() => editingId !== doc.id && navigate(`/results/${doc.id}`)}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/6 shrink-0">
                      <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingId === doc.id ? (
                        <input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => confirmEdit(doc.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') confirmEdit(doc.id)
                            if (e.key === 'Escape') setEditingId(null)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-transparent border-b border-gray-400 dark:border-gray-500 outline-none text-sm font-medium text-gray-800 dark:text-gray-200"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{doc.filename}</p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                        {new Date(doc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Three-dot button */}
                  {editingId !== doc.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenuId(openMenuId === doc.id ? null : doc.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/8 transition-all shrink-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  )}

                  {/* Dropdown */}
                  <AnimatePresence>
                    {openMenuId === doc.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.12 }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-2 top-full mt-1 z-50 w-40 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] shadow-lg overflow-hidden py-1"
                      >
                        <button
                          onClick={() => startEdit(doc)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5 text-gray-400" />
                          Rename
                        </button>
                        <div className="border-t border-gray-100 dark:border-[#2a2a2a] my-0.5" />
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
