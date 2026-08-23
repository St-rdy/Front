import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderWithProviders } from '../../test/renderWithProviders'
import {
  UserBookmarks,
  UserComments,
  UserPosts,
  UserStudies,
} from './UserCollections'

// 빈 목록 응답을 만드는 헬퍼
function emptyList(path: string) {
  return http.get(path, () =>
    HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '조회 성공',
      data: [],
    })
  )
}

describe('내가 쓴 게시물', () => {
  it('총 개수와 게시물 제목이 표시된다', async () => {
    renderWithProviders(<UserPosts />, { route: '/user/posts' })

    expect(await screen.findByText('총 6개')).toBeInTheDocument()
    expect(
      screen.getByText('공부 루틴을 꾸준히 유지하는 팁 공유해요')
    ).toBeInTheDocument()
  })

  it('옵션을 누르면 삭제 확인 모달이 열린다', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserPosts />, { route: '/user/posts' })
    await screen.findByText('총 6개')

    await user.click(
      screen.getByRole('button', { name: '스터디 인증 4일차 삭제' })
    )

    expect(
      screen.getByText('해당 게시물을 삭제하시겠습니까?')
    ).toBeInTheDocument()
  })

  it('취소를 누르면 모달이 닫히고 게시물이 남는다', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserPosts />, { route: '/user/posts' })
    await screen.findByText('총 6개')

    await user.click(
      screen.getByRole('button', { name: '스터디 인증 4일차 삭제' })
    )
    await user.click(screen.getByRole('button', { name: '취소' }))

    expect(
      screen.queryByText('해당 게시물을 삭제하시겠습니까?')
    ).not.toBeInTheDocument()
    expect(screen.getByText('스터디 인증 4일차')).toBeInTheDocument()
  })

  it('삭제를 확정하면 목록에서 사라지고 총 개수가 줄어든다', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserPosts />, { route: '/user/posts' })
    await screen.findByText('총 6개')

    await user.click(
      screen.getByRole('button', { name: '스터디 인증 4일차 삭제' })
    )
    await user.click(screen.getByRole('button', { name: '삭제' }))

    await waitFor(() => {
      expect(screen.queryByText('스터디 인증 4일차')).not.toBeInTheDocument()
    })
    expect(await screen.findByText('총 5개')).toBeInTheDocument()
  })

  it('게시물이 없으면 빈 상태 문구를 보여준다', async () => {
    server.use(emptyList('/api/v1/users/me/posts'))
    renderWithProviders(<UserPosts />, { route: '/user/posts' })

    expect(await screen.findByText('아직 게시물이 없어요')).toBeInTheDocument()
  })
})

describe('내가 쓴 댓글', () => {
  it('댓글 내용과 총 개수가 표시된다', async () => {
    renderWithProviders(<UserComments />, { route: '/user/comments' })

    expect(await screen.findByText('총 5개')).toBeInTheDocument()
    expect(screen.getByText('안녕하세요 반가워요')).toBeInTheDocument()
  })

  it('댓글이 없으면 빈 상태 문구를 보여준다', async () => {
    server.use(emptyList('/api/v1/users/me/comments'))
    renderWithProviders(<UserComments />, { route: '/user/comments' })

    expect(
      await screen.findByText('아직 작성한 댓글이 없어요')
    ).toBeInTheDocument()
  })
})

describe('북마크', () => {
  it('북마크한 글 제목이 표시된다', async () => {
    renderWithProviders(<UserBookmarks />, { route: '/user/bookmarks' })

    expect(await screen.findByText('총 3개')).toBeInTheDocument()
    expect(
      screen.getByText('공부 루틴을 꾸준히 유지하는 팁 공유해요')
    ).toBeInTheDocument()
  })

  it('하트를 누르면 북마크가 해제된다', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserBookmarks />, { route: '/user/bookmarks' })
    await screen.findByText('총 3개')

    await user.click(
      screen.getByRole('button', {
        name: '취업 준비 같이 하실 분! 🔥 북마크 해제',
      })
    )

    expect(await screen.findByText('총 2개')).toBeInTheDocument()
  })
})

describe('참여 스터디', () => {
  it('참여 중인 스터디와 참여 인원이 표시된다', async () => {
    renderWithProviders(<UserStudies />, { route: '/user/studies' })

    expect(await screen.findByText('총 2개')).toBeInTheDocument()
    expect(screen.getByText('AI 프로젝트를 만들어보자!')).toBeInTheDocument()
    expect(screen.getByText('엄박봉 · 2명 참여 중')).toBeInTheDocument()
  })

  it('참여 스터디가 없으면 빈 상태 문구를 보여준다', async () => {
    server.use(emptyList('/api/v1/users/me/studies'))
    renderWithProviders(<UserStudies />, { route: '/user/studies' })

    expect(
      await screen.findByText('아직 참여 중인 스터디가 없어요')
    ).toBeInTheDocument()
  })
})
