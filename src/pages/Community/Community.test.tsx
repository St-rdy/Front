import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import Community from './Community'
import { mockPosts } from '../../mocks/handlers/community'

function renderCommunity() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <Community />
    </QueryClientProvider>
  )
}

// 로딩 상태
describe('Community 페이지 - 로딩 상태', () => {
  it('데이터를 불러오는 동안 로딩 메시지를 보여준다', () => {
    renderCommunity()
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument()
  })
})

// 성공 상태
describe('Community 페이지 - 성공 상태', () => {
  it('API 응답 후 게시글 제목들이 표시된다', async () => {
    renderCommunity()
    expect(
      await screen.findByText(mockPosts.posts[0].title)
    ).toBeInTheDocument()
    expect(screen.getByText(mockPosts.posts[1].title)).toBeInTheDocument()
    expect(screen.getByText(mockPosts.posts[2].title)).toBeInTheDocument()
  })

  it('게시글 작성자 이름이 표시된다', async () => {
    renderCommunity()
    await screen.findByText('공부 루틴을 꾸준히 유지하는 팁 공유해요')
    const authorNames = screen.getAllByText('엄박봉')
    expect(authorNames.length).toBeGreaterThan(0)
  })

  it('게시글 날짜가 표시된다', async () => {
    renderCommunity()
    await screen.findByText('공부 루틴을 꾸준히 유지하는 팁 공유해요')
    const dates = screen.getAllByText('2026.01.07')
    expect(dates.length).toBeGreaterThan(0)
  })

  it('댓글과 좋아요 수가 표시된다', async () => {
    renderCommunity()
    await screen.findByText('공부 루틴을 꾸준히 유지하는 팁 공유해요')
    const counts = screen.getAllByText('123')
    expect(counts.length).toBeGreaterThan(0)
  })

  it('글쓰기(FAB) 버튼이 표시된다', async () => {
    renderCommunity()
    await screen.findByText('공부 루틴을 꾸준히 유지하는 팁 공유해요')
    expect(screen.getByAltText('글쓰기')).toBeInTheDocument()
  })
})

// 에러 상태
describe('Community 페이지 - 에러 상태', () => {
  it('API 실패 시 에러 메시지를 보여준다', async () => {
    server.use(
      http.get('/api/community/posts', () => {
        return HttpResponse.error()
      })
    )

    renderCommunity()

    await waitFor(() => {
      expect(
        screen.getByText('데이터를 불러오지 못했습니다.')
      ).toBeInTheDocument()
    })
  })
})

// 카테고리 필터링
describe('Community 페이지 - 카테고리 필터링', () => {
  it('초기 렌더링 시 "전체" 카테고리가 선택되어 있다', async () => {
    renderCommunity()
    await screen.findByText('공부 루틴을 꾸준히 유지하는 팁 공유해요')
    const allButton = screen.getByText('전체')
    expect(allButton).toHaveClass('filter-bar__item--active')
  })

  it('"취업 준비" 필터 선택 시 해당 카테고리 게시글만 표시된다', async () => {
    const user = userEvent.setup()
    renderCommunity()

    const jobPost = mockPosts.posts.find(p => p.category === '취업 준비')!
    const otherPost = mockPosts.posts.find(p => p.category !== '취업 준비')!

    await screen.findByText(jobPost.title)
    await user.click(screen.getByText('취업 준비'))

    expect(await screen.findByText(jobPost.title)).toBeInTheDocument()
    expect(screen.queryByText(otherPost.title)).not.toBeInTheDocument()
  })

  it('게시글이 없는 카테고리 선택 시 빈 상태 메시지를 보여준다', async () => {
    const user = userEvent.setup()
    renderCommunity()

    await screen.findByText('공부 루틴을 꾸준히 유지하는 팁 공유해요')
    await user.click(screen.getByText('스터디 그룹'))

    expect(await screen.findByText('게시글이 없습니다.')).toBeInTheDocument()
  })
})
