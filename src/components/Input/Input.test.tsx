import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Input } from './Input'
import userEvent from '@testing-library/user-event'

// 렌더링 테스트
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
    const errorElement = screen.getByText('에러 메시지')
    expect(errorElement).toBeInTheDocument()
  })
})

// multiline 변형 테스트
describe('Input 컴포넌트 타입 변형 테스트', () => {
  it('Input 컴포넌트에서 multiline=true일때 textarea 요소가 렌더링 되어야 한다.', () => {
    render(<Input multiline={true} />)
    const textareaElement = screen.getByRole('textbox')
    expect(textareaElement).toBeInTheDocument()
  })
  it('Input 컴포넌트에서 multiline=false일때 input 요소가 렌더링 되어야 한다.', () => {
    render(<Input multiline={false} />)
    const inputElement = screen.getByRole('textbox')
    expect(inputElement).toBeInTheDocument()
  })
})

// rightAction 버튼 테스트
describe('Input 컴포넌트 rightAction 버튼 테스트', () => {
  it('Input 컴포넌트에서 rightAction 버튼이 렌더링 되어야 한다.', () => {
    const rightAction = { label: '중복 버튼', onClick: vi.fn() }
    render(<Input multiline={false} rightAction={rightAction} />)
    const buttonElement = screen.getByText('중복 버튼')
    expect(buttonElement).toBeInTheDocument()
  })
})

// 사용자 상호작용 테스트
describe('Input 컴포넌트 사용자 상호작용 테스트', () => {
  it('input에 값을 입력할 수 있어야 한다.', async () => {
    render(
      <Input
        label="테스트"
        multiline={false}
        type="text"
        placeholder="테스트 값을 입력해주세요."
      />
    )
    const inputElement =
      screen.getByPlaceholderText('테스트 값을 입력해주세요.')
    await userEvent.type(inputElement, '테스트 입력')
    expect(inputElement).toHaveValue('테스트 입력')
  })
  it('textarea에 값을 입력할 수 있어야 한다.', async () => {
    render(
      <Input
        label="테스트"
        multiline={true}
        type="textbox"
        placeholder="테스트 값을 입력해주세요."
      />
    )
    const inputElement =
      screen.getByPlaceholderText('테스트 값을 입력해주세요.')
    await userEvent.type(inputElement, '테스트 입력\n테스트 입력2')
    expect(inputElement).toHaveValue('테스트 입력\n테스트 입력2')
  })
})
