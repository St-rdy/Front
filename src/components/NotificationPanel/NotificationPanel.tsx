import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '../../hooks/useNotification'
import './NotificationPanel.css'

export default function NotificationPanel() {
  const { data, isLoading, isError } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const notifications = data?.notifications ?? []
  const hasUnread = (data?.unread_count ?? 0) > 0

  return (
    <div className="notification-panel">
      <div className="notification-panel__header">
        <span className="notification-panel__title">알림</span>
        <button
          className="notification-panel__read-all"
          onClick={() => markAllRead.mutate()}
          disabled={!hasUnread}
        >
          모두 읽음
        </button>
      </div>

      {isLoading && (
        <p className="notification-panel__status">불러오는 중...</p>
      )}

      {isError && (
        <p className="notification-panel__status">
          데이터를 불러오지 못했습니다.
        </p>
      )}

      {!isLoading && !isError && notifications.length === 0 && (
        <p className="notification-panel__status">알림이 없습니다.</p>
      )}

      {!isLoading && !isError && notifications.length > 0 && (
        <ul className="notification-panel__list">
          {notifications.map(item => (
            <li
              key={item.id}
              className="notification-panel__item"
              onClick={() => {
                if (!item.is_read) markRead.mutate(item.id)
              }}
            >
              {!item.is_read && (
                <span
                  className="notification-panel__unread-dot"
                  data-testid="unread-badge"
                />
              )}
              <div className="notification-panel__content">
                <span className="notification-panel__item-title">
                  {item.title}
                </span>
                <span className="notification-panel__item-body">
                  {item.body}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
