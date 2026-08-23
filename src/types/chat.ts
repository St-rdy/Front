// 채팅 도메인 타입

export interface ChatRoomSummary {
  id: number
  name: string
  avatar?: string
  lastMessage: string
  // "14:30" 형식 (List 컴포넌트가 오전/오후로 변환합니다)
  timestamp: string
  unreadCount: number
}

export interface ChatMessage {
  id: number
  senderName: string
  senderAvatar?: string
  content: string
  time: string
  isMine: boolean
}

export interface ChatRoomDetail {
  id: number
  name: string
  memberCount: number
  messages: ChatMessage[]
}
