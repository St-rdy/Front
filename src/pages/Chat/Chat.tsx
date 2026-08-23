import { useNavigate } from 'react-router-dom'
import List from '../../components/List'
import { useChatRooms } from '../../hooks/useChat'
import type { ChatItem } from '../../components/List/List.types'
import './Chat.css'

export default function Chat() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useChatRooms()

  if (isLoading) {
    return <p className="chat-state">불러오는 중...</p>
  }

  if (isError || !data) {
    return <p className="chat-state">데이터를 불러오지 못했습니다.</p>
  }

  // 채팅방 목록은 공용 List 컴포넌트(chat 변형)로 그립니다.
  const items: ChatItem[] = data.map(room => ({
    id: room.id,
    name: room.name,
    avatar: room.avatar,
    lastMessage: room.lastMessage,
    timestamp: room.timestamp,
    unreadCount: room.unreadCount,
  }))

  return (
    <div className="chat-page">
      <List
        variant="chat"
        items={items}
        emptyMessage="아직 참여 중인 채팅방이 없어요"
        onItemClick={item => navigate(`/chat/${item.id}`)}
      />
    </div>
  )
}
