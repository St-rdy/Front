import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect } from 'vitest'
import SelectButton from './SelectButton'
import '@testing-library/jest-dom'

describe('SelectButton 컴포넌트 테스트', () => {
  test('클릭 시 체크 상태가 토글되어야 한다', async () => {
    const user = userEvent.setup()

    // data-testid를 사용하여 요소를 명확히 찾음
    render(<SelectButton data-testid="select-btn" />)
    const element = screen.getByTestId('select-btn')

    // 첫 클릭 시 체크
    await user.click(element)
    expect(element).toBeChecked()

    // 두 번째 클릭 시 체크 해제
    await user.click(element)
    expect(element).not.toBeChecked()
  })

  test('비활성화 상태일 때는 클릭해도 체크되지 않아야 한다', async () => {
    const user = userEvent.setup()

    // state가 inactive면 disabled 속성이 붙어야 함
    render(<SelectButton data-testid="select-btn" state="inactive" />)
    const element = screen.getByTestId('select-btn')

    expect(element).toBeDisabled()

    await user.click(element)
    expect(element).not.toBeChecked()
  })
})
