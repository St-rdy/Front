import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import SignUpCompletePage from './SignUpCompletePage'
import userEvent from '@testing-library/user-event'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('회원가입 완료 페이지 렌더링 테스트', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })
  it('회원가입 페이지가 렌더링 되어야 한다.', () => {
    render(<SignUpCompletePage />)
    expect(screen.getByText('이제 저희와 함께 공부해요')).toBeInTheDocument()
  })
})

describe('회원가입 완료 페이지 버튼 테스트', () => {
  it('메인으로 넘어가는 버튼이 렌더링 되어야 한다.', () => {
    render(<SignUpCompletePage />)
    expect(screen.getByText('시작할게요')).toBeInTheDocument()
  })
  it('시작할게요 버튼 클릭 시 메인 페이지로 이동해야한다.', async () => {
    const user = userEvent.setup()
    render(<SignUpCompletePage />)
    const startButton = screen.getByText('시작할게요')
    await user.click(startButton)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
