import { render, screen } from '@testing-library/react'
import { it, describe, expect } from 'vitest'
import { Toast } from './Toast'

describe('Toast 테스트', () => {
  it('Toast 컴포넌트가 렌더링 되어야 한다.', () => {
    render(<Toast />)
    const toastElement = screen.getByText('Toast')
    expect(toastElement).toBeInTheDocument()
  })
})
