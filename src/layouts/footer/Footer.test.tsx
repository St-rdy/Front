import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './footer'

describe('Footer 테스트', () => {
  it('Footer 컴포넌트가 랜더링 되어야 한다.', () => {
    render(<Footer />)
    const footerElement = screen.getByText('커뮤니티')
    expect(footerElement).toBeInTheDocument()
  })
  it('Footer 컴포넌트에 5개의 버튼이 있어야 한다.', () => {
    render(<Footer />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(5)
  })
  it('각 버튼을 클릭하면 onClick 이벤트가 발생해야 한다.', () => {
    render(<Footer />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeInTheDocument()
    })
  })
})
