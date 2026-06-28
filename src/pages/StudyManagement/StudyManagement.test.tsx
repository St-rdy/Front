import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
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
