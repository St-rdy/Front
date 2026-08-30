import apiClient from './client'
import type { ApiEnvelope } from './types'
import type {
  ChatMessage,
  ChatRoomDetail,
  ChatRoomSummary,
} from '../types/chat'

export async function fetchChatRooms(): Promise<ChatRoomSummary[]> {
  const { data } =
    await apiClient.get<ApiEnvelope<ChatRoomSummary[]>>('/chat/rooms')
  return data.data
}

export async function fetchChatRoom(id: number): Promise<ChatRoomDetail> {
  const { data } = await apiClient.get<ApiEnvelope<ChatRoomDetail>>(
    `/chat/rooms/${id}`
  )
  return data.data
}

export async function sendChatMessage(
  roomId: number,
  content: string
): Promise<ChatMessage> {
  const { data } = await apiClient.post<ApiEnvelope<ChatMessage>>(
    `/chat/rooms/${roomId}/messages`,
    { content }
  )
  return data.data
}
