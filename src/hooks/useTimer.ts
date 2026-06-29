import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'sm_timer'

interface TimerStorage {
  subject: string
  startedAt: string // ISO string
  accumulated: number // 이전 누적 초
}

export interface UseTimerReturn {
  elapsed: number
  isRunning: boolean
  subject: string
  start: (subject: string) => void
  pause: () => void
  reset: () => void
}

export function useTimer(): UseTimerReturn {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [subject, setSubject] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 마운트 시 localStorage 복원
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const stored: TimerStorage = JSON.parse(raw)
    const since = Math.floor(
      (Date.now() - new Date(stored.startedAt).getTime()) / 1000
    )
    setElapsed(stored.accumulated + since)
    setIsRunning(true)
    setSubject(stored.subject)
  }, [])

  // 인터벌 관리
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  function start(sub: string) {
    const storage: TimerStorage = {
      subject: sub,
      startedAt: new Date().toISOString(),
      accumulated: elapsed,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
    setSubject(sub)
    setIsRunning(true)
  }

  function pause() {
    setIsRunning(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  function reset() {
    setIsRunning(false)
    setElapsed(0)
    setSubject('')
    localStorage.removeItem(STORAGE_KEY)
  }

  return { elapsed, isRunning, subject, start, pause, reset }
}
