import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import StudyManagement from './StudyManagement'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/study']}>
        <StudyManagement />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('StudyManagement 페이지', () => {
  it('4개 탭이 렌더링된다', () => {
    renderPage()
    expect(screen.getByRole('button', { name: '일정' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '타이머' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '학습통계' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '목표달성' })).toBeInTheDocument()
  })

  it('기본 활성 탭은 일정이다', () => {
    renderPage()
    expect(screen.getByRole('button', { name: '일정' })).toHaveClass(
      'sm-tab--active'
    )
  })

  it('타이머 탭 클릭 시 활성화된다', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: '타이머' }))
    expect(screen.getByRole('button', { name: '타이머' })).toHaveClass(
      'sm-tab--active'
    )
    expect(screen.getByRole('button', { name: '일정' })).not.toHaveClass(
      'sm-tab--active'
    )
  })

  it('학습통계 탭 클릭 시 활성화된다', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: '학습통계' }))
    expect(screen.getByRole('button', { name: '학습통계' })).toHaveClass(
      'sm-tab--active'
    )
  })

  it('목표달성 탭 클릭 시 활성화된다', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: '목표달성' }))
    expect(screen.getByRole('button', { name: '목표달성' })).toHaveClass(
      'sm-tab--active'
    )
  })
})

describe('StudyManagement - 일정 탭', () => {
  it('오늘 날짜의 일정이 표시된다', async () => {
    renderPage()
    expect(await screen.findByText('영어 공부')).toBeInTheDocument()
    expect(await screen.findByText('국어 공부')).toBeInTheDocument()
  })

  it('일정 추가 FAB 버튼이 표시된다', () => {
    renderPage()
    expect(screen.getByLabelText('일정 추가')).toBeInTheDocument()
  })

  it('FAB 클릭 시 일정 추가 모달이 열린다', () => {
    renderPage()
    fireEvent.click(screen.getByLabelText('일정 추가'))
    expect(screen.getByText('일정 추가')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('과목명 (예: 영어 공부)')
    ).toBeInTheDocument()
  })

  it('모달에서 취소 클릭 시 닫힌다', () => {
    renderPage()
    fireEvent.click(screen.getByLabelText('일정 추가'))
    fireEvent.click(screen.getByRole('button', { name: '취소' }))
    expect(
      screen.queryByPlaceholderText('과목명 (예: 영어 공부)')
    ).not.toBeInTheDocument()
  })

  it('일정 없을 때 빈 상태 메시지가 표시된다', async () => {
    server.use(http.get('/api/study/schedules', () => HttpResponse.json([])))
    renderPage()
    expect(await screen.findByText('이 날은 일정이 없어요')).toBeInTheDocument()
  })
})
