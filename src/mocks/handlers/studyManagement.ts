import { http } from 'msw'
import { ok } from '../envelope'
import type {
  ScheduleItem,
  GoalItem,
  StudyStats,
} from '../../pages/StudyManagement/studyManagement.types'

function formatToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function seedSchedules(): ScheduleItem[] {
  return [
    { id: 1, subject: '영어 공부', date: formatToday(), time: '09:00' },
    { id: 2, subject: '국어 공부', date: formatToday(), time: '12:00' },
    { id: 3, subject: '수학 공부', date: formatToday(), time: '18:00' },
  ]
}

function seedGoals(): GoalItem[] {
  return [
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
}

let schedules: ScheduleItem[] = seedSchedules()
let nextScheduleId = 4
let goals: GoalItem[] = seedGoals()
let nextGoalId = 3

const stats: StudyStats = { dailyRate: 50, weeklyRate: 43, streakDays: 2 }

// 테스트 간 상태가 새지 않도록 초기화합니다.
export function resetStudyManagementMock(): void {
  schedules = seedSchedules()
  nextScheduleId = 4
  goals = seedGoals()
  nextGoalId = 3
}

export const studyManagementHandlers = [
  http.get('/api/v1/study/schedules', ({ request }) => {
    const date = new URL(request.url).searchParams.get('date')
    const result = date ? schedules.filter(s => s.date === date) : schedules
    return ok(result)
  }),

  http.post('/api/v1/study/schedules', async ({ request }) => {
    const body = (await request.json()) as Omit<ScheduleItem, 'id'>
    const item: ScheduleItem = { ...body, id: nextScheduleId++ }
    schedules.push(item)
    return ok(item, { status: 201, code: 'CREATED' })
  }),

  http.delete('/api/v1/study/schedules/:id', ({ params }) => {
    const id = Number(params.id)
    const idx = schedules.findIndex(s => s.id === id)
    if (idx !== -1) schedules.splice(idx, 1)
    return ok({ success: true })
  }),

  http.get('/api/v1/study/goals', () => ok(goals)),

  http.post('/api/v1/study/goals', async ({ request }) => {
    const body = (await request.json()) as Omit<
      GoalItem,
      'id' | 'currentMinutes'
    >
    const item: GoalItem = { ...body, id: nextGoalId++, currentMinutes: 0 }
    goals.push(item)
    return ok(item, { status: 201, code: 'CREATED' })
  }),

  http.get('/api/v1/study/stats', () => ok(stats)),
]
