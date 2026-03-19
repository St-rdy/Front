import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Header from './Header'

describe('Header 테스트', () => {
  // 1. 경로에 따른 타이틀
  it('"/studygroup" 경로일 때 "스터디그룹" 타이틀이 출력', () => {
    render(
      <MemoryRouter initialEntries={['/studygroup']}>
        <Header />
      </MemoryRouter>
    )
    expect(screen.getByText('스터디그룹')).toBeInTheDocument()
  })
  // 2. 검색 모드 테스트
  it('검색 아이콘 클릭 시 검색창 출력', async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
    // 검색 버튼 클릭
    const searchBtn = screen.getByAltText('검색')

    await userEvent.click(searchBtn)
    // 검색창 확인
    const input = screen.getByPlaceholderText('검색어를 입력해주세요')
    expect(input).toBeInTheDocument()
  })
})
