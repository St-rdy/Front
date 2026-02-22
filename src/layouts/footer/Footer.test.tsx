import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './footer'

describe('Footer 테스트', () => {
  it('Footer 컴포넌트가 랜더링 되어야 한다.', () => {
    render(<Footer />)
    const footerElement = screen.getByText('footer')
    expect(footerElement).toBeInTheDocument()
  })
})
