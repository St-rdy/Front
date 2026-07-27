import apiClient from './client'
import type {
  NotificationListResponse,
  NotificationReadResponse,
  NotificationReadAllResponse,
} from '../components/NotificationPanel/NotificationPanel.types'

interface ApiEnvelope<T> {
  status: number
  code: string
  message: string
  data: T
}

export async function fetchNotifications(): Promise<NotificationListResponse> {
  const { data } =
    await apiClient.get<ApiEnvelope<NotificationListResponse>>(
      '/v1/notifications'
    )
  return data.data
}

export async function markNotificationRead(
  id: number
): Promise<NotificationReadResponse> {
  const { data } = await apiClient.patch<ApiEnvelope<NotificationReadResponse>>(
    `/v1/notifications/${id}/read`
  )
  return data.data
}

export async function markAllNotificationsRead(): Promise<NotificationReadAllResponse> {
  const { data } = await apiClient.patch<
    ApiEnvelope<NotificationReadAllResponse>
  >('/v1/notifications/read-all')
  return data.data
}
