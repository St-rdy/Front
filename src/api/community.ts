import type {
  CommunityPost,
  CommunityPostsResponse,
  CommunityWriteRequest,
} from '../pages/Community/community.types'
import apiClient from './client'
import type { ApiEnvelope } from './types'

// 게시글 목록 조회 (카테고리 필터 + 검색어)
export async function fetchCommunityPosts(
  category?: string,
  keyword?: string
): Promise<CommunityPostsResponse> {
  const params: Record<string, string> = {}
  if (category && category !== '전체') params.category = category
  if (keyword?.trim()) params.q = keyword.trim()

  const { data } = await apiClient.get<ApiEnvelope<CommunityPostsResponse>>(
    '/community/posts',
    { params: Object.keys(params).length > 0 ? params : undefined }
  )
  return data.data
}

// 게시글 작성
export async function createCommunityPost(
  form: CommunityWriteRequest
): Promise<CommunityPost> {
  const { data } = await apiClient.post<ApiEnvelope<CommunityPost>>(
    '/community/posts',
    form
  )
  return data.data
}
