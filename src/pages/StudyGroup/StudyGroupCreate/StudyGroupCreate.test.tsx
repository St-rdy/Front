import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Route } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../../mocks/server'
import { renderWithProviders } from '../../../test/renderWithProviders'
import StudyGroupCreate from './StudyGroupCreate'

// 완료 시 서버로 POST를 보내므로 React Query 컨텍스트가 필요합니다.
function renderStudyGroupCreate() {
  return renderWithProviders(<StudyGroupCreate />, {
    route: '/studygroup/create',
    path: '/studygroup/create',
    extraRoutes: (
      <Route path="/studygroup/:id" element={<div>스터디 상세 화면</div>} />
    ),
  })
}

// 필수값(카테고리 + 제목)을 채우고 마지막 단계까지 이동합니다.
async function goToLastStepWithValidForm(
  user: ReturnType<typeof userEvent.setup>
) {
  renderStudyGroupCreate()
  await user.click(screen.getByText('취업 준비'))
  await user.click(screen.getByText('다음'))
  await user.type(
    screen.getByPlaceholderText('스터디 제목을 입력하세요'),
    '테스트 스터디'
  )
  await user.click(screen.getByText('다음'))
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

// ─── 생성 요청 ────────────────────────────────────────────────
describe('StudyGroupCreate 페이지 - 생성 요청', () => {
  it('필수값을 채우면 완료 버튼이 활성화된다', async () => {
    const user = userEvent.setup()
    await goToLastStepWithValidForm(user)
    expect(screen.getByRole('button', { name: '완료' })).not.toBeDisabled()
  })

  it('제목이 없으면 완료 버튼이 비활성화된다', async () => {
    const user = userEvent.setup()
    renderStudyGroupCreate()
    await user.click(screen.getByText('취업 준비'))
    await user.click(screen.getByText('다음'))
    await user.click(screen.getByText('다음'))

    expect(screen.getByRole('button', { name: '완료' })).toBeDisabled()
  })

  it('완료를 누르면 생성된 스터디 상세로 이동한다', async () => {
    const user = userEvent.setup()
    await goToLastStepWithValidForm(user)

    await user.click(screen.getByRole('button', { name: '완료' }))

    expect(await screen.findByText('스터디 상세 화면')).toBeInTheDocument()
  })

  it('생성이 실패하면 에러 문구를 보여준다', async () => {
    server.use(
      http.post('/api/v1/studygroup/groups', () => HttpResponse.error())
    )
    const user = userEvent.setup()
    await goToLastStepWithValidForm(user)

    await user.click(screen.getByRole('button', { name: '완료' }))

    expect(
      await screen.findByText(
        '스터디 생성에 실패했어요. 잠시 후 다시 시도해주세요.'
      )
    ).toBeInTheDocument()
  })
})
