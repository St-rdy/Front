import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../../mocks/server'
import CommunityDetail from './CommunityDetail'
import { mockPostDetails } from '../../../mocks/handlers/communityDetail'

// useParams와 useNavigate가 필요하므로 MemoryRouter로 감싸서 라우팅 컨텍스트 제공
function renderCommunityDetail(id = '1') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/community/${id}`]}>
        <Routes>
          <Route path="/community/:id" element={<CommunityDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

const post = mockPostDetails[1].post

// ─── 로딩 상태 ────────────────────────────────────────────────
describe('CommunityDetail 페이지 - 로딩 상태', () => {
  it('데이터를 불러오는 동안 로딩 메시지를 보여준다', () => {
    renderCommunityDetail()
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument()
  })
})

// ─── 성공 상태 ────────────────────────────────────────────────
describe('CommunityDetail 페이지 - 성공 상태', () => {
  it('헤더 타이틀에 게시글 카테고리가 표시된다', async () => {
    renderCommunityDetail()
    expect(await screen.findByText(post.category)).toBeInTheDocument()
  })

  it('뒤로가기 버튼이 표시된다', () => {
    renderCommunityDetail()
    expect(screen.getByAltText('뒤로')).toBeInTheDocument()
  })

  it('게시글 제목이 표시된다', async () => {
    renderCommunityDetail()
    expect(await screen.findByText(post.title)).toBeInTheDocument()
  })

  it('게시글 작성자 이름이 표시된다', async () => {
    renderCommunityDetail()
    await screen.findByText(post.title)
    const names = screen.getAllByText(post.authorName)
    expect(names.length).toBeGreaterThan(0)
  })

  it('좋아요와 댓글 수가 표시된다', async () => {
    renderCommunityDetail()
    await screen.findByText(post.title)
    expect(screen.getByText(String(post.likes))).toBeInTheDocument()
    expect(screen.getByText(String(post.comments))).toBeInTheDocument()
  })

  it('댓글 목록이 모두 표시된다', async () => {
    renderCommunityDetail()
    await screen.findByText(post.title)
    post.commentList.forEach(comment => {
      expect(screen.getByText(comment.content)).toBeInTheDocument()
    })
  })

  it('댓글 입력창이 표시된다', async () => {
    renderCommunityDetail()
    await screen.findByText(post.title)
    expect(screen.getByPlaceholderText('댓글을 작성하세요')).toBeInTheDocument()
  })
})

// ─── 에러 상태 ────────────────────────────────────────────────
describe('CommunityDetail 페이지 - 에러 상태', () => {
  it('API 실패 시 에러 메시지를 보여준다', async () => {
    server.use(
      http.get('/api/v1/community/posts/:id', () => {
        return HttpResponse.error()
      })
    )
    renderCommunityDetail()
    await waitFor(() => {
      expect(
        screen.getByText('데이터를 불러오지 못했습니다.')
      ).toBeInTheDocument()
    })
  })

  it('존재하지 않는 id 조회 시 에러 메시지를 보여준다', async () => {
    renderCommunityDetail('999')
    await waitFor(() => {
      expect(
        screen.getByText('데이터를 불러오지 못했습니다.')
      ).toBeInTheDocument()
    })
  })
})

// ─── 댓글 작성 ────────────────────────────────────────────────
describe('CommunityDetail 페이지 - 댓글 작성', () => {
  it('입력 전에는 등록 버튼이 비활성화된다', async () => {
    renderCommunityDetail()
    await screen.findByText(post.title)
    expect(screen.getByRole('button', { name: '댓글 등록' })).toBeDisabled()
  })

  it('댓글을 등록하면 목록에 추가된다', async () => {
    const user = userEvent.setup()
    renderCommunityDetail()
    await screen.findByText(post.title)

    await user.type(
      screen.getByPlaceholderText('댓글을 작성하세요'),
      '저도 같은 고민이에요'
    )
    await user.click(screen.getByRole('button', { name: '댓글 등록' }))

    expect(await screen.findByText('저도 같은 고민이에요')).toBeInTheDocument()
  })

  it('댓글 등록 후 입력창이 비워진다', async () => {
    const user = userEvent.setup()
    renderCommunityDetail()
    await screen.findByText(post.title)

    const input = screen.getByPlaceholderText('댓글을 작성하세요')
    await user.type(input, '좋은 글이네요{Enter}')

    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('댓글이 없는 글에는 빈 상태 문구가 보인다', async () => {
    renderCommunityDetail('2')
    expect(
      await screen.findByText('아직 댓글이 없어요. 첫 댓글을 남겨보세요!')
    ).toBeInTheDocument()
  })
})

// ─── 좋아요 ──────────────────────────────────────────────────
describe('CommunityDetail 페이지 - 좋아요', () => {
  it('좋아요를 누르면 수가 1 증가한다', async () => {
    const user = userEvent.setup()
    renderCommunityDetail()
    await screen.findByText(post.title)

    await user.click(screen.getByRole('button', { name: '좋아요' }))

    expect(await screen.findByText(String(post.likes + 1))).toBeInTheDocument()
  })

  it('좋아요를 다시 누르면 원래 수로 돌아온다', async () => {
    const user = userEvent.setup()
    renderCommunityDetail()
    await screen.findByText(post.title)

    const likeButton = screen.getByRole('button', { name: '좋아요' })
    await user.click(likeButton)
    await screen.findByText(String(post.likes + 1))

    await user.click(screen.getByRole('button', { name: '좋아요' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '좋아요' })).toHaveAttribute(
        'aria-pressed',
        'false'
      )
    })
  })
})
