import { useCallback, useRef, useState } from 'react'
import { getResults, uploadDocument } from '@/lib/api'
import { sleep } from '@/lib/utils'

const POLL_INTERVAL = 2500

export function useDocumentProcessor() {
  const [state, setState] = useState('idle') // idle | uploading | processing | completed | failed
  const [uploadProgress, setUploadProgress] = useState(0)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const abortRef = useRef(false)

  const reset = useCallback(() => {
    abortRef.current = true
    setState('idle')
    setUploadProgress(0)
    setExtractionProgress(0)
    setStatusMessage('')
    setSessionId(null)
    setResult(null)
    setError(null)
    setTimeout(() => { abortRef.current = false }, 100)
  }, [])

  const process = useCallback(async (file) => {
    abortRef.current = false
    setState('uploading')
    setUploadProgress(0)
    setExtractionProgress(0)
    setStatusMessage('Uploading file…')
    setError(null)
    setResult(null)
    setSessionId(null)

    try {
      const upload = await uploadDocument(file, (p) => {
        setUploadProgress(p)
        setStatusMessage(`Uploading… ${p}%`)
      })

      if (abortRef.current) return

      const sid = upload.id
      setSessionId(sid)
      setState('processing')
      setStatusMessage('Starting extraction…')

      // Poll until done
      while (!abortRef.current) {
        await sleep(POLL_INTERVAL)
        if (abortRef.current) break

        const data = await getResults(sid)

        setExtractionProgress(data.progress ?? 0)
        setStatusMessage(data.status_message || 'Processing…')

        if (data.status === 'completed') {
          setResult(data)
          setState('completed')
          return
        }

        if (data.status === 'failed') {
          throw new Error(data.error || 'Extraction failed')
        }
      }
    } catch (err) {
      if (abortRef.current) return
      setError(err.message || 'Unexpected error')
      setState('failed')
    }
  }, [])

  return {
    state,
    uploadProgress,
    extractionProgress,
    statusMessage,
    sessionId,
    result,
    error,
    process,
    reset,
    isIdle:       state === 'idle',
    isUploading:  state === 'uploading',
    isProcessing: state === 'processing',
    isCompleted:  state === 'completed',
    isFailed:     state === 'failed',
    isBusy:       state === 'uploading' || state === 'processing',
  }
}
