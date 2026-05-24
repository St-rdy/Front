import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import CommunityWrite from './CommunityWrite'

// CommunityWrite는 API 호출이 없으므로 MemoryRouter만으로 충분
function renderCommunityWrite() {
  return render(
    <MemoryRouter>
      <CommunityWrite />
    </MemoryRouter>
  )
}
describe('CommunityWrite 페이지 - 기본 렌더링', () => {
  it('헤더 타이틀이 표시된다', () => {
    renderCommunityWrite()
    expect(screen.getByText('글 작성')).toBeInTheDocument()
  })

  it('뒤로가기 버튼이 표시된다', () => {
    renderCommunityWrite()
    expect(screen.getByAltText('뒤로')).toBeInTheDocument()
  })

  it('완료 버튼이 표시된다', () => {
    renderCommunityWrite()
    expect(screen.getByText('완료')).toBeInTheDocument()
  })

  it('제목 입력창이 표시된다', () => {
    renderCommunityWrite()
    expect(screen.getByPlaceholderText('제목을 입력하세요')).toBeInTheDocument()
  })

  it('카테고리 선택 버튼이 표시된다', () => {
    renderCommunityWrite()
    expect(screen.getByText('카테고리 선택하기')).toBeInTheDocument()
  })

  it('본문 입력창이 표시된다', () => {
    renderCommunityWrite()
    expect(
      screen.getByPlaceholderText(/공부 중 겪었던 고민이나 경험을 공유해주세요/)
    ).toBeInTheDocument()
  })

  it('사진 추가하기 라벨이 표시된다', () => {
    renderCommunityWrite()
    expect(screen.getByText('사진 추가하기')).toBeInTheDocument()
  })

  it('사진 추가 버튼이 표시된다', () => {
    renderCommunityWrite()
    expect(screen.getByText('+')).toBeInTheDocument()
  })
})

describe('CommunityWrite 페이지 - 입력 동작', () => {
  it('제목을 입력할 수 있다', () => {
    renderCommunityWrite()
    const titleInput = screen.getByPlaceholderText('제목을 입력하세요')
    fireEvent.change(titleInput, { target: { value: '테스트 제목' } })
    expect(titleInput).toHaveValue('테스트 제목')
  })

  it('본문을 입력할 수 있다', () => {
    renderCommunityWrite()
    const contentTextarea = screen.getByPlaceholderText(
      /공부 중 겪었던 고민이나 경험을 공유해주세요/
    )
    fireEvent.change(contentTextarea, { target: { value: '테스트 본문 내용' } })
    expect(contentTextarea).toHaveValue('테스트 본문 내용')
  })

  it('카테고리 버튼 클릭 시 카테고리 목록이 표시된다', () => {
    renderCommunityWrite()
    fireEvent.click(screen.getByText('카테고리 선택하기'))
    expect(screen.getByText('취업 준비')).toBeInTheDocument()
    expect(screen.getByText('공부 인증')).toBeInTheDocument()
    expect(screen.getByText('스터디 그룹')).toBeInTheDocument()
  })

  it('카테고리 선택 시 선택한 항목이 표시된다', () => {
    renderCommunityWrite()
    fireEvent.click(screen.getByText('카테고리 선택하기'))
    fireEvent.click(screen.getByText('공부 인증'))
    expect(screen.getByText('공부 인증')).toBeInTheDocument()
    expect(screen.queryByText('카테고리 선택하기')).not.toBeInTheDocument()
  })

  it('카테고리 선택 후 드롭다운이 닫힌다', () => {
    renderCommunityWrite()
    fireEvent.click(screen.getByText('카테고리 선택하기'))
    fireEvent.click(screen.getByText('취업 준비'))
    // 드롭다운이 닫히면 다른 카테고리 항목들이 사라짐
    expect(screen.queryByText('스터디 그룹')).not.toBeInTheDocument()
  })
})
