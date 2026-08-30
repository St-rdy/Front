import type { CommunityPost } from '../community.types'

// 커뮤니티 댓글 타입
export interface CommunityComment {
  id: number
  authorName: string
  authorAvatar?: string
  content: string
  date: string
}

// 기존 community post를 가져와서 인터페이스 생성
export interface CommunityPostDetail extends CommunityPost {
  commentList: CommunityComment[]
}

// community post detail 응답 타입
export interface CommunityPostDetailResponse {
  post: CommunityPostDetail
}

// 좋아요 토글 응답
export interface CommunityLikeResponse {
  liked: boolean
  likes: number
}
