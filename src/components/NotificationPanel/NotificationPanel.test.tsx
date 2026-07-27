import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import NotificationPanel from './NotificationPanel'

function renderPanel() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <NotificationPanel />
    </QueryClientProvider>
  )
}

describe('NotificationPanel - 기본 렌더링', () => {
  it('로딩 중에는 안내 문구를 보여준다', () => {
    renderPanel()
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument()
  })

  it('알림 목록의 제목/본문이 렌더링된다', async () => {
    renderPanel()
    expect(await screen.findByText('새 메시지')).toBeInTheDocument()
    expect(
      screen.getByText('김철수님이 메시지를 보냈습니다.')
    ).toBeInTheDocument()
    expect(screen.getByText('스터디 시작 알림')).toBeInTheDocument()
  })

  it('안읽음 알림에는 unread-badge가 표시되고 읽은 알림에는 없다', async () => {
    renderPanel()
    await screen.findByText('새 메시지')
    expect(screen.getAllByTestId('unread-badge')).toHaveLength(2)
  })
})

describe('NotificationPanel - 빈 상태', () => {
  it('알림이 없으면 안내 문구를 보여준다', async () => {
    server.use(
      http.get('/api/v1/notifications', () =>
        HttpResponse.json({
          status: 200,
          code: 'OK',
          message: '조회 성공',
          data: {
            pagination: { page: 1, limit: 20, total: 0 },
            notifications: [],
            unread_count: 0,
          },
        })
      )
    )
    renderPanel()
    expect(await screen.findByText('알림이 없습니다.')).toBeInTheDocument()
  })
})

describe('NotificationPanel - 에러 상태', () => {
  it('조회 실패 시 에러 문구를 보여준다', async () => {
    server.use(http.get('/api/v1/notifications', () => HttpResponse.error()))
    renderPanel()
    expect(
      await screen.findByText('데이터를 불러오지 못했습니다.')
    ).toBeInTheDocument()
  })
})

// 아래 두 describe는 mocks/handlers/notification.ts의 mockNotifications 배열을
// 실제로 변형(mutate)하며, 파일 내에서 순서대로(위→아래) 실행되는 것에 의존한다.
// (studyManagement.ts 핸들러도 동일하게 모듈 레벨 상태를 mutate하는 기존 컨벤션)
describe('NotificationPanel - 단건 읽음 처리', () => {
  it('안읽음 알림을 클릭하면 읽음 처리되어 뱃지가 사라진다', async () => {
    const user = userEvent.setup()
    renderPanel()
    await screen.findByText('새 메시지')
    expect(screen.getAllByTestId('unread-badge')).toHaveLength(2)

    await user.click(screen.getByText('새 메시지'))

    await waitFor(() => {
      expect(screen.getAllByTestId('unread-badge')).toHaveLength(1)
    })
  })
})

describe('NotificationPanel - 전체 읽음 처리', () => {
  it('"모두 읽음" 클릭 시 모든 안읽음 뱃지가 사라진다', async () => {
    const user = userEvent.setup()
    renderPanel()
    await screen.findByText('새 메시지')

    await user.click(screen.getByText('모두 읽음'))

    await waitFor(() => {
      expect(screen.queryAllByTestId('unread-badge')).toHaveLength(0)
    })
  })

  it('안읽음이 없으면 "모두 읽음" 버튼이 비활성화된다', async () => {
    renderPanel()
    await screen.findByText('새 메시지')
    expect(screen.getByText('모두 읽음')).toBeDisabled()
  })
})
