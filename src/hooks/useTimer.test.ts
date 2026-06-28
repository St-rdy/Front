import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTimer } from './useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('초기 상태: isRunning=false, elapsed=0, subject=""', () => {
    const { result } = renderHook(() => useTimer())
    expect(result.current.isRunning).toBe(false)
    expect(result.current.elapsed).toBe(0)
    expect(result.current.subject).toBe('')
  })

  it('start() 호출 시 isRunning=true, subject 설정', () => {
    const { result } = renderHook(() => useTimer())
    act(() => {
      result.current.start('영어 공부')
    })
    expect(result.current.isRunning).toBe(true)
    expect(result.current.subject).toBe('영어 공부')
  })

  it('3초 후 elapsed가 3이 된다', () => {
    const { result } = renderHook(() => useTimer())
    act(() => {
      result.current.start('영어 공부')
    })
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.elapsed).toBe(3)
  })

  it('pause() 호출 시 isRunning=false, elapsed 유지', () => {
    const { result } = renderHook(() => useTimer())
    act(() => {
      result.current.start('영어 공부')
    })
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    act(() => {
      result.current.pause()
    })
    expect(result.current.isRunning).toBe(false)
    expect(result.current.elapsed).toBe(2)
  })

  it('reset() 호출 시 elapsed=0, isRunning=false, subject=""', () => {
    const { result } = renderHook(() => useTimer())
    act(() => {
      result.current.start('영어 공부')
    })
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    act(() => {
      result.current.reset()
    })
    expect(result.current.elapsed).toBe(0)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.subject).toBe('')
  })

  it('start() 시 localStorage에 subject가 저장된다', () => {
    const { result } = renderHook(() => useTimer())
    act(() => {
      result.current.start('수학 공부')
    })
    const stored = JSON.parse(localStorage.getItem('sm_timer') ?? '{}')
    expect(stored.subject).toBe('수학 공부')
    expect(stored.accumulated).toBe(0)
  })

  it('localStorage 항목이 있으면 마운트 시 상태 복원', () => {
    vi.setSystemTime(new Date('2025-12-28T10:00:10Z'))
    localStorage.setItem(
      'sm_timer',
      JSON.stringify({
        subject: '국어 공부',
        startedAt: new Date('2025-12-28T10:00:00Z').toISOString(),
        accumulated: 0,
      })
    )
    const { result } = renderHook(() => useTimer())
    expect(result.current.elapsed).toBeGreaterThanOrEqual(10)
    expect(result.current.isRunning).toBe(true)
    expect(result.current.subject).toBe('국어 공부')
  })

  it('pause() 후 localStorage가 비워진다', () => {
    const { result } = renderHook(() => useTimer())
    act(() => {
      result.current.start('영어')
    })
    act(() => {
      result.current.pause()
    })
    expect(localStorage.getItem('sm_timer')).toBeNull()
  })
})
