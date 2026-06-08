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
  it('필터 버튼이 표시된다', () => {
    renderStudyGroup()
    expect(screen.getByText('전체')).toBeInTheDocument()
    expect(screen.getByText('언어학습')).toBeInTheDocument()
    expect(screen.getByText('취업준비')).toBeInTheDocument()
    expect(screen.getByText('AI/개발')).toBeInTheDocument()
    expect(screen.getByText('공부인증')).toBeInTheDocument()
  })

  it('스터디 그룹 카드 목록이 표시된다', async () => {
    renderStudyGroup()
    for (const group of mockStudyGroups.groups) {
      expect(await screen.findByText(group.title)).toBeInTheDocument()
    }
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
