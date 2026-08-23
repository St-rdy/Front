import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchChatRoom, fetchChatRooms, sendChatMessage } from '../api/chat'

export const CHAT_QUERY_KEYS = {
  rooms: ['chat', 'rooms'] as const,
  room: (id: number | undefined) => ['chat', 'rooms', id] as const,
}

export function useChatRooms() {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.rooms,
    queryFn: fetchChatRooms,
  })
}

export function useChatRoom(id: number | undefined) {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.room(id),
    queryFn: () => fetchChatRoom(id!),
    enabled: id !== undefined,
  })
}

export function useSendChatMessage(roomId: number | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => sendChatMessage(roomId!, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.room(roomId) })
      qc.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.rooms })
    },
  })
}
