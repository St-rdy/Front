export interface StudyGroup {
  id: number
  title: string
  description: string
  category: string
  mode: 'online' | 'offline'
  tags: string[]
  categoryTags?: string[]
  memberCount: number
  maxMemberCount: number
  thumbnail?: string
  startDate: string
  endDate: string
  location?: string
}

export interface StudyGroupDetail extends StudyGroup {
  hostName: string
  hostAvatar?: string
  goal: string
}

export interface StudyGroupListResponse {
  groups: StudyGroup[]
}

export interface StudyGroupDetailResponse {
  group: StudyGroupDetail
}

export interface StudyGroupCreateForm {
  title: string
  description: string
  category: string
  mode: 'online' | 'offline'
  tags: string[]
  maxMemberCount: number
  startDate: string
  endDate: string
  goal: string
  location?: string
}

export interface StudyGroupApplyForm {
  motivation: string
  contact?: string
}
