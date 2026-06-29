import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Card } from './Card'

describe('Card Component 테스트', () => {
  const mockProps = {
    title: '테스트 카드',
    date: '2026.03.30',
    onClick: vi.fn(),
  }

  it('Props로 전달된 타이틀과 내용을 정상적으로 렌더링한다', () => {
    render(<Card {...mockProps} />)

    expect(screen.getByText('테스트 카드')).toBeInTheDocument()
    expect(screen.getByText('2026.03.30')).toBeInTheDocument()
  })

  it('카드를 클릭하면 onClick 함수가 호출된다', async () => {
    render(<Card {...mockProps} />)

    const cardTitle = screen.getByText('테스트 카드')
    const cardContainer = cardTitle.closest('.card-container')

    if (!cardContainer) throw new Error('Card container를 찾을 수 없습니다.')

    await userEvent.click(cardContainer)

    expect(mockProps.onClick).toHaveBeenCalledTimes(1)
  })
})
