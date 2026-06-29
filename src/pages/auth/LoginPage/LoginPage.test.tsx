import { render, screen } from '@testing-library/react'
import { it, describe, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import LoginPage from './LoginPage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('로그인 페이지 테스트', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  describe('랜더링 테스트', () => {
    it('로그인 페이지가 랜더링 되어야 한다.', () => {
      render(<LoginPage />)
      const loginPage = screen.getByText('나만의 스터디 여정을 시작하세요')
      expect(loginPage).toBeInTheDocument()
    })
    it('카카오 로그인 버튼이 랜더링 되어야 한다,', () => {
      render(<LoginPage />)
      const kakaoLoginButton = screen.getByText('카카오 로그인')
      expect(kakaoLoginButton).toBeInTheDocument()
    })
    it('네이버 로그인 버튼이 랜더링 되어야 한다,', () => {
      render(<LoginPage />)
      const naverLoginButton = screen.getByText('네이버 로그인')
      expect(naverLoginButton).toBeInTheDocument()
    })
    it('구글 로그인 버튼이 랜더링 되어야 한다,', () => {
      render(<LoginPage />)
      const googleLoginButton = screen.getByText('구글 로그인')
      expect(googleLoginButton).toBeInTheDocument()
    })
  })
  describe('버튼 클릭 테스트', () => {
    it('카카오 로그인 버튼을 클릭하면 /auth/signup 페이지로 이동해야 한다.', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)
      const kakaoLoginButton = screen.getByText('카카오 로그인')
      await user.click(kakaoLoginButton)
      expect(mockNavigate).toHaveBeenCalledWith('/auth/signup')
    })
    it('네이버 로그인 버튼을 클릭하면 /auth/signup 페이지로 이동해야 한다.', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)
      const naverLoginButton = screen.getByText('네이버 로그인')
      await user.click(naverLoginButton)
      expect(mockNavigate).toHaveBeenCalledWith('/auth/signup')
    })
    it('구글 로그인 버튼을 클릭하면 /auth/signup 페이지로 이동해야 한다.', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)
      const googleLoginButton = screen.getByText('구글 로그인')
      await user.click(googleLoginButton)
      expect(mockNavigate).toHaveBeenCalledWith('/auth/signup')
    })
  })
})
