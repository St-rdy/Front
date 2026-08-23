import apiClient from './client'
import type { ApiEnvelope } from './types'
import type {
  CommunityComment,
  CommunityPostDetailResponse,
  CommunityLikeResponse,
} from '../pages/Community/CommunityDetail/CommunityDetail.types'

export async function fetchCommunityPostDetail(
  id: number
): Promise<CommunityPostDetailResponse> {
  const { data } = await apiClient.get<
    ApiEnvelope<CommunityPostDetailResponse>
  >(`/community/posts/${id}`)
  return data.data
}

// 댓글 작성
export async function createComment(
  postId: number,
  content: string
): Promise<CommunityComment> {
  const { data } = await apiClient.post<ApiEnvelope<CommunityComment>>(
    `/community/posts/${postId}/comments`,
    { content }
  )
  return data.data
}

// 좋아요 토글
export async function toggleLike(
  postId: number
): Promise<CommunityLikeResponse> {
  const { data } = await apiClient.post<ApiEnvelope<CommunityLikeResponse>>(
    `/community/posts/${postId}/like`
  )
  return data.data
}
