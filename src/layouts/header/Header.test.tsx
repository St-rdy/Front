import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import Header from './Header'

// 검색 후 어디로 이동했는지 확인하기 위한 프로브
function LocationProbe() {
  const location = useLocation()
  return (
    <div data-testid="location">{`${location.pathname}${location.search}`}</div>
  )
}

function renderHeader(initialEntries: string[] = ['/']) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Header />
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('Header 테스트', () => {
  // 1. 경로에 따른 타이틀
  it('"/studygroup" 경로일 때 "스터디그룹" 타이틀이 출력', () => {
    renderHeader(['/studygroup'])
    expect(screen.getByText('스터디그룹')).toBeInTheDocument()
  })

  it('"/study" 경로일 때 "학습관리" 타이틀이 출력', () => {
    renderHeader(['/study'])
    expect(screen.getByText('학습관리')).toBeInTheDocument()
    expect(screen.queryByText('없음')).not.toBeInTheDocument()
  })

  it.each([
    ['/', 'Stardy'],
    ['/community', '커뮤니티'],
    ['/chat', '채팅'],
    ['/user', '내정보'],
  ])('"%s" 경로일 때 "%s" 타이틀이 출력', (path, title) => {
    renderHeader([path])
    expect(screen.getByText(title)).toBeInTheDocument()
  })
  // 2. 검색 모드 테스트
  it('검색 아이콘 클릭 시 검색창 출력', async () => {
    renderHeader()
    const searchBtn = screen.getByAltText('검색')

    await userEvent.click(searchBtn)
    const input = screen.getByPlaceholderText('검색어를 입력해주세요')
    expect(input).toBeInTheDocument()
  })

  it('검색 모드에서 최근 검색어 영역이 보인다', async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByAltText('검색'))

    expect(screen.getByText('최근 검색어')).toBeInTheDocument()
    expect(screen.getByText('최근 검색 기록이 없어요')).toBeInTheDocument()
  })

  it('검색어를 입력하고 Enter를 누르면 커뮤니티 검색 결과로 이동한다', async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByAltText('검색'))
    await user.type(
      screen.getByPlaceholderText('검색어를 입력해주세요'),
      '공부{Enter}'
    )

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/community?q=%EA%B3%B5%EB%B6%80'
    )
  })

  it('검색한 단어는 최근 검색어로 남는다', async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByAltText('검색'))
    await user.type(
      screen.getByPlaceholderText('검색어를 입력해주세요'),
      '공부{Enter}'
    )

    // 다시 검색창을 열면 방금 검색어가 칩으로 보입니다.
    await user.click(screen.getByAltText('검색'))
    expect(screen.getByRole('button', { name: '공부' })).toBeInTheDocument()
  })
})

describe('Header - 알림', () => {
  it('안읽음 알림이 있으면 alert_on 아이콘이 표시된다', async () => {
    renderHeader()
    expect(await screen.findByAltText('알림있음')).toBeInTheDocument()
  })

  it('안읽음 알림이 없으면 기본 alert 아이콘이 표시된다', async () => {
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
    renderHeader()
    expect(await screen.findByAltText('알림')).toBeInTheDocument()
  })

  it('종 아이콘 클릭 시 알림 패널이 열리고 목록이 보인다', async () => {
    const user = userEvent.setup()
    renderHeader()
    const bellBtn = await screen.findByAltText('알림있음')

    await user.click(bellBtn)

    expect(await screen.findByText('새 메시지')).toBeInTheDocument()
  })

  it('패널이 열린 상태에서 배경을 클릭하면 패널이 닫힌다', async () => {
    const user = userEvent.setup()
    renderHeader()
    const bellBtn = await screen.findByAltText('알림있음')
    await user.click(bellBtn)
    await screen.findByText('새 메시지')

    await user.click(screen.getByTestId('notification-backdrop'))

    expect(screen.queryByText('새 메시지')).not.toBeInTheDocument()
  })

  it('패널에서 모두 읽음 처리하면 종 아이콘이 알림있음에서 알림으로 바뀐다', async () => {
    const user = userEvent.setup()
    renderHeader()
    const bellBtn = await screen.findByAltText('알림있음')
    await user.click(bellBtn)
    await screen.findByText('새 메시지')

    await user.click(screen.getByText('모두 읽음'))

    expect(await screen.findByAltText('알림')).toBeInTheDocument()
    expect(screen.queryByAltText('알림있음')).not.toBeInTheDocument()
  })
})
