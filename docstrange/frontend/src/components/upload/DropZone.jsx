import { AnimatePresence, motion } from 'framer-motion'
import { FileText, Image, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn, formatBytes } from '@/lib/utils'

const ACCEPTED = '.pdf,.png,.jpg,.jpeg,.tiff,.tif,.bmp,.webp'
const ACCEPTED_SET = new Set(['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/bmp', 'image/webp'])
const MAX_SIZE = 50 * 1024 * 1024 // 50 MB

function fileIsValid(file) {
  if (!ACCEPTED_SET.has(file.type) && !file.name.match(/\.(pdf|png|jpe?g|tiff?|bmp|webp)$/i)) {
    return 'Unsupported file type. Accepted: PDF, PNG, JPG, TIFF, BMP, WebP.'
  }
  if (file.size > MAX_SIZE) {
    return `File too large (${formatBytes(file.size)}). Max size: 50 MB.`
  }
  return null
}

export function DropZone({ onFile, disabled }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileError, setFileError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = useCallback((file) => {
    const err = fileIsValid(file)
    if (err) { setFileError(err); setSelectedFile(null); return }
    setFileError(null)
    setSelectedFile(file)
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setIsDragOver(true) }
  const onDragLeave = () => setIsDragOver(false)

  const onInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const clearFile = () => { setSelectedFile(null); setFileError(null); if (inputRef.current) inputRef.current.value = '' }

  const submit = () => { if (selectedFile) onFile(selectedFile) }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Drop zone */}
      <motion.div
        animate={{
          scale: isDragOver ? 1.02 : 1,
          borderColor: isDragOver ? '#3b82f6' : undefined,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !disabled && !selectedFile && inputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer',
          'min-h-[220px] px-8 py-10',
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
            : selectedFile
            ? 'border-green-400 dark:border-green-700 bg-green-50/50 dark:bg-green-950/10 cursor-default'
            : 'border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#111] hover:border-gray-300 dark:hover:border-[#333] hover:bg-gray-50/50 dark:hover:bg-white/[0.02]',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="sr-only"
          onChange={onInputChange}
          disabled={disabled}
        />

        <AnimatePresence mode="wait">
          {selectedFile ? (
            <SelectedFileView key="selected" file={selectedFile} onClear={clearFile} />
          ) : (
            <EmptyDropView key="empty" isDragOver={isDragOver} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {fileError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-600 dark:text-red-400 text-center"
          >
            {fileError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            <Button
              size="lg"
              variant="primary"
              className="w-full"
              onClick={submit}
              disabled={disabled}
              icon={Upload}
            >
              Extract Data
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EmptyDropView({ isDragOver }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="flex flex-col items-center gap-4 text-center"
    >
      <motion.div
        animate={isDragOver ? { y: -4, scale: 1.05 } : { y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/6"
      >
        <Upload className="h-7 w-7 text-gray-400 dark:text-gray-500" />
      </motion.div>

      <div>
        <p className="font-semibold text-gray-800 dark:text-gray-200">
          {isDragOver ? 'Drop your file here' : 'Drag & drop your document'}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
          or{' '}
          <span className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            browse to upload
          </span>
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-600">
        <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> PDF</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Image className="h-3 w-3" /> PNG / JPG</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Image className="h-3 w-3" /> TIFF</span>
        <span>·</span>
        <span>Max 50 MB</span>
      </div>
    </motion.div>
  )
}

function SelectedFileView({ file, onClear }) {
  const isPdf = file.type === 'application/pdf'
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="flex flex-col items-center gap-3 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-950/40">
        {isPdf
          ? <FileText className="h-7 w-7 text-green-600 dark:text-green-400" />
          : <Image className="h-7 w-7 text-green-600 dark:text-green-400" />
        }
      </div>
      <div>
        <p className="font-semibold text-gray-800 dark:text-gray-200 max-w-xs truncate">{file.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">{formatBytes(file.size)}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onClear() }}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <X className="h-3 w-3" /> Remove
      </button>
    </motion.div>
  )
}
