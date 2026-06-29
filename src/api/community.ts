import type { CommunityPostsResponse } from '../pages/Community/community.types'
import apiClient from './client'

export async function fetchCommunityPosts(
  category?: string
): Promise<CommunityPostsResponse> {
  const { data } = await apiClient.get<CommunityPostsResponse>(
    '/community/posts',
    { params: category && category !== '전체' ? { category } : undefined }
  )
  return data
}
