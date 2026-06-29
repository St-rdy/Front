import { http, HttpResponse } from 'msw'
import type {
  ScheduleItem,
  GoalItem,
  StudyStats,
} from '../../pages/StudyManagement/studyManagement.types'

const schedules: ScheduleItem[] = [
  { id: 1, subject: '영어 공부', date: formatToday(), time: '09:00' },
  { id: 2, subject: '국어 공부', date: formatToday(), time: '12:00' },
  { id: 3, subject: '수학 공부', date: formatToday(), time: '18:00' },
]
let nextScheduleId = 4

const goals: GoalItem[] = [
  {
    id: 1,
    title: '영어 단어 1시간',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    targetMinutes: 60,
    currentMinutes: 45,
  },
  {
    id: 2,
    title: '국어 문제풀기',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    targetMinutes: 90,
    currentMinutes: 30,
  },
]
let nextGoalId = 3

const stats: StudyStats = { dailyRate: 50, weeklyRate: 43, streakDays: 2 }

function formatToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const studyManagementHandlers = [
  http.get('/api/study/schedules', ({ request }) => {
    const url = new URL(request.url)
    const date = url.searchParams.get('date')
    const result = date ? schedules.filter(s => s.date === date) : schedules
    return HttpResponse.json(result)
  }),

  http.post('/api/study/schedules', async ({ request }) => {
    const body = (await request.json()) as Omit<ScheduleItem, 'id'>
    const item: ScheduleItem = { ...body, id: nextScheduleId++ }
    schedules.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  http.delete('/api/study/schedules/:id', ({ params }) => {
    const id = Number(params.id)
    const idx = schedules.findIndex(s => s.id === id)
    if (idx !== -1) schedules.splice(idx, 1)
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/study/goals', () => HttpResponse.json(goals)),

  http.post('/api/study/goals', async ({ request }) => {
    const body = (await request.json()) as Omit<
      GoalItem,
      'id' | 'currentMinutes'
    >
    const item: GoalItem = { ...body, id: nextGoalId++, currentMinutes: 0 }
    goals.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  http.get('/api/study/stats', () => HttpResponse.json(stats)),
]
