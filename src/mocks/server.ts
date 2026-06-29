import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// 테스트용 MSW 서버 설정
export const server = setupServer(...handlers)
