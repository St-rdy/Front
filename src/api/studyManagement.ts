import apiClient from './client'
import type {
  ScheduleItem,
  GoalItem,
  StudyStats,
} from '../pages/StudyManagement/studyManagement.types'

export async function fetchSchedules(date: string): Promise<ScheduleItem[]> {
  const { data } = await apiClient.get<ScheduleItem[]>('/study/schedules', {
    params: { date },
  })
  return data
}

export async function addSchedule(
  payload: Omit<ScheduleItem, 'id'>
): Promise<ScheduleItem> {
  const { data } = await apiClient.post<ScheduleItem>(
    '/study/schedules',
    payload
  )
  return data
}

export async function deleteSchedule(id: number): Promise<void> {
  await apiClient.delete(`/study/schedules/${id}`)
}

export async function fetchGoals(): Promise<GoalItem[]> {
  const { data } = await apiClient.get<GoalItem[]>('/study/goals')
  return data
}

export async function addGoal(
  payload: Omit<GoalItem, 'id' | 'currentMinutes'>
): Promise<GoalItem> {
  const { data } = await apiClient.post<GoalItem>('/study/goals', {
    ...payload,
    currentMinutes: 0,
  })
  return data
}

export async function fetchStats(): Promise<StudyStats> {
  const { data } = await apiClient.get<StudyStats>('/study/stats')
  return data
}
