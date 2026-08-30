import { screen, waitFor } from '@testing-library/react'
import { it, describe, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Route } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../../mocks/server'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { useAuthStore } from '../../../stores/authStore'
import { getToken } from '../../../api/token'
import LoginPage from './LoginPage'

// 로그인 결과에 따라 어디로 이동했는지 확인하기 위한 더미 화면
const destinations = (
  <>
    <Route path="/" element={<div>홈 화면</div>} />
    <Route path="/auth/signup" element={<div>회원가입 화면</div>} />
  </>
)

function renderLoginPage() {
  useAuthStore.setState({ user: null, needsProfile: false })
  return renderWithProviders(<LoginPage />, {
    route: '/auth/login',
    path: '/auth/login',
    extraRoutes: destinations,
  })
}

describe('로그인 페이지 - 렌더링', () => {
  it('안내 문구가 표시된다', () => {
    renderLoginPage()
    expect(
      screen.getByText('나만의 스터디 여정을 시작하세요')
    ).toBeInTheDocument()
  })

  it('소셜 로그인 버튼 3개가 표시된다', () => {
    renderLoginPage()
    expect(screen.getByText('카카오 로그인')).toBeInTheDocument()
    expect(screen.getByText('네이버 로그인')).toBeInTheDocument()
    expect(screen.getByText('구글 로그인')).toBeInTheDocument()
  })
})

describe('로그인 페이지 - 로그인 흐름', () => {
  it('신규 계정으로 로그인하면 회원가입 화면으로 이동한다', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.click(screen.getByText('카카오 로그인'))

    expect(await screen.findByText('회원가입 화면')).toBeInTheDocument()
  })

  it('로그인에 성공하면 액세스 토큰이 저장된다', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.click(screen.getByText('카카오 로그인'))

    await waitFor(() => {
      expect(getToken()).toBe('mock-access-token-kakao')
    })
  })

  it('이미 가입된 계정으로 로그인하면 홈으로 이동한다', async () => {
    server.use(
      http.post('/api/v1/auth/social-login', () =>
        HttpResponse.json({
          status: 200,
          code: 'SUCCESS',
          message: '로그인 성공',
          data: {
            accessToken: 'mock-access-token',
            isNewUser: false,
            user: {
              id: 1,
              name: '엄박봉',
              nickname: '엄박봉',
              provider: 'kakao',
            },
          },
        })
      )
    )

    const user = userEvent.setup()
    renderLoginPage()

    await user.click(screen.getByText('네이버 로그인'))

    expect(await screen.findByText('홈 화면')).toBeInTheDocument()
  })

  it('로그인이 실패하면 에러 문구를 보여준다', async () => {
    server.use(
      http.post('/api/v1/auth/social-login', () =>
        HttpResponse.json(
          {
            status: 500,
            code: 'SERVER_ERROR',
            message: '서버 오류',
            data: null,
          },
          { status: 500 }
        )
      )
    )

    const user = userEvent.setup()
    renderLoginPage()

    await user.click(screen.getByText('구글 로그인'))

    expect(
      await screen.findByText('로그인에 실패했어요. 잠시 후 다시 시도해주세요.')
    ).toBeInTheDocument()
  })
})
