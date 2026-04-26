// 홈 요약 API 응답 타입 (/api/home/summary)

export interface HomeStat {
  percentage: number
  detail: string
}

export interface HomeSchedule {
  id: number
  title: string
  time: string
}

export interface HomeCommunityPost {
  id: number
  title: string
  description: string
  comments: number
  timeAgo: string
}

export interface HomeStudyGroup {
  id: number
  title: string
  description: string
}

export interface HomeSummaryResponse {
  user: {
    name: string
  }
  stats: {
    level: HomeStat
    todayStudy: HomeStat
    weeklyGoal: HomeStat
  }
  schedules: HomeSchedule[]
  popularCommunity: HomeCommunityPost[]
  myStudyGroups: HomeStudyGroup[]
}
