import { useQuery } from '@tanstack/react-query'
import { fetchHomeSummary } from '../api/home'

// 쿼리 키
export const HOME_QUERY_KEYS = {
  summary: ['home', 'summary'] as const,
}

// 메인 페이지 데이터를 받아오는 React Query 훅
export function useHomeSummary() {
  return useQuery({
    queryKey: HOME_QUERY_KEYS.summary,
    queryFn: fetchHomeSummary,
  })
}
