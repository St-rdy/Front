import type { HomeSummaryResponse } from '../types/home'
import apiClient from './client'

export async function fetchHomeSummary(): Promise<HomeSummaryResponse> {
  const { data } = await apiClient.get<HomeSummaryResponse>('/home/summary')
  return data
}
