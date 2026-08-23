import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useChatRoom, useSendChatMessage } from '../../../hooks/useChat'
import './ChatRoom.css'

export default function ChatRoom() {
  const { id } = useParams<{ id: string }>()
  const roomId = id !== undefined ? Number(id) : undefined
  const navigate = useNavigate()

  const { data, isLoading, isError } = useChatRoom(roomId)
  const sendMessage = useSendChatMessage(roomId)
  const [text, setText] = useState('')

  // 새 메시지가 도착하면 항상 맨 아래를 보여줍니다.
  // scrollIntoView가 없는 환경(jsdom 등)도 있어 존재 여부를 확인합니다.
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ block: 'end' })
  }, [data?.messages.length])

  function handleSend() {
    const content = text.trim()
    if (!content || sendMessage.isPending) return

    sendMessage.mutate(content, {
      onSuccess: () => setText(''),
    })
  }

  return (
    <div className="chatroom-page">
      <div className="chatroom-header">
        <button className="chatroom-header__back" onClick={() => navigate(-1)}>
          <img src="/Header/back_arrow.svg" alt="뒤로" />
        </button>
        <h2 className="chatroom-header__title">{data?.name ?? '채팅방'}</h2>
        <button className="chatroom-header__options" aria-label="채팅방 메뉴">
          <img src="/Card/card_option.svg" alt="옵션" />
        </button>
      </div>

      {isLoading && <p className="chatroom-state">불러오는 중...</p>}
      {isError && (
        <p className="chatroom-state">채팅방을 불러오지 못했습니다.</p>
      )}

      {data && (
        <div className="chatroom-messages">
          {data.messages.map(message => (
            <div
              key={message.id}
              className={`chatroom-message${
                message.isMine ? ' chatroom-message--mine' : ''
              }`}
            >
              {!message.isMine && (
                <div className="chatroom-message__sender">
                  <div className="chatroom-message__avatar" />
                  <span className="chatroom-message__name">
                    {message.senderName}
                  </span>
                </div>
              )}
              <div className="chatroom-message__row">
                <p className="chatroom-message__bubble">{message.content}</p>
                <span className="chatroom-message__time">{message.time}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      <div className="chatroom-input">
        <button className="chatroom-input__add" aria-label="첨부">
          +
        </button>
        <input
          type="text"
          className="chatroom-input__field"
          placeholder="메시지를 입력하세요"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend()
          }}
        />
        <button
          className="chatroom-input__send"
          onClick={handleSend}
          disabled={!text.trim() || sendMessage.isPending}
          aria-label="메시지 전송"
        >
          ➤
        </button>
      </div>
    </div>
  )
}
