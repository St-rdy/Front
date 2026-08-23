import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Route } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderWithProviders } from '../../test/renderWithProviders'
import { useAuthStore } from '../../stores/authStore'
import { setToken, getToken } from '../../api/token'
import User from './User'

const destinations = (
  <>
    <Route path="/user/posts" element={<div>내가 쓴 게시물 화면</div>} />
    <Route path="/user/comments" element={<div>내가 쓴 댓글 화면</div>} />
    <Route path="/user/bookmarks" element={<div>북마크 화면</div>} />
    <Route path="/user/studies" element={<div>참여 스터디 화면</div>} />
    <Route path="/study" element={<div>학습관리 화면</div>} />
    <Route path="/auth/login" element={<div>로그인 화면</div>} />
  </>
)

function renderUser() {
  // 로그인된 상태를 만들어 둡니다.
  setToken('test-token')
  useAuthStore.setState({
    user: { id: 1, name: '엄박봉', nickname: '엄박봉', provider: 'kakao' },
    needsProfile: false,
  })

  return renderWithProviders(<User />, {
    route: '/user',
    path: '/user',
    extraRoutes: destinations,
  })
}

describe('User 페이지 - 상태', () => {
  it('데이터를 불러오는 동안 로딩 메시지를 보여준다', () => {
    renderUser()
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument()
  })

  it('API 실패 시 에러 메시지를 보여준다', async () => {
    server.use(http.get('/api/v1/users/me/profile', () => HttpResponse.error()))
    renderUser()
    expect(
      await screen.findByText('데이터를 불러오지 못했습니다.')
    ).toBeInTheDocument()
  })
})

describe('User 페이지 - 프로필', () => {
  it('닉네임과 게시물/팔로워/팔로잉 수가 표시된다', async () => {
    renderUser()
    expect(await screen.findByText('엄박봉')).toBeInTheDocument()
    expect(screen.getByText('게시물 6')).toBeInTheDocument()
    expect(screen.getByText('팔로워 3.1만')).toBeInTheDocument()
    expect(screen.getByText('팔로잉 300')).toBeInTheDocument()
  })

  it('학습 통계 3종이 표시된다', async () => {
    renderUser()
    expect(await screen.findByText('레벨')).toBeInTheDocument()
    expect(screen.getByText('오늘의 학습')).toBeInTheDocument()
    expect(screen.getByText('주간 목표')).toBeInTheDocument()
  })
})

describe('User 페이지 - 이동', () => {
  it.each([
    ['북마크', '북마크 화면'],
    ['참여 스터디', '참여 스터디 화면'],
    ['학습관리', '학습관리 화면'],
    ['내가 쓴 게시물', '내가 쓴 게시물 화면'],
    ['내가 쓴 댓글', '내가 쓴 댓글 화면'],
  ])('"%s"를 누르면 해당 화면으로 이동한다', async (label, destination) => {
    const user = userEvent.setup()
    renderUser()
    await screen.findByText('엄박봉')

    await user.click(screen.getByText(label))

    expect(await screen.findByText(destination)).toBeInTheDocument()
  })
})

describe('User 페이지 - 로그아웃', () => {
  it('로그아웃하면 토큰이 지워지고 로그인 화면으로 이동한다', async () => {
    const user = userEvent.setup()
    renderUser()
    await screen.findByText('엄박봉')

    await user.click(screen.getByText('로그아웃'))

    expect(await screen.findByText('로그인 화면')).toBeInTheDocument()
    await waitFor(() => {
      expect(getToken()).toBeNull()
      expect(useAuthStore.getState().user).toBeNull()
    })
  })
})
