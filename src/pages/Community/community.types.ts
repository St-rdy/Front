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
}

export interface CommunityPostsResponse {
  posts: CommunityPost[]
}
