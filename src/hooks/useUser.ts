import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteMyPost,
  fetchBookmarks,
  fetchJoinedStudies,
  fetchMyComments,
  fetchMyPosts,
  fetchUserProfile,
  removeBookmark,
} from '../api/user'

export const USER_QUERY_KEYS = {
  profile: ['user', 'profile'] as const,
  posts: ['user', 'posts'] as const,
  comments: ['user', 'comments'] as const,
  bookmarks: ['user', 'bookmarks'] as const,
  studies: ['user', 'studies'] as const,
}

export function useUserProfile() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.profile,
    queryFn: fetchUserProfile,
  })
}

export function useMyPosts() {
  return useQuery({ queryKey: USER_QUERY_KEYS.posts, queryFn: fetchMyPosts })
}

export function useDeleteMyPost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteMyPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_QUERY_KEYS.posts })
      qc.invalidateQueries({ queryKey: USER_QUERY_KEYS.profile })
    },
  })
}

export function useMyComments() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.comments,
    queryFn: fetchMyComments,
  })
}

export function useBookmarks() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.bookmarks,
    queryFn: fetchBookmarks,
  })
}

export function useRemoveBookmark() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: removeBookmark,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: USER_QUERY_KEYS.bookmarks }),
  })
}

export function useJoinedStudies() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.studies,
    queryFn: fetchJoinedStudies,
  })
}
