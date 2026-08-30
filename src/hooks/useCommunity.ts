import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCommunityPost, fetchCommunityPosts } from '../api/community'
import {
  createComment,
  fetchCommunityPostDetail,
  toggleLike,
} from '../api/communityDetail'

// 캐싱을 위해 키를 관리하는 객체
// 'community', 'posts' '전체' ... 이렇게 계층적으로 키를 설정하는 이유는
// 나중에 특정 키를 지정해서 캐시를 무효화하기 편하기 때문
// ex) ['community']만 지정하면 커뮤니티에 해당하는 모든 키의 캐시를 무효화할 수 있음
export const COMMUNITY_QUERY_KEYS = {
  all: ['community'] as const,
  posts: (category?: string, keyword?: string) =>
    ['community', 'posts', category ?? '전체', keyword ?? ''] as const,
  postDetail: (id: number | undefined) =>
    ['community', 'postDetail', id] as const,
}

export function useCommunityPosts(category?: string, keyword?: string) {
  return useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.posts(category, keyword),
    queryFn: () => fetchCommunityPosts(category, keyword),
  })
}

export function useCommunityPostDetail(id: number | undefined) {
  return useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.postDetail(id),
    queryFn: () => fetchCommunityPostDetail(id!),
    enabled: id !== undefined,
  })
}

// 글 작성 → 목록 캐시를 비워 새 글이 바로 보이게 합니다.
export function useCreateCommunityPost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.all }),
  })
}

// 댓글 작성 → 해당 글의 상세를 다시 불러옵니다.
export function useCreateComment(postId: number | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => createComment(postId!, content),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: COMMUNITY_QUERY_KEYS.postDetail(postId),
      }),
  })
}

// 좋아요 토글
export function useToggleLike(postId: number | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => toggleLike(postId!),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: COMMUNITY_QUERY_KEYS.postDetail(postId),
      }),
  })
}
