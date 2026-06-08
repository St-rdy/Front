import { homeHandlers } from './home'
import { communityHandlers } from './community'
import { communityDetailHandlers } from './communityDetail'
import { studyGroupHandlers } from './studyGroup'

// 모든 핸들러 통합
export const handlers = [
  ...homeHandlers,
  ...communityHandlers,
  ...communityDetailHandlers,
  ...studyGroupHandlers,
]
