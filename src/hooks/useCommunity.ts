import { useQuery } from '@tanstack/react-query'
import { fetchCommunityPosts } from '../api/community'

// 캐싱을 위해 키를 관리하는 객체
// 'community', 'posts' '전체' ... 이렇게 계층적으로 키를 설정하는 이유는
// 나중에 특정 키를 지정해서 캐시를 무효화하기 편하기 때문
// ex) ['community']만 지정하면 커뮤니티에 해당하는 모든 키의 캐시를 무효화할 수 있음
export const COMMUNITY_QUERY_KEYS = {
  posts: (category?: string) =>
    ['community', 'posts', category ?? '전체'] as const,
}

export function useCommunityPosts(category?: string) {
  return useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.posts(category),
    queryFn: () => fetchCommunityPosts(category),
  })
}
