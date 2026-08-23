import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../../mocks/server'
import { renderWithProviders } from '../../../test/renderWithProviders'
import ChatRoom from './ChatRoom'

function renderChatRoom(id = '1') {
  return renderWithProviders(<ChatRoom />, {
    route: `/chat/${id}`,
    path: '/chat/:id',
  })
}

describe('ChatRoom 페이지 - 상태', () => {
  it('데이터를 불러오는 동안 로딩 메시지를 보여준다', () => {
    renderChatRoom()
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument()
  })

  it('존재하지 않는 방이면 에러 메시지를 보여준다', async () => {
    renderChatRoom('999')
    expect(
      await screen.findByText('채팅방을 불러오지 못했습니다.')
    ).toBeInTheDocument()
  })
})

describe('ChatRoom 페이지 - 대화 내용', () => {
  it('채팅방 이름이 헤더에 표시된다', async () => {
    renderChatRoom()
    expect(await screen.findByText('코딩테스트 스터디')).toBeInTheDocument()
  })

  it('기존 메시지와 시간이 표시된다', async () => {
    renderChatRoom()
    expect(
      await screen.findByText('다들 오늘 문제 푸셨나요?')
    ).toBeInTheDocument()
    expect(screen.getByText('12:21')).toBeInTheDocument()
  })

  it('상대방 메시지에는 보낸 사람 이름이 붙는다', async () => {
    renderChatRoom()
    expect(await screen.findAllByText('태범')).toHaveLength(2)
  })
})

describe('ChatRoom 페이지 - 메시지 전송', () => {
  it('입력 전에는 전송 버튼이 비활성화된다', async () => {
    renderChatRoom()
    await screen.findByText('다들 오늘 문제 푸셨나요?')
    expect(screen.getByRole('button', { name: '메시지 전송' })).toBeDisabled()
  })

  it('메시지를 보내면 대화 목록에 추가된다', async () => {
    const user = userEvent.setup()
    renderChatRoom()
    await screen.findByText('다들 오늘 문제 푸셨나요?')

    await user.type(
      screen.getByPlaceholderText('메시지를 입력하세요'),
      '저도 다 풀었어요'
    )
    await user.click(screen.getByRole('button', { name: '메시지 전송' }))

    expect(await screen.findByText('저도 다 풀었어요')).toBeInTheDocument()
  })

  it('전송 후 입력창이 비워진다', async () => {
    const user = userEvent.setup()
    renderChatRoom()
    await screen.findByText('다들 오늘 문제 푸셨나요?')

    const input = screen.getByPlaceholderText('메시지를 입력하세요')
    await user.type(input, '내일 봬요{Enter}')

    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('전송이 실패해도 화면이 깨지지 않는다', async () => {
    server.use(
      http.post('/api/v1/chat/rooms/:id/messages', () => HttpResponse.error())
    )
    const user = userEvent.setup()
    renderChatRoom()
    await screen.findByText('다들 오늘 문제 푸셨나요?')

    await user.type(
      screen.getByPlaceholderText('메시지를 입력하세요'),
      '실패할 메시지{Enter}'
    )

    // 기존 대화는 그대로 남아 있습니다.
    expect(screen.getByText('다들 오늘 문제 푸셨나요?')).toBeInTheDocument()
  })
})
