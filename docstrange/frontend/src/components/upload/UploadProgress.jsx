import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'

const STAGES = [
  { id: 'uploading',   label: 'Uploading file',          icon: '📤' },
  { id: 'processing',  label: 'Analyzing document',       icon: '🔍' },
  { id: 'completed',   label: 'Extraction complete',     icon: '✅' },
]

function stageIndex(state) {
  if (state === 'uploading')  return 0
  if (state === 'processing') return 1
  if (state === 'completed')  return 2
  return -1
}

export function UploadProgress({ state, uploadProgress, extractionProgress, statusMessage, onReset }) {
  const active = stageIndex(state)
  const isFailed = state === 'failed'
  const progress = state === 'uploading' ? uploadProgress : extractionProgress

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Status card */}
      <div className="rounded-2xl border border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#111] p-8">
        {isFailed ? (
          <FailedState statusMessage={statusMessage} onReset={onReset} />
        ) : (
          <ProcessingState
            state={state}
            progress={progress}
            statusMessage={statusMessage}
            active={active}
          />
        )}
      </div>

      {/* Stage indicators */}
      {!isFailed && (
        <div className="flex items-center gap-0">
          {STAGES.map((stage, i) => {
            const done    = i < active
            const current = i === active
            return (
              <div key={stage.id} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={
                    `flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-500
                    ${done    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : ''}
                    ${current ? 'bg-blue-600 text-white shadow-glow-sm' : ''}
                    ${!done && !current ? 'bg-gray-100 dark:bg-white/8 text-gray-400 dark:text-gray-600' : ''}
                    `
                  }>
                    {done ? '✓' : current ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                      </motion.div>
                    ) : (i + 1)}
                  </div>
                  <span className={`text-xs text-center leading-tight
                    ${current ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-400 dark:text-gray-600'}`
                  }>
                    {stage.label}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <div className={`h-px flex-1 -mt-5 transition-colors duration-500
                    ${done ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-[#1a1a1a]'}`
                  } />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ProcessingState({ state, progress, statusMessage, active }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/30 shrink-0"
        >
          <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </motion.div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {state === 'completed' ? 'Done!' : 'Processing your document'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{statusMessage}</p>
        </div>
      </div>

      <AnimatePresence>
        {state !== 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Progress value={progress} size="md" showLabel variant="blue" />
          </motion.div>
        )}
      </AnimatePresence>

      {state === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium text-sm"
        >
          <CheckCircle2 className="h-4 w-4" />
          Extraction complete — loading results…
        </motion.div>
      )}
    </div>
  )
}

function FailedState({ statusMessage, onReset }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30 shrink-0">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">Extraction failed</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md leading-relaxed">{statusMessage}</p>
        </div>
      </div>
      <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onReset}>
        Try Again
      </Button>
    </motion.div>
  )
}
