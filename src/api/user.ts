import apiClient from './client'
import type { ApiEnvelope } from './types'
import type {
  BookmarkItem,
  JoinedStudy,
  MyComment,
  MyPost,
  UserProfile,
} from '../types/user'

export async function fetchUserProfile(): Promise<UserProfile> {
  const { data } =
    await apiClient.get<ApiEnvelope<UserProfile>>('/users/me/profile')
  return data.data
}

export async function fetchMyPosts(): Promise<MyPost[]> {
  const { data } = await apiClient.get<ApiEnvelope<MyPost[]>>('/users/me/posts')
  return data.data
}

export async function deleteMyPost(id: number): Promise<void> {
  await apiClient.delete(`/users/me/posts/${id}`)
}

export async function fetchMyComments(): Promise<MyComment[]> {
  const { data } =
    await apiClient.get<ApiEnvelope<MyComment[]>>('/users/me/comments')
  return data.data
}

export async function fetchBookmarks(): Promise<BookmarkItem[]> {
  const { data } = await apiClient.get<ApiEnvelope<BookmarkItem[]>>(
    '/users/me/bookmarks'
  )
  return data.data
}

export async function removeBookmark(id: number): Promise<void> {
  await apiClient.delete(`/users/me/bookmarks/${id}`)
}

export async function fetchJoinedStudies(): Promise<JoinedStudy[]> {
  const { data } =
    await apiClient.get<ApiEnvelope<JoinedStudy[]>>('/users/me/studies')
  return data.data
}
