import { afterAll, afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { server } from '../mocks/server'

// 테스트 전체 시작 전 MSW 서버 시작
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// 각 테스트 후 핸들러 초기화 (테스트별 오버라이드 방지)
afterEach(() => {
  cleanup()
  server.resetHandlers()
})

// 전체 테스트 종료 후 MSW 서버 닫기
afterAll(() => server.close())
