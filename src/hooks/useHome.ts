import { useQuery } from '@tanstack/react-query'
import { fetchHomeSummary } from '../api/home'

export const HOME_QUERY_KEYS = {
  summary: ['home', 'summary'] as const,
}

export function useHomeSummary() {
  return useQuery({
    queryKey: HOME_QUERY_KEYS.summary,
    queryFn: fetchHomeSummary,
  })
}
