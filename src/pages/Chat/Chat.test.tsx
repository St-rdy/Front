import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Route } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { renderWithProviders } from '../../test/renderWithProviders'
import Chat from './Chat'

function renderChat() {
  return renderWithProviders(<Chat />, {
    route: '/chat',
    path: '/chat',
    extraRoutes: <Route path="/chat/:id" element={<div>채팅방 화면</div>} />,
  })
}

describe('Chat 페이지 - 상태', () => {
  it('데이터를 불러오는 동안 로딩 메시지를 보여준다', () => {
    renderChat()
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument()
  })

  it('API 실패 시 에러 메시지를 보여준다', async () => {
    server.use(http.get('/api/v1/chat/rooms', () => HttpResponse.error()))
    renderChat()
    expect(
      await screen.findByText('데이터를 불러오지 못했습니다.')
    ).toBeInTheDocument()
  })
})

describe('Chat 페이지 - 목록', () => {
  it('채팅방 이름과 마지막 메시지가 표시된다', async () => {
    renderChat()
    expect(await screen.findByText('코딩테스트 스터디')).toBeInTheDocument()
    expect(
      screen.getByText('내일 오전 9시에 모여서 같이 문제 풀어요!')
    ).toBeInTheDocument()
  })

  it('읽지 않은 메시지 수가 뱃지로 표시된다', async () => {
    renderChat()
    await screen.findByText('코딩테스트 스터디')
    // 읽지 않은 메시지가 있는 방은 2개(3건, 1건)입니다.
    expect(screen.getAllByTestId('unread-badge')).toHaveLength(2)
  })

  it('시간이 오전/오후 형식으로 변환된다', async () => {
    renderChat()
    expect(await screen.findByText('오후 02:30')).toBeInTheDocument()
  })

  it('채팅방을 클릭하면 해당 채팅방으로 이동한다', async () => {
    const user = userEvent.setup()
    renderChat()
    await user.click(await screen.findByText('코딩테스트 스터디'))

    expect(await screen.findByText('채팅방 화면')).toBeInTheDocument()
  })

  it('참여 중인 채팅방이 없으면 빈 상태 문구를 보여준다', async () => {
    server.use(
      http.get('/api/v1/chat/rooms', () =>
        HttpResponse.json({
          status: 200,
          code: 'SUCCESS',
          message: '조회 성공',
          data: [],
        })
      )
    )
    renderChat()
    expect(
      await screen.findByText('아직 참여 중인 채팅방이 없어요')
    ).toBeInTheDocument()
  })
})
