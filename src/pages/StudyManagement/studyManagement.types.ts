export interface ScheduleItem {
  id: number
  subject: string // "영어 공부"
  date: string // "2025-12-28"
  time: string // "09:00"
}

export interface GoalItem {
  id: number
  title: string
  startDate: string // "2025-12-01"
  endDate: string // "2025-12-31"
  targetMinutes: number
  currentMinutes: number
}

export interface StudyStats {
  dailyRate: number // 0-100
  weeklyRate: number // 0-100
  streakDays: number
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0')
  const m = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const s = (totalSeconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}
