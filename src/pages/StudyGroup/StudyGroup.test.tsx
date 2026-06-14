import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import StudyGroupPage from './StudyGroup'
import { mockStudyGroups } from '../../mocks/handlers/studyGroup'

function renderStudyGroup() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <StudyGroupPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

// ─── 로딩 상태 ────────────────────────────────────────────────
describe('StudyGroup 페이지 - 로딩 상태', () => {
  it('데이터를 불러오는 동안 로딩 메시지를 보여준다', () => {
    renderStudyGroup()
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument()
  })
})

// ─── 성공 상태 ────────────────────────────────────────────────
describe('StudyGroup 페이지 - 성공 상태', () => {
  it('"전체 카테고리" 칩바 버튼이 표시된다', () => {
    renderStudyGroup()
    expect(screen.getByText('≡ 전체 카테고리')).toBeInTheDocument()
  })

  it('기본 카테고리 칩이 표시된다', () => {
    renderStudyGroup()
    expect(
      screen.getByRole('button', { name: '온라인 스터디' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '오프라인 스터디' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '단기 스터디' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '면접 준비' })
    ).toBeInTheDocument()
  })

  it('배너 타이틀이 표시된다', () => {
    renderStudyGroup()
    expect(screen.getByText('함께 공부해요')).toBeInTheDocument()
  })

  it('스터디 그룹 카드 목록이 표시된다', async () => {
    renderStudyGroup()
    for (const group of mockStudyGroups.groups) {
      expect(await screen.findByText(group.title)).toBeInTheDocument()
    }
  })

  it('섹션 타이틀이 표시된다', async () => {
    renderStudyGroup()
    expect(await screen.findByText('이번 주 인기 그룹 🔥')).toBeInTheDocument()
    expect(screen.getByText('추천 스터디 그룹')).toBeInTheDocument()
  })

  it('스터디 그룹 만들기 버튼이 표시된다', () => {
    renderStudyGroup()
    expect(screen.getByAltText('스터디 그룹 만들기')).toBeInTheDocument()
  })
})

// ─── 에러 상태 ────────────────────────────────────────────────
describe('StudyGroup 페이지 - 에러 상태', () => {
  it('API 실패 시 에러 메시지를 보여준다', async () => {
    server.use(http.get('/api/studygroup/groups', () => HttpResponse.error()))
    renderStudyGroup()
    await waitFor(() => {
      expect(
        screen.getByText('데이터를 불러오지 못했습니다.')
      ).toBeInTheDocument()
    })
  })
})
