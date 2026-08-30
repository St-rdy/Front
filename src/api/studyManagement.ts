import apiClient from './client'
import type { ApiEnvelope } from './types'
import type {
  ScheduleItem,
  GoalItem,
  StudyStats,
} from '../pages/StudyManagement/studyManagement.types'

export async function fetchSchedules(date: string): Promise<ScheduleItem[]> {
  const { data } = await apiClient.get<ApiEnvelope<ScheduleItem[]>>(
    '/study/schedules',
    { params: { date } }
  )
  return data.data
}

export async function addSchedule(
  payload: Omit<ScheduleItem, 'id'>
): Promise<ScheduleItem> {
  const { data } = await apiClient.post<ApiEnvelope<ScheduleItem>>(
    '/study/schedules',
    payload
  )
  return data.data
}

export async function deleteSchedule(id: number): Promise<void> {
  await apiClient.delete(`/study/schedules/${id}`)
}

export async function fetchGoals(): Promise<GoalItem[]> {
  const { data } = await apiClient.get<ApiEnvelope<GoalItem[]>>('/study/goals')
  return data.data
}

export async function addGoal(
  payload: Omit<GoalItem, 'id' | 'currentMinutes'>
): Promise<GoalItem> {
  const { data } = await apiClient.post<ApiEnvelope<GoalItem>>('/study/goals', {
    ...payload,
    currentMinutes: 0,
  })
  return data.data
}

export async function fetchStats(): Promise<StudyStats> {
  const { data } = await apiClient.get<ApiEnvelope<StudyStats>>('/study/stats')
  return data.data
}
