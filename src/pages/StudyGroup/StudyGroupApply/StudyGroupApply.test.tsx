import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../../mocks/server'
import StudyGroupApply from './StudyGroupApply'
import { mockStudyGroupDetails } from '../../../mocks/handlers/studyGroup'

function renderStudyGroupApply(id = '1') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/studygroup/${id}/apply`]}>
        <Routes>
          <Route path="/studygroup/:id/apply" element={<StudyGroupApply />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

const group = mockStudyGroupDetails[1].group

// ─── 로딩 상태 ────────────────────────────────────────────────
describe('StudyGroupApply 페이지 - 로딩 상태', () => {
  it('데이터를 불러오는 동안 로딩 메시지를 보여준다', () => {
    renderStudyGroupApply()
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument()
  })
})

// ─── 성공 상태 ────────────────────────────────────────────────
describe('StudyGroupApply 페이지 - 성공 상태', () => {
  it('헤더 타이틀이 표시된다', () => {
    renderStudyGroupApply()
    expect(screen.getByText('스터디 신청')).toBeInTheDocument()
  })

  it('뒤로가기 버튼이 표시된다', () => {
    renderStudyGroupApply()
    expect(screen.getByAltText('뒤로')).toBeInTheDocument()
  })

  it('그룹 제목이 표시된다', async () => {
    renderStudyGroupApply()
    expect(await screen.findByText(group.title)).toBeInTheDocument()
  })

  it('지원 동기 입력 필드가 표시된다', async () => {
    renderStudyGroupApply()
    await screen.findByText(group.title)
    expect(
      screen.getByPlaceholderText('이 스터디에 지원하는 이유를 작성해주세요')
    ).toBeInTheDocument()
  })

  it('연락처 입력 필드가 표시된다', async () => {
    renderStudyGroupApply()
    await screen.findByText(group.title)
    expect(
      screen.getByPlaceholderText('연락 가능한 이메일 또는 전화번호')
    ).toBeInTheDocument()
  })

  it('지원 동기가 비어 있으면 신청 버튼이 비활성화된다', async () => {
    renderStudyGroupApply()
    await screen.findByText(group.title)
    expect(screen.getByText('신청 완료')).toBeDisabled()
  })

  it('지원 동기를 입력하면 신청 버튼이 활성화된다', async () => {
    renderStudyGroupApply()
    await screen.findByText(group.title)
    const textarea = screen.getByPlaceholderText(
      '이 스터디에 지원하는 이유를 작성해주세요'
    )
    await userEvent.type(textarea, '열심히 하겠습니다')
    expect(screen.getByText('신청 완료')).not.toBeDisabled()
  })
})

// ─── 에러 상태 ────────────────────────────────────────────────
describe('StudyGroupApply 페이지 - 에러 상태', () => {
  it('API 실패 시 에러 메시지를 보여준다', async () => {
    server.use(
      http.get('/api/v1/studygroup/groups/:id', () => HttpResponse.error())
    )
    renderStudyGroupApply()
    await waitFor(() => {
      expect(
        screen.getByText('데이터를 불러오지 못했습니다.')
      ).toBeInTheDocument()
    })
  })
})

// ─── 신청 요청 ────────────────────────────────────────────────
describe('StudyGroupApply 페이지 - 신청 요청', () => {
  it('지원 동기가 비어 있으면 신청 버튼이 비활성화된다', async () => {
    renderStudyGroupApply()
    await screen.findByText(group.title)
    expect(screen.getByRole('button', { name: '신청 완료' })).toBeDisabled()
  })

  it('지원 동기를 입력하면 신청 버튼이 활성화된다', async () => {
    const user = userEvent.setup()
    renderStudyGroupApply()
    await screen.findByText(group.title)

    await user.type(
      screen.getByPlaceholderText('이 스터디에 지원하는 이유를 작성해주세요'),
      '열심히 하겠습니다'
    )

    expect(screen.getByRole('button', { name: '신청 완료' })).not.toBeDisabled()
  })

  it('신청에 성공하면 접수 완료 화면을 보여준다', async () => {
    const user = userEvent.setup()
    renderStudyGroupApply()
    await screen.findByText(group.title)

    await user.type(
      screen.getByPlaceholderText('이 스터디에 지원하는 이유를 작성해주세요'),
      '열심히 하겠습니다'
    )
    await user.click(screen.getByRole('button', { name: '신청 완료' }))

    expect(await screen.findByText('신청이 접수되었어요')).toBeInTheDocument()
  })

  it('신청이 실패하면 에러 문구를 보여준다', async () => {
    server.use(
      http.post('/api/v1/studygroup/groups/:id/apply', () =>
        HttpResponse.error()
      )
    )
    const user = userEvent.setup()
    renderStudyGroupApply()
    await screen.findByText(group.title)

    await user.type(
      screen.getByPlaceholderText('이 스터디에 지원하는 이유를 작성해주세요'),
      '열심히 하겠습니다'
    )
    await user.click(screen.getByRole('button', { name: '신청 완료' }))

    expect(
      await screen.findByText('신청에 실패했어요. 잠시 후 다시 시도해주세요.')
    ).toBeInTheDocument()
  })
})
