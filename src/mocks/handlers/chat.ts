import { http } from 'msw'
import { ok, fail } from '../envelope'
import type { ChatRoomDetail, ChatRoomSummary } from '../../types/chat'

function seedRooms(): ChatRoomSummary[] {
  return [
    {
      id: 1,
      name: '코딩테스트 스터디',
      lastMessage: '내일 오전 9시에 모여서 같이 문제 풀어요!',
      timestamp: '14:30',
      unreadCount: 3,
    },
    {
      id: 2,
      name: 'AI 프로젝트를 만들어보자!',
      lastMessage: '자료 공유드렸습니다. 확인 부탁드려요.',
      timestamp: '11:05',
      unreadCount: 1,
    },
    {
      id: 3,
      name: '영어 회화 스터디',
      lastMessage: '오늘 스터디 인증 완료했습니다 👍',
      timestamp: '09:20',
      unreadCount: 0,
    },
  ]
}

function seedRoomDetails(): Record<number, ChatRoomDetail> {
  return {
    1: {
      id: 1,
      name: '코딩테스트 스터디',
      memberCount: 4,
      messages: [
        {
          id: 1,
          senderName: '태범',
          content: '다들 오늘 문제 푸셨나요?',
          time: '12:21',
          isMine: false,
        },
        {
          id: 2,
          senderName: '태범',
          content: '저는 2번까지 풀었어요. 3번이 좀 어렵네요.',
          time: '12:22',
          isMine: false,
        },
        {
          id: 3,
          senderName: '나',
          content: '3번은 DP로 접근하면 풀려요!',
          time: '12:23',
          isMine: true,
        },
        {
          id: 4,
          senderName: '나',
          content: '내일 오전 9시에 모여서 같이 문제 풀어요!',
          time: '12:25',
          isMine: true,
        },
      ],
    },
    2: {
      id: 2,
      name: 'AI 프로젝트를 만들어보자!',
      memberCount: 2,
      messages: [
        {
          id: 1,
          senderName: '엄박봉',
          content: '자료 공유드렸습니다. 확인 부탁드려요.',
          time: '11:05',
          isMine: false,
        },
      ],
    },
    3: {
      id: 3,
      name: '영어 회화 스터디',
      memberCount: 3,
      messages: [
        {
          id: 1,
          senderName: '김철수',
          content: '오늘 스터디 인증 완료했습니다 👍',
          time: '09:20',
          isMine: false,
        },
      ],
    },
  }
}

let rooms = seedRooms()
let roomDetails = seedRoomDetails()
let nextMessageId = 100

export function resetChatMock(): void {
  rooms = seedRooms()
  roomDetails = seedRoomDetails()
  nextMessageId = 100
}

export const chatHandlers = [
  http.get('/api/v1/chat/rooms', () => ok(rooms)),

  http.get('/api/v1/chat/rooms/:id', ({ params }) => {
    const detail = roomDetails[Number(params.id)]
    if (!detail) {
      return fail(404, 'ROOM_NOT_FOUND', '채팅방을 찾을 수 없습니다.')
    }
    // 방에 들어가면 읽지 않은 메시지 수를 0으로 만듭니다.
    const summary = rooms.find(r => r.id === detail.id)
    if (summary) summary.unreadCount = 0

    return ok(detail)
  }),

  http.post('/api/v1/chat/rooms/:id/messages', async ({ params, request }) => {
    const roomId = Number(params.id)
    const detail = roomDetails[roomId]
    if (!detail) {
      return fail(404, 'ROOM_NOT_FOUND', '채팅방을 찾을 수 없습니다.')
    }

    const body = (await request.json()) as { content?: string }
    if (!body?.content?.trim()) {
      return fail(400, 'EMPTY_MESSAGE', '메시지를 입력해주세요.')
    }

    const now = new Date()
    const message = {
      id: nextMessageId++,
      senderName: '나',
      content: body.content.trim(),
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      isMine: true,
    }
    detail.messages.push(message)

    // 목록의 마지막 메시지도 갱신합니다.
    const summary = rooms.find(r => r.id === roomId)
    if (summary) {
      summary.lastMessage = message.content
      summary.timestamp = message.time
    }

    return ok(message, { status: 201, code: 'CREATED' })
  }),
]
