import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import List from './List'
import '@testing-library/jest-dom'
import type { ChatItem, PostItem } from './List.types'
import chatItem from './__mocks__/chatItems.json'
import postItem from './__mocks__/postItems.json'

const chatItems: ChatItem[] = chatItem
const postItems: PostItem[] = postItem

// 기본 렌더링 테스트
describe('List 컴포넌트 - 기본 렌더링', () => {
  it('chat variant로 렌더링 된다', () => {
    render(<List variant="chat" items={chatItems} />) // 채팅을 렌더링 한 뒤
    expect(screen.getByRole('list')).toBeInTheDocument() // 리스트 역할을 하는 요소가 있는지 검사
  })

  it('post variant로 렌더링 된다', () => {
    render(<List variant="post" items={postItems} />) // 게시글을 렌더링 한 뒤
    expect(screen.getByRole('list')).toBeInTheDocument() // 리스트 역할을 하는 요소가 있는지
  })
})

// ─── 빈 상태 ──────────────────────────────────────────────────

describe('List 컴포넌트 - 빈 상태', () => {
  it('items가 없을 때 기본 emptyMessage를 보여준다', () => {
    render(<List variant="chat" items={[]} />) // 아이템이 비어 있을 때
    expect(screen.getByText('목록이 없습니다.')).toBeInTheDocument() // 빈 메시지를 보여주는 지
  })

  it('emptyMessage prop을 전달하면 해당 메시지를 보여준다', () => {
    // emptyMessage를 전달 했을 때
    render(<List variant="chat" items={[]} emptyMessage="채팅이 없어요" />)
    expect(screen.getByText('채팅이 없어요')).toBeInTheDocument() // 전달한 메시지를 보여주는 지
  })
})

// ─── Chat variant ─────────────────────────────────────────────

describe('List 컴포넌트 - chat variant', () => {
  it('모든 채팅 아이템의 name, lastMessage가 렌더링된다', () => {
    // 채팅 아이템이 렌더링 되는지
    render(<List variant="chat" items={chatItems} />)

    expect(screen.getByText('홍길동')).toBeInTheDocument()
    expect(screen.getByText('안녕하세요!')).toBeInTheDocument()
    expect(screen.getByText('김철수')).toBeInTheDocument()
    expect(screen.getByText('오늘 스터디 몇 시예요?')).toBeInTheDocument()
  })

  it('timestamp가 오전/오후 형식으로 변환되어 표시된다', () => {
    // 시간이 오전 / 오후 형식으로 변환 되는지
    render(<List variant="chat" items={chatItems} />)
    // '10:30' → '오전 10:30', '09:15' → '오전 09:15'
    expect(screen.getByText('오전 10:30')).toBeInTheDocument()
    expect(screen.getByText('오전 09:15')).toBeInTheDocument()
  })

  it('오후 시간도 올바르게 변환된다', () => {
    const afternoonItems: ChatItem[] = [
      { id: 1, name: '테스트', lastMessage: '안녕', timestamp: '14:30' },
    ]
    render(<List variant="chat" items={afternoonItems} />)
    expect(screen.getByText('오후 02:30')).toBeInTheDocument()
  })

  it('HH:MM 형식이 아닌 timestamp는 그대로 표시된다', () => {
    // 잘못된 타임을 가지는 아이템은 그대로 렌더링 되는지
    const otherItems: ChatItem[] = [
      { id: 1, name: '테스트', lastMessage: '안녕', timestamp: '어제' },
    ]
    render(<List variant="chat" items={otherItems} />)
    expect(screen.getByText('어제')).toBeInTheDocument()
  })

  it('unreadCount가 있을 때 읽지 않은 메시지 수가 표시된다', () => {
    // 읽지 않은 메시지 검사
    render(<List variant="chat" items={chatItems} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('unreadCount가 없으면 뱃지가 표시되지 않는다', () => {
    const noUnread: ChatItem[] = [
      { id: 1, name: '김철수', lastMessage: '안녕', timestamp: '09:00' },
    ]
    render(<List variant="chat" items={noUnread} />)
    expect(screen.queryByTestId('unread-badge')).not.toBeInTheDocument()
  })

  it('avatar가 있으면 이미지가 렌더링된다', () => {
    render(<List variant="chat" items={chatItems} />)
    const img = screen.getByAltText('홍길동 아바타')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/avatars/hong.png')
  })

  it('아이템 클릭 시 onItemClick이 해당 아이템과 함께 호출된다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<List variant="chat" items={chatItems} onItemClick={handleClick} />)
    await user.click(screen.getByText('홍길동'))

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith(chatItems[0])
  })
})

// 게시글 아이템 테스트
describe('List 컴포넌트 - post variant', () => {
  it('모든 게시글 아이템의 title, detail이 렌더링된다', () => {
    render(<List variant="post" items={postItems} />)

    expect(screen.getByText('React TDD 정리')).toBeInTheDocument()
    expect(screen.getByText('오늘 TDD를 공부했습니다...')).toBeInTheDocument()
    expect(screen.getByText('Vitest 입문')).toBeInTheDocument()
  })

  it('작성자 이름과 timestamp가 하단 좌측에 렌더링된다', () => {
    render(<List variant="post" items={postItems} />)

    expect(screen.getByText('이영희')).toBeInTheDocument()
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
  })

  it('작성자 avatar가 있으면 하단에 작은 이미지로 렌더링된다', () => {
    render(<List variant="post" items={postItems} />)
    const img = screen.getByAltText('이영희 아바타')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/avatars/lee.png')
    expect(img).toHaveClass('list-item__author-avatar')
  })

  it('thumbnail이 있으면 이미지가 렌더링된다', () => {
    render(<List variant="post" items={postItems} />)
    const img = screen.getByAltText('React TDD 정리 썸네일')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/thumbnails/react.png')
  })

  it('thumbnail이 없으면 이미지가 렌더링되지 않는다', () => {
    render(<List variant="post" items={postItems} />)
    expect(screen.queryByAltText('Vitest 입문 썸네일')).not.toBeInTheDocument()
  })

  it('likes와 comments가 하단 우측에 표시된다', () => {
    render(<List variant="post" items={postItems} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('tag가 있으면 모든 태그가 표시된다', () => {
    render(<List variant="post" items={postItems} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TDD')).toBeInTheDocument()
  })

  it('아이템 클릭 시 onItemClick이 해당 아이템과 함께 호출된다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<List variant="post" items={postItems} onItemClick={handleClick} />)
    await user.click(screen.getByText('React TDD 정리'))

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith(postItems[0])
  })
})
