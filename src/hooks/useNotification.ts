import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../api/notification'

export const NOTIFICATION_KEYS = {
  list: ['notifications', 'list'] as const,
}

export function useNotifications() {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list,
    queryFn: fetchNotifications,
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list }),
  })
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list }),
  })
}
