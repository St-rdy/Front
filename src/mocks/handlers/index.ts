import { authHandlers, resetAuthMock } from './auth'
import { homeHandlers } from './home'
import { communityHandlers } from './community'
import { communityDetailHandlers } from './communityDetail'
import { studyGroupHandlers, resetStudyGroupMock } from './studyGroup'
import {
  studyManagementHandlers,
  resetStudyManagementMock,
} from './studyManagement'
import { notificationHandlers, resetNotificationMock } from './notification'
import { userHandlers, resetUserMock } from './user'
import { chatHandlers, resetChatMock } from './chat'
import { resetCommunityDb } from '../db/community'

// 모든 핸들러 통합
export const handlers = [
  ...authHandlers,
  ...homeHandlers,
  ...communityHandlers,
  ...communityDetailHandlers,
  ...studyGroupHandlers,
  ...studyManagementHandlers,
  ...notificationHandlers,
  ...userHandlers,
  ...chatHandlers,
]

// 목 서버가 들고 있는 모든 상태를 초기화합니다. (테스트 격리용)
export function resetAllMocks(): void {
  resetAuthMock()
  resetCommunityDb()
  resetStudyGroupMock()
  resetStudyManagementMock()
  resetNotificationMock()
  resetUserMock()
  resetChatMock()
}
