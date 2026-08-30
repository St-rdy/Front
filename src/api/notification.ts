import apiClient from './client'
import type { ApiEnvelope } from './types'
import type {
  NotificationListResponse,
  NotificationReadResponse,
  NotificationReadAllResponse,
} from '../components/NotificationPanel/NotificationPanel.types'

export async function fetchNotifications(): Promise<NotificationListResponse> {
  const { data } =
    await apiClient.get<ApiEnvelope<NotificationListResponse>>('/notifications')
  return data.data
}

export async function markNotificationRead(
  id: number
): Promise<NotificationReadResponse> {
  const { data } = await apiClient.patch<ApiEnvelope<NotificationReadResponse>>(
    `/notifications/${id}/read`
  )
  return data.data
}

export async function markAllNotificationsRead(): Promise<NotificationReadAllResponse> {
  const { data } = await apiClient.patch<
    ApiEnvelope<NotificationReadAllResponse>
  >('/notifications/read-all')
  return data.data
}
