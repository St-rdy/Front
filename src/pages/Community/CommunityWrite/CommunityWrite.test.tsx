import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Route } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../../mocks/server'
import { renderWithProviders } from '../../../test/renderWithProviders'
import CommunityWrite from './CommunityWrite'

// 글 작성은 서버로 POST를 보내므로 React Query 컨텍스트가 필요합니다.
function renderCommunityWrite() {
  return renderWithProviders(<CommunityWrite />, {
    route: '/community/write',
    path: '/community/write',
    extraRoutes: <Route path="/community/:id" element={<div>상세 화면</div>} />,
  })
}

// 제목 + 본문을 채워 제출 가능한 상태로 만듭니다.
async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByPlaceholderText('제목을 입력하세요'),
    '새로 쓴 글 제목'
  )
  await user.type(
    screen.getByPlaceholderText(/공부 중 겪었던 고민이나 경험을 공유해주세요/),
    '새로 쓴 글 본문'
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

describe('CommunityWrite 페이지 - 등록 동작', () => {
  it('제목과 본문이 비어 있으면 완료 버튼이 비활성화된다', () => {
    renderCommunityWrite()
    expect(screen.getByRole('button', { name: '완료' })).toBeDisabled()
  })

  it('제목만 입력하면 완료 버튼이 여전히 비활성화된다', async () => {
    const user = userEvent.setup()
    renderCommunityWrite()
    await user.type(screen.getByPlaceholderText('제목을 입력하세요'), '제목만')
    expect(screen.getByRole('button', { name: '완료' })).toBeDisabled()
  })

  it('제목과 본문을 채우면 완료 버튼이 활성화된다', async () => {
    const user = userEvent.setup()
    renderCommunityWrite()
    await fillForm(user)
    expect(screen.getByRole('button', { name: '완료' })).not.toBeDisabled()
  })

  it('완료를 누르면 등록된 글의 상세 화면으로 이동한다', async () => {
    const user = userEvent.setup()
    renderCommunityWrite()
    await fillForm(user)

    await user.click(screen.getByRole('button', { name: '완료' }))

    expect(await screen.findByText('상세 화면')).toBeInTheDocument()
  })

  it('등록이 실패하면 에러 문구를 보여준다', async () => {
    server.use(http.post('/api/v1/community/posts', () => HttpResponse.error()))
    const user = userEvent.setup()
    renderCommunityWrite()
    await fillForm(user)

    await user.click(screen.getByRole('button', { name: '완료' }))

    expect(
      await screen.findByText(
        '글 등록에 실패했어요. 잠시 후 다시 시도해주세요.'
      )
    ).toBeInTheDocument()
  })
})
