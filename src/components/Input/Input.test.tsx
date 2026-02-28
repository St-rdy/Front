import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Input } from './Input'

describe('Input 컴포넌트 테스트', () => {
  it('Input 컴포넌트가 렌더링 되어야 한다', () => {
    render(
      <Input
        label="이름"
        type="text"
        placeholder="입력해주세요"
        multiline={false}
      />
    )
    const inputElement = screen.getByText('이름')
    expect(inputElement).toBeInTheDocument()
  })
  it('Input 컴포넌트가 에러 메시지를 표시해야 한다.', () => {
    render(<Input error="에러 메시지" multiline={false} />)
  })
})
