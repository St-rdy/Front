// 채팅 리스트를 위한 타입 정의
export interface ChatItem {
  id: string | number // 고유 식별자
  name: string // 사용자 이름
  avatar?: string // 사용자 아바타 URL, 없으면 기본 이미지 사용
  lastMessage: string // 마지막 메세지 내용
  timestamp: string // 마지막 메세지 시간
  unreadCount?: number // 읽지 않은 메세지의 수
}

export interface PostItem {
  id: string | number // 고유 식별자
  name: string // 작성자의 이름
  avatar?: string // 작성자의 아바타 URL, 없으면 기본 이미지 사용
  title: string // 게시글 제목
  detail: string // 게시글 내용 (일부만 제공)
  timestamp: string // 게시글 작성 시간
  thumbnail?: string // 게시글 썸네일 URL, 없으면 이미지를 표시하지 않음
  likes?: number // 좋아요 수
  comments?: number // 댓글 수
  tag?: string[] // 게시글 태그 목록
}

interface BaseListProps {
  className?: string
  emptyMessage?: string
}

export type ChatListProps = BaseListProps & {
  variant: 'chat'
  items: ChatItem[]
  onItemClick?: (item: ChatItem) => void
}

export type PostListProps = BaseListProps & {
  variant: 'post'
  items: PostItem[]
  onItemClick?: (item: PostItem) => void
}

export type ListProps = ChatListProps | PostListProps
