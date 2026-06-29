import apiClient from './client'
import type { CommunityPostDetailResponse } from '../pages/Community/CommunityDetail/CommunityDetail.types'

export async function fetchCommunityPostDetail(
  id: number
): Promise<CommunityPostDetailResponse> {
  const { data } = await apiClient.get<CommunityPostDetailResponse>(
    `/community/post/${id}`
  )
  return data
}
