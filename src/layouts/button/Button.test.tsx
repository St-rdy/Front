import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event' // 유저 이벤트 임포트
import { describe, test, expect, vi } from 'vitest'
import Button from './Button'
import '@testing-library/jest-dom'

describe('Button 컴포넌트 테스트', () => {
  test('사용자가 버튼을 클릭하면 onClick 함수가 호출되어야 한다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>클릭</Button>)
    const button = screen.getByRole('button', { name: /클릭/i })

    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('state가 loading일 때 클릭해도 onClick이 호출되지 않아야 한다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button state="loading" onClick={handleClick}></Button>)
    const button = screen.getByRole('button')

    // 로딩 중일 때는 이미지가 보이므로 텍스트로 찾기보다 role로 찾습니다.
    await user.click(button)

    // 비활성화 상태이므로 함수가 호출되면 안 됨
    expect(handleClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
  })

  test('state가 inactive일 때 클릭해도 onClick이 호출되지 않아야 한다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button state="inactive" onClick={handleClick}></Button>)
    const button = screen.getByRole('button')

    await user.click(button)

    expect(handleClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
  })
})
