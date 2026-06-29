import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import StudyManagementCalendar from './StudyManagementCalendar'

function renderCalendar(date = '') {
  const url = date ? `/study/calendar?date=${date}` : '/study/calendar'
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/study/calendar" element={<StudyManagementCalendar />} />
        <Route path="/study" element={<div>메인으로 돌아옴</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('StudyManagementCalendar', () => {
  it('현재 연도·월이 표시된다', () => {
    renderCalendar()
    const now = new Date()
    expect(
      screen.getByText(new RegExp(`${now.getFullYear()}년`))
    ).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(`${now.getMonth() + 1}월`))
    ).toBeInTheDocument()
  })

  it('요일 헤더 7개가 표시된다', () => {
    renderCalendar()
    ;['일', '월', '화', '수', '목', '금', '토'].forEach(d =>
      expect(screen.getByText(d)).toBeInTheDocument()
    )
  })

  it('이전 달 버튼 클릭 시 월이 감소한다', () => {
    renderCalendar()
    const now = new Date()
    const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth()
    fireEvent.click(screen.getByLabelText('이전 달'))
    expect(screen.getByText(new RegExp(`${prevMonth}월`))).toBeInTheDocument()
  })

  it('다음 달 버튼 클릭 시 월이 증가한다', () => {
    renderCalendar()
    const now = new Date()
    const nextMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2
    fireEvent.click(screen.getByLabelText('다음 달'))
    expect(screen.getByText(new RegExp(`${nextMonth}월`))).toBeInTheDocument()
  })

  it('닫기 버튼이 있다', () => {
    renderCalendar()
    expect(screen.getByLabelText('닫기')).toBeInTheDocument()
  })

  it('날짜 클릭 시 /study?date=... 로 이동한다', () => {
    renderCalendar()
    fireEvent.click(screen.getByText('1')) // 1일 클릭
    expect(screen.getByText('메인으로 돌아옴')).toBeInTheDocument()
  })

  it('URL date 파라미터로 초기 선택 날짜가 설정된다', () => {
    renderCalendar('2025-12-28')
    // 12월 달력이 표시되어야 함
    expect(screen.getByText('2025년 12월')).toBeInTheDocument()
  })

  it('확인 버튼 클릭 시 /study?date=... 로 이동한다', () => {
    renderCalendar()
    fireEvent.click(screen.getByRole('button', { name: /확인/ }))
    expect(screen.getByText('메인으로 돌아옴')).toBeInTheDocument()
  })
})
