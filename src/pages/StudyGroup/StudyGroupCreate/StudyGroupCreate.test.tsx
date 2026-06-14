import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import StudyGroupCreate from './StudyGroupCreate'

function renderStudyGroupCreate() {
  return render(
    <MemoryRouter>
      <StudyGroupCreate />
    </MemoryRouter>
  )
}

// ─── Step 1 ────────────────────────────────────────────────
describe('StudyGroupCreate 페이지 - Step 1', () => {
  it('헤더 타이틀이 표시된다', () => {
    renderStudyGroupCreate()
    expect(screen.getByText('스터디 그룹 만들기')).toBeInTheDocument()
  })

  it('카테고리 선택 버튼들이 표시된다', () => {
    renderStudyGroupCreate()
    expect(screen.getByText('취업 준비')).toBeInTheDocument()
    expect(screen.getByText('공부 인증')).toBeInTheDocument()
    expect(screen.getByText('스터디 그룹')).toBeInTheDocument()
    expect(screen.getByText('언어학습')).toBeInTheDocument()
  })

  it('온라인/오프라인 선택 버튼이 표시된다', () => {
    renderStudyGroupCreate()
    expect(screen.getByText('온라인')).toBeInTheDocument()
    expect(screen.getByText('오프라인')).toBeInTheDocument()
  })

  it('오프라인 선택 시 장소 입력창이 표시된다', () => {
    renderStudyGroupCreate()
    fireEvent.click(screen.getByText('오프라인'))
    expect(screen.getByPlaceholderText('장소를 입력하세요')).toBeInTheDocument()
  })

  it('다음 버튼이 표시된다', () => {
    renderStudyGroupCreate()
    expect(screen.getByText('다음')).toBeInTheDocument()
  })
})

// ─── Step 2 ────────────────────────────────────────────────
describe('StudyGroupCreate 페이지 - Step 2', () => {
  function goToStep2() {
    renderStudyGroupCreate()
    fireEvent.click(screen.getByText('다음'))
  }

  it('Step 2 타이틀이 표시된다', () => {
    goToStep2()
    expect(screen.getByText('스터디를 소개해주세요')).toBeInTheDocument()
  })

  it('제목 입력창이 표시된다', () => {
    goToStep2()
    expect(
      screen.getByPlaceholderText('스터디 제목을 입력하세요')
    ).toBeInTheDocument()
  })

  it('소개 입력창이 표시된다', () => {
    goToStep2()
    expect(
      screen.getByPlaceholderText('스터디를 소개해주세요')
    ).toBeInTheDocument()
  })

  it('제목을 입력할 수 있다', () => {
    goToStep2()
    const input = screen.getByPlaceholderText('스터디 제목을 입력하세요')
    fireEvent.change(input, { target: { value: '테스트 스터디' } })
    expect(input).toHaveValue('테스트 스터디')
  })

  it('태그 추가 버튼이 표시된다', () => {
    goToStep2()
    expect(screen.getByText('추가')).toBeInTheDocument()
  })
})

// ─── Step 3 ────────────────────────────────────────────────
describe('StudyGroupCreate 페이지 - Step 3', () => {
  function goToStep3() {
    renderStudyGroupCreate()
    fireEvent.click(screen.getByText('다음')) // step 1 → 2
    fireEvent.click(screen.getByText('다음')) // step 2 → 3
  }

  it('Step 3 타이틀이 표시된다', () => {
    goToStep3()
    expect(screen.getByText('기간과 인원을 설정해주세요')).toBeInTheDocument()
  })

  it('완료 버튼이 표시된다', () => {
    goToStep3()
    expect(screen.getByText('완료')).toBeInTheDocument()
  })
})
