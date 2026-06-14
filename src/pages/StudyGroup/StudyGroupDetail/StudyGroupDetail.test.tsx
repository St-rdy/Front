import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../../mocks/server'
import StudyGroupDetail from './StudyGroupDetail'
import { mockStudyGroupDetails } from '../../../mocks/handlers/studyGroup'

function renderStudyGroupDetail(id = '1') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/studygroup/${id}`]}>
        <Routes>
          <Route path="/studygroup/:id" element={<StudyGroupDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

const group = mockStudyGroupDetails[1].group

// ─── 로딩 상태 ────────────────────────────────────────────────
describe('StudyGroupDetail 페이지 - 로딩 상태', () => {
  it('데이터를 불러오는 동안 로딩 메시지를 보여준다', () => {
    renderStudyGroupDetail()
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument()
  })
})

// ─── 성공 상태 ────────────────────────────────────────────────
describe('StudyGroupDetail 페이지 - 성공 상태', () => {
  it('뒤로가기 버튼이 표시된다', () => {
    renderStudyGroupDetail()
    expect(screen.getByAltText('뒤로')).toBeInTheDocument()
  })

  it('그룹 제목이 표시된다', async () => {
    renderStudyGroupDetail()
    expect(await screen.findByText(group.title)).toBeInTheDocument()
  })

  it('그룹 설명이 표시된다', async () => {
    renderStudyGroupDetail()
    await screen.findByText(group.title)
    expect(screen.getByText(group.description)).toBeInTheDocument()
  })

  it('호스트 이름이 표시된다', async () => {
    renderStudyGroupDetail()
    await screen.findByText(group.title)
    expect(screen.getByText(group.hostName)).toBeInTheDocument()
  })

  it('가입 신청하기 버튼이 표시된다', async () => {
    renderStudyGroupDetail()
    await screen.findByText(group.title)
    expect(screen.getByText('가입 신청하기')).toBeInTheDocument()
  })
})

// ─── 에러 상태 ────────────────────────────────────────────────
describe('StudyGroupDetail 페이지 - 에러 상태', () => {
  it('API 실패 시 에러 메시지를 보여준다', async () => {
    server.use(
      http.get('/api/studygroup/groups/:id', () => HttpResponse.error())
    )
    renderStudyGroupDetail()
    await waitFor(() => {
      expect(
        screen.getByText('데이터를 불러오지 못했습니다.')
      ).toBeInTheDocument()
    })
  })

  it('존재하지 않는 id 조회 시 에러 메시지를 보여준다', async () => {
    renderStudyGroupDetail('999')
    await waitFor(() => {
      expect(
        screen.getByText('데이터를 불러오지 못했습니다.')
      ).toBeInTheDocument()
    })
  })
})
