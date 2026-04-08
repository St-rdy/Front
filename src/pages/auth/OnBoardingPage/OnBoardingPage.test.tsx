import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import OnBoardingPage from './OnBoardingPage'

describe('온보딩 테스트', () => {
  it('온보딩 페이지가 렌더링 되어야 한다.', () => {
    render(<OnBoardingPage />)
    const onBoardingPageElement = screen.getByText('OnBoardingPage')
    expect(onBoardingPageElement).toBeInTheDocument()
  })
})
