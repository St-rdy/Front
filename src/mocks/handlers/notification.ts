import { http, HttpResponse } from 'msw'
import type {
  Notification,
  NotificationListResponse,
} from '../../components/NotificationPanel/NotificationPanel.types'

const mockNotifications: Notification[] = [
  {
    id: 1,
    targetUserId: 1,
    type: 'chat',
    title: '새 메시지',
    body: '김철수님이 메시지를 보냈습니다.',
    url: '/chat',
    is_read: false,
    created_at: '2026-07-26T09:00:00',
  },
  {
    id: 2,
    targetUserId: 1,
    type: 'study',
    title: '스터디 시작 알림',
    body: '오늘 저녁 8시 스터디가 곧 시작됩니다.',
    url: '/study',
    is_read: false,
    created_at: '2026-07-26T08:30:00',
  },
  {
    id: 3,
    targetUserId: 1,
    type: 'system',
    title: '공지사항',
    body: '서비스 점검 안내드립니다.',
    is_read: true,
    created_at: '2026-07-25T12:00:00',
  },
]

function buildListResponse(): NotificationListResponse {
  return {
    pagination: { page: 1, limit: 20, total: mockNotifications.length },
    notifications: mockNotifications,
    unread_count: mockNotifications.filter(n => !n.is_read).length,
  }
}

export const notificationHandlers = [
  http.get('/api/v1/notifications', () => {
    return HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '조회 성공',
      data: buildListResponse(),
    })
  }),

  http.patch('/api/v1/notifications/:id/read', ({ params }) => {
    const id = Number(params.id)
    const target = mockNotifications.find(n => n.id === id)
    if (target) target.is_read = true
    return HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '읽음 처리 성공',
      data: { id, is_read: true },
    })
  }),

  http.patch('/api/v1/notifications/read-all', () => {
    let updatedCount = 0
    mockNotifications.forEach(n => {
      if (!n.is_read) {
        n.is_read = true
        updatedCount += 1
      }
    })
    return HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '전체 읽음 처리 성공',
      data: { updated_count: updatedCount },
    })
  }),
]
