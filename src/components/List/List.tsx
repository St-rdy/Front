import React from 'react'
import type { ListProps, ChatItem, PostItem } from './List.types'
import './List.css'

// ─── 유틸 ─────────────────────────────────────────────────────

function formatChatTimestamp(timestamp: string): string {
  const match = timestamp.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return timestamp

  const h = parseInt(match[1], 10)
  const m = match[2]
  const period = h < 12 ? '오전' : '오후'
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${period} ${String(display).padStart(2, '0')}:${m}`
}

// ─── Chat 아이템 ──────────────────────────────────────────────

function ChatListItem({
  item,
  onClick,
}: {
  item: ChatItem
  onClick?: (item: ChatItem) => void
}) {
  return (
    <li className="list-item list-item--chat" onClick={() => onClick?.(item)}>
      <div className="list-item__avatar">
        {item.avatar ? (
          <img
            src={item.avatar}
            alt={`${item.name} 아바타`}
            className="list-item__avatar-img"
          />
        ) : (
          <div className="list-item__avatar-fallback" />
        )}
      </div>
      <div className="list-item__content">
        <div className="list-item__row">
          <span className="list-item__name">{item.name}</span>
          <span className="list-item__timestamp">
            {formatChatTimestamp(item.timestamp)}
          </span>
        </div>
        <div className="list-item__row">
          <span className="list-item__last-message">{item.lastMessage}</span>
          {item.unreadCount != null && item.unreadCount > 0 && (
            <span
              className="list-item__unread-badge"
              data-testid="unread-badge"
            >
              {item.unreadCount}
            </span>
          )}
        </div>
      </div>
    </li>
  )
}

// ─── Post 아이템 ──────────────────────────────────────────────

function PostListItem({
  item,
  onClick,
}: {
  item: PostItem
  onClick?: (item: PostItem) => void
}) {
  return (
    <li className="list-item list-item--post" onClick={() => onClick?.(item)}>
      {/* 제목 + 내용 + 썸네일 */}
      <div className="list-item__post-body">
        <div className="list-item__post-text">
          <span className="list-item__title">{item.title}</span>
          <span className="list-item__detail">{item.detail}</span>
        </div>
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt={`${item.title} 썸네일`}
            className="list-item__thumbnail"
          />
        )}
      </div>

      {/* 태그 */}
      {item.tag && item.tag.length > 0 && (
        <div className="list-item__tags">
          {item.tag.map(t => (
            <span key={t} className="list-item__tag">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* 하단: 작성자(좌) + 좋아요·댓글(우) */}
      <div className="list-item__post-footer">
        <div className="list-item__author">
          {item.avatar ? (
            <img
              src={item.avatar}
              alt={`${item.name} 아바타`}
              className="list-item__author-avatar"
            />
          ) : (
            <div className="list-item__author-avatar-fallback" />
          )}
          <span className="list-item__author-name">{item.name}</span>
          <span className="list-item__author-dot">·</span>
          <span className="list-item__timestamp">{item.timestamp}</span>
        </div>
        <div className="list-item__stats">
          {item.likes != null && (
            <span className="list-item__likes">{item.likes}</span>
          )}
          {item.comments != null && (
            <span className="list-item__comments">{item.comments}</span>
          )}
        </div>
      </div>
    </li>
  )
}

// ─── List ─────────────────────────────────────────────────────

export default function List(props: ListProps) {
  const { items, emptyMessage = '목록이 없습니다.', className } = props

  if (items.length === 0) {
    return <p className={`list-empty ${className ?? ''}`}>{emptyMessage}</p>
  }

  if (props.variant === 'chat') {
    return (
      <ul className={`list list--chat ${className ?? ''}`}>
        {props.items.map(item => (
          <ChatListItem key={item.id} item={item} onClick={props.onItemClick} />
        ))}
      </ul>
    )
  }

  return (
    <ul className={`list list--post ${className ?? ''}`}>
      {props.items.map(item => (
        <PostListItem key={item.id} item={item} onClick={props.onItemClick} />
      ))}
    </ul>
  )
}
