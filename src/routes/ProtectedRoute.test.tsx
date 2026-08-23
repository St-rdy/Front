import { screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Route } from 'react-router-dom'
import { renderWithProviders } from '../test/renderWithProviders'
import { useAuthStore } from '../stores/authStore'
import { setToken, clearToken } from '../api/token'
import { markOnboardingSeen } from '../utils/onboarding'
import ProtectedRoute from './ProtectedRoute'

// 보호된 화면 + 리다이렉트 대상 화면을 한 트리에 올려 결과를 확인합니다.
function renderGuard(route = '/') {
  return renderWithProviders(<ProtectedRoute />, {
    route,
    path: '/',
    extraRoutes: (
      <>
        <Route path="/auth/onboarding" element={<div>온보딩 화면</div>} />
        <Route path="/auth/login" element={<div>로그인 화면</div>} />
        <Route path="/auth/signup" element={<div>회원가입 화면</div>} />
      </>
    ),
  })
}

beforeEach(() => {
  clearToken()
  useAuthStore.setState({ user: null, needsProfile: false })
})

describe('ProtectedRoute - 로그인 전', () => {
  it('첫 방문이면 온보딩으로 보낸다', () => {
    renderGuard()
    expect(screen.getByText('온보딩 화면')).toBeInTheDocument()
  })

  it('온보딩을 이미 봤다면 로그인 화면으로 보낸다', () => {
    markOnboardingSeen()
    renderGuard()
    expect(screen.getByText('로그인 화면')).toBeInTheDocument()
  })

  it('프로필만 없는 상태면 회원가입으로 보낸다', () => {
    setToken('test-token')
    useAuthStore.setState({ user: null, needsProfile: true })

    renderGuard()
    expect(screen.getByText('회원가입 화면')).toBeInTheDocument()
  })
})

describe('ProtectedRoute - 로그인 후', () => {
  it('토큰과 프로필이 모두 있으면 통과시킨다', () => {
    setToken('test-token')
    useAuthStore.setState({
      user: { id: 1, name: '엄박봉', nickname: '엄박봉', provider: 'kakao' },
      needsProfile: false,
    })

    renderGuard()
    // 리다이렉트 화면이 보이지 않으면 통과한 것입니다.
    expect(screen.queryByText('온보딩 화면')).not.toBeInTheDocument()
    expect(screen.queryByText('로그인 화면')).not.toBeInTheDocument()
    expect(screen.queryByText('회원가입 화면')).not.toBeInTheDocument()
  })

  it('토큰이 없으면 프로필이 남아 있어도 통과시키지 않는다', () => {
    clearToken()
    useAuthStore.setState({
      user: { id: 1, name: '엄박봉', nickname: '엄박봉', provider: 'kakao' },
      needsProfile: false,
    })
    markOnboardingSeen()

    renderGuard()
    expect(screen.getByText('로그인 화면')).toBeInTheDocument()
  })
})
