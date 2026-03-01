import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import Footer from './Footer'

describe('Footer 테스트', () => {
  it('Footer 컴포넌트가 랜더링 되어야 한다.', () => {
    render(<Footer />)
    const footerElement = screen.getByText('커뮤니티') // 커뮤니티 버튼 찾기
    expect(footerElement).toBeInTheDocument() // 버튼 요소가 있는지 확인
  })
  it('Footer 컴포넌트에 5개의 버튼이 있어야 한다.', () => {
    render(<Footer />)
    const buttons = screen.getAllByRole('button') // 5개의 버튼이 있는지 확인
    expect(buttons).toHaveLength(5)
  })
  it('버튼을 클릭하면 onClick 이벤트가 발생해야 한다.', async () => {
    render(<Footer />)
    const userButton = screen.getByText('내정보') // 버튼을 찾고
    const userButtonImage = userButton.querySelector('img') // 이미지 요소를 찾은 뒤
    expect(userButtonImage?.src).toContain('user.svg') // 이미지 이름이
    await userEvent.click(userButton) // 버튼을 눌렀을 때
    expect(userButtonImage?.src).toContain('user_fill.svg') // 바뀌는지 확인
  })
})
