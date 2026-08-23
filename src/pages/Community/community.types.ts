export interface CommunityPost {
  id: number
  title: string
  content: string
  date: string
  authorName: string
  authorAvatar?: string
  comments: number
  likes: number
  category: string
  liked?: boolean
}

export interface CommunityPostsResponse {
  posts: CommunityPost[]
}

// 글 작성 요청 본문 (이미지는 업로드 후 URL 목록으로 전달)
export interface CommunityWriteRequest {
  title: string
  category: string
  content: string
  images?: string[]
}
