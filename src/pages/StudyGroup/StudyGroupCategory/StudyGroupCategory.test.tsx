import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import StudyGroupCategory from './StudyGroupCategory'

function renderCategoryPage(path = '/studygroup/category') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/studygroup/category" element={<StudyGroupCategory />} />
      </Routes>
    </MemoryRouter>
  )
}

// ─── 렌더링 ───────────────────────────────────────────────────
describe('StudyGroupCategory 페이지 - 렌더링', () => {
  it('페이지 타이틀이 표시된다', () => {
    renderCategoryPage()
    expect(screen.getByText('스터디')).toBeInTheDocument()
    expect(screen.getByText(/카테고리를/)).toBeInTheDocument()
  })

  it('4개 섹션 타이틀이 표시된다', () => {
    renderCategoryPage()
    expect(screen.getByText('지역')).toBeInTheDocument()
    expect(screen.getByText('인기 카테고리')).toBeInTheDocument()
    expect(screen.getByText('공시 카테고리')).toBeInTheDocument()
    expect(screen.getByText('임용 카테고리')).toBeInTheDocument()
  })

  it('지역 태그들이 표시된다', () => {
    renderCategoryPage()
    expect(screen.getByRole('button', { name: '서울' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '경기' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '부산' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '제주' })).toBeInTheDocument()
  })

  it('인기 카테고리 태그들이 표시된다', () => {
    renderCategoryPage()
    expect(
      screen.getByRole('button', { name: '온라인 스터디' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '면접 준비' })
    ).toBeInTheDocument()
  })

  it('"정했어요" 버튼이 표시된다', () => {
    renderCategoryPage()
    expect(screen.getByText('정했어요')).toBeInTheDocument()
  })

  it('닫기 버튼이 표시된다', () => {
    renderCategoryPage()
    expect(screen.getByLabelText('닫기')).toBeInTheDocument()
  })
})

// ─── 다중 선택 ────────────────────────────────────────────────
describe('StudyGroupCategory 페이지 - 다중 선택', () => {
  it('태그를 클릭하면 선택 상태가 된다', () => {
    renderCategoryPage()
    const btn = screen.getByRole('button', { name: '서울' })
    expect(btn).not.toHaveClass('sg-cat-tag--selected')
    fireEvent.click(btn)
    expect(btn).toHaveClass('sg-cat-tag--selected')
  })

  it('선택된 태그를 다시 클릭하면 선택 해제된다', () => {
    renderCategoryPage()
    const btn = screen.getByRole('button', { name: '경기' })
    fireEvent.click(btn)
    expect(btn).toHaveClass('sg-cat-tag--selected')
    fireEvent.click(btn)
    expect(btn).not.toHaveClass('sg-cat-tag--selected')
  })

  it('여러 태그를 동시에 선택할 수 있다', () => {
    renderCategoryPage()
    fireEvent.click(screen.getByRole('button', { name: '서울' }))
    fireEvent.click(screen.getByRole('button', { name: '온라인 스터디' }))
    fireEvent.click(screen.getByRole('button', { name: '국어' }))
    expect(screen.getByRole('button', { name: '서울' })).toHaveClass(
      'sg-cat-tag--selected'
    )
    expect(screen.getByRole('button', { name: '온라인 스터디' })).toHaveClass(
      'sg-cat-tag--selected'
    )
    expect(screen.getByRole('button', { name: '국어' })).toHaveClass(
      'sg-cat-tag--selected'
    )
  })

  it('선택 개수가 버튼 텍스트에 반영된다', () => {
    renderCategoryPage()
    expect(screen.getByText('정했어요')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '서울' }))
    fireEvent.click(screen.getByRole('button', { name: '경기' }))
    expect(screen.getByText(/2개 선택됨/)).toBeInTheDocument()
  })
})

// ─── URL 초기값 ───────────────────────────────────────────────
describe('StudyGroupCategory 페이지 - URL 초기값', () => {
  it('URL cats 파라미터로 초기 선택 상태를 복원한다', () => {
    renderCategoryPage('/studygroup/category?cats=서울,경기')
    expect(screen.getByRole('button', { name: '서울' })).toHaveClass(
      'sg-cat-tag--selected'
    )
    expect(screen.getByRole('button', { name: '경기' })).toHaveClass(
      'sg-cat-tag--selected'
    )
    expect(screen.getByRole('button', { name: '부산' })).not.toHaveClass(
      'sg-cat-tag--selected'
    )
  })
})
