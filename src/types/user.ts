import type { HomeStat } from './home'

// 내정보 화면 도메인 타입

export interface UserProfile {
  id: number
  name: string
  nickname: string
  avatar?: string
  postCount: number
  followerCount: number
  followingCount: number
  stats: {
    level: HomeStat
    todayStudy: HomeStat
    weeklyGoal: HomeStat
  }
}

export interface MyPost {
  id: number
  title: string
  date: string
  thumbnail?: string
}

export interface MyComment {
  id: number
  postId: number
  content: string
  date: string
  thumbnail?: string
}

export interface BookmarkItem {
  id: number
  postId: number
  title: string
  date: string
  thumbnail?: string
}

export interface JoinedStudy {
  id: number
  title: string
  description: string
  tags: string[]
  memberCount: number
  hostName: string
}
