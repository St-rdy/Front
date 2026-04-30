import { homeHandlers } from './home'
import { communityHandlers } from './community'

// 모든 핸들러 통합
export const handlers = [...homeHandlers, ...communityHandlers]
