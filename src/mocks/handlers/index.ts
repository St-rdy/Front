import { homeHandlers } from './home'
import { communityHandlers } from './community'
import { communityDetailHandlers } from './communityDetail'

// 모든 핸들러 통합
export const handlers = [
  ...homeHandlers,
  ...communityHandlers,
  ...communityDetailHandlers,
]
