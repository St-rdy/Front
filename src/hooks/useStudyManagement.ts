import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchSchedules,
  addSchedule,
  deleteSchedule,
  fetchGoals,
  addGoal,
  fetchStats,
} from '../api/studyManagement'

export const SM_KEYS = {
  schedulesPrefix: ['study', 'schedules'] as const,
  schedules: (date: string) => ['study', 'schedules', date] as const,
  goals: ['study', 'goals'] as const,
  stats: ['study', 'stats'] as const,
}

export function useSchedules(date: string) {
  return useQuery({
    queryKey: SM_KEYS.schedules(date),
    queryFn: () => fetchSchedules(date),
  })
}

export function useAddSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addSchedule,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: SM_KEYS.schedulesPrefix }),
  })
}

export function useDeleteSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: SM_KEYS.schedulesPrefix }),
  })
}

export function useGoals() {
  return useQuery({
    queryKey: SM_KEYS.goals,
    queryFn: fetchGoals,
  })
}

export function useAddGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addGoal,
    onSuccess: () => qc.invalidateQueries({ queryKey: SM_KEYS.goals }),
  })
}

export function useStudyStats() {
  return useQuery({
    queryKey: SM_KEYS.stats,
    queryFn: fetchStats,
  })
}
