import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import FilterBar from './FilterBar'

const CATEGORIES = ['전체', '취업 준비', '공부 인증', '스터디 그룹']

// 렌더링
describe('FilterBar 컴포넌트 - 기본 렌더링', () => {
  it('categories 배열만큼 버튼이 렌더링된다', () => {
    render(
      <FilterBar categories={CATEGORIES} selected="전체" onChange={vi.fn()} />
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(CATEGORIES.length)
  })

  it('각 카테고리 이름이 버튼으로 표시된다', () => {
    render(
      <FilterBar categories={CATEGORIES} selected="전체" onChange={vi.fn()} />
    )
    CATEGORIES.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument()
    })
  })

  it('첫 번째 카테고리 버튼에만 ≡ 아이콘이 표시된다', () => {
    render(
      <FilterBar categories={CATEGORIES} selected="전체" onChange={vi.fn()} />
    )
    const icons = screen.getAllByText('≡')
    expect(icons).toHaveLength(1)
  })
})

// 선택
describe('FilterBar 컴포넌트 - 선택 상태', () => {
  it('selected와 일치하는 버튼에 active 클래스가 적용된다', () => {
    render(
      <FilterBar
        categories={CATEGORIES}
        selected="취업 준비"
        onChange={vi.fn()}
      />
    )
    const activeButton = screen.getByText('취업 준비')
    expect(activeButton).toHaveClass('filter-bar__item--active')
  })

  it('선택되지 않은 버튼에는 active 클래스가 없다', () => {
    render(
      <FilterBar categories={CATEGORIES} selected="전체" onChange={vi.fn()} />
    )
    const inactiveButton = screen.getByText('취업 준비')
    expect(inactiveButton).not.toHaveClass('filter-bar__item--active')
  })
})

// 인터렉션
describe('FilterBar 컴포넌트 - 인터랙션', () => {
  it('버튼 클릭 시 onChange가 해당 카테고리와 함께 호출된다', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <FilterBar
        categories={CATEGORIES}
        selected="전체"
        onChange={handleChange}
      />
    )
    await user.click(screen.getByText('취업 준비'))

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith('취업 준비')
  })

  it('이미 선택된 버튼을 다시 클릭해도 onChange가 호출된다', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <FilterBar
        categories={CATEGORIES}
        selected="전체"
        onChange={handleChange}
      />
    )
    await user.click(screen.getByText('전체'))

    expect(handleChange).toHaveBeenCalledWith('전체')
  })
})
