import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, File, HardDrive, RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { DownloadButtons } from '@/components/results/DownloadButtons'
import { InsightCards } from '@/components/results/InsightCards'
import { TableViewer } from '@/components/results/TableViewer'
import { ErrorState } from '@/components/states/ErrorState'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'
import { Progress } from '@/components/ui/Progress'
import { getResults } from '@/lib/api'
import { formatBytes } from '@/lib/utils'

const POLL_MS = 2500

export default function Results() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const pollRef = useRef(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const poll = async () => {
      try {
        const res = await getResults(id)
        if (cancelled) return

        setData(res)

        if (res.status === 'processing' || res.status === 'uploading') {
          pollRef.current = setTimeout(poll, POLL_MS)
        } else {
          setLoading(false)
        }
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'Failed to load results')
        setLoading(false)
      }
    }

    poll()
    return () => {
      cancelled = true
      if (pollRef.current) clearTimeout(pollRef.current)
    }
  }, [id])

  const isReady      = data?.status === 'completed'
  const isFailed     = data?.status === 'failed'
  const isProcessing = data?.status === 'processing'

  const filename = data?.filename || 'Document'
  const breadcrumbs = ['OCR', 'Results', filename]

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Back + Title */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/dashboard')}>
            Back
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 truncate">
                {filename}
              </h1>
              {isReady && <Badge variant="green" dot>Complete</Badge>}
              {isFailed && <Badge variant="red" dot>Failed</Badge>}
              {isProcessing && <Badge variant="yellow" dot>Processing</Badge>}
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400 dark:text-gray-600">
              {data?.file_size ? (
                <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" />{formatBytes(data.file_size)}</span>
              ) : null}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />Session: {id?.slice(0, 8)}…
              </span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <ErrorState
            title="Could not load results"
            message={error}
            onRetry={() => { setError(null); setLoading(true); window.location.reload() }}
          />
        )}

        {/* Processing progress */}
        {isProcessing && data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/20 px-6 py-5 space-y-3"
          >
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">{data.status_message}</p>
            <Progress value={data.progress ?? 0} variant="blue" size="md" showLabel />
          </motion.div>
        )}

        {/* Failed */}
        {isFailed && data && (
          <ErrorState
            title="Extraction failed"
            message={data.error}
            onRetry={() => navigate('/dashboard')}
          />
        )}

        {/* Skeleton while loading */}
        {(loading || isProcessing) && !isFailed && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-[#1a1a1a] p-6 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
              <Skeleton className="h-3.5 w-3/5" />
            </div>
          </div>
        )}

        {/* Results */}
        {isReady && data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Stat cards */}
            <InsightCards stats={data.stats} />

            {/* Data explorer */}
            <TableViewer data={data.data} />

            {/* Downloads */}
            <DownloadButtons sessionId={id} />
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
