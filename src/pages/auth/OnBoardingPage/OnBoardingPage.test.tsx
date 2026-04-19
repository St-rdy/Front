import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import OnBoardingPage from './OnBoardingPage'

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

describe('온보딩 테스트', () => {
  it('온보딩 페이지가 렌더링 되어야 한다.', () => {
    render(<OnBoardingPage />)
    const onBoardingPageElement = screen.getByText('시작하기')
    expect(onBoardingPageElement).toBeInTheDocument()
  })
})
