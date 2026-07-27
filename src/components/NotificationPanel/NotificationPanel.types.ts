export type NotificationType = 'chat' | 'study' | 'system'

export interface Notification {
  id: number
  targetUserId: number
  type: NotificationType
  title: string
  body: string
  url?: string
  is_read: boolean
  created_at: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
}

export interface NotificationListResponse {
  pagination: Pagination
  notifications: Notification[]
  unread_count: number
}

export interface NotificationReadResponse {
  id: number
  is_read: boolean
}

export interface NotificationReadAllResponse {
  updated_count: number
}
