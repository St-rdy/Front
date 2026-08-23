import type { HomeSummaryResponse } from '../types/home'
import apiClient from './client'
import type { ApiEnvelope } from './types'

export async function fetchHomeSummary(): Promise<HomeSummaryResponse> {
  const { data } =
    await apiClient.get<ApiEnvelope<HomeSummaryResponse>>('/home/summary')
  return data.data
}
