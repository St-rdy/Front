import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import List from './List'
import '@testing-library/jest-dom'
import type { ChatItem, PostItem } from './List.types'

// ─── 목 데이터 ────────────────────────────────────────────────

const chatItems: ChatItem[] = [
  {
    id: 1,
    name: '홍길동',
    lastMessage: '안녕하세요!',
    timestamp: '10:30',
    unreadCount: 3,
    avatar: '/avatars/hong.png',
  },
  {
    id: 2,
    name: '김철수',
    lastMessage: '오늘 스터디 몇 시예요?',
    timestamp: '09:15',
  },
]

const postItems: PostItem[] = [
  {
    id: 1,
    name: '이영희',
    title: 'React TDD 정리',
    detail: '오늘 TDD를 공부했습니다...',
    timestamp: '2024-01-01',
    likes: 10,
    comments: 5,
    thumbnail: '/thumbnails/react.png',
    tag: ['React', 'TDD'],
    avatar: '/avatars/lee.png',
  },
  {
    id: 2,
    name: '박민수',
    title: 'Vitest 입문',
    detail: 'Vitest 사용법을 알아봅시다...',
    timestamp: '2024-01-02',
  },
]

// ─── 기본 렌더링 ──────────────────────────────────────────────

describe('List 컴포넌트 - 기본 렌더링', () => {
  test('chat variant로 렌더링 된다', () => {
    render(<List variant="chat" items={chatItems} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  test('post variant로 렌더링 된다', () => {
    render(<List variant="post" items={postItems} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
  })
})

// ─── 빈 상태 ──────────────────────────────────────────────────

describe('List 컴포넌트 - 빈 상태', () => {
  test('items가 없을 때 기본 emptyMessage를 보여준다', () => {
    render(<List variant="chat" items={[]} />)
    expect(screen.getByText('목록이 없습니다.')).toBeInTheDocument()
  })

  test('emptyMessage prop을 전달하면 해당 메시지를 보여준다', () => {
    render(<List variant="chat" items={[]} emptyMessage="채팅이 없어요" />)
    expect(screen.getByText('채팅이 없어요')).toBeInTheDocument()
  })
})

// ─── Chat variant ─────────────────────────────────────────────

describe('List 컴포넌트 - chat variant', () => {
  test('모든 채팅 아이템의 name, lastMessage가 렌더링된다', () => {
    render(<List variant="chat" items={chatItems} />)

    expect(screen.getByText('홍길동')).toBeInTheDocument()
    expect(screen.getByText('안녕하세요!')).toBeInTheDocument()
    expect(screen.getByText('김철수')).toBeInTheDocument()
    expect(screen.getByText('오늘 스터디 몇 시예요?')).toBeInTheDocument()
  })

  test('timestamp가 오전/오후 형식으로 변환되어 표시된다', () => {
    render(<List variant="chat" items={chatItems} />)
    // '10:30' → '오전 10:30', '09:15' → '오전 09:15'
    expect(screen.getByText('오전 10:30')).toBeInTheDocument()
    expect(screen.getByText('오전 09:15')).toBeInTheDocument()
  })

  test('오후 시간도 올바르게 변환된다', () => {
    const afternoonItems: ChatItem[] = [
      { id: 1, name: '테스트', lastMessage: '안녕', timestamp: '14:30' },
    ]
    render(<List variant="chat" items={afternoonItems} />)
    expect(screen.getByText('오후 02:30')).toBeInTheDocument()
  })

  test('HH:MM 형식이 아닌 timestamp는 그대로 표시된다', () => {
    const otherItems: ChatItem[] = [
      { id: 1, name: '테스트', lastMessage: '안녕', timestamp: '어제' },
    ]
    render(<List variant="chat" items={otherItems} />)
    expect(screen.getByText('어제')).toBeInTheDocument()
  })

  test('unreadCount가 있을 때 읽지 않은 메시지 수가 표시된다', () => {
    render(<List variant="chat" items={chatItems} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  test('unreadCount가 없으면 뱃지가 표시되지 않는다', () => {
    const noUnread: ChatItem[] = [
      { id: 1, name: '김철수', lastMessage: '안녕', timestamp: '09:00' },
    ]
    render(<List variant="chat" items={noUnread} />)
    expect(screen.queryByTestId('unread-badge')).not.toBeInTheDocument()
  })

  test('avatar가 있으면 이미지가 렌더링된다', () => {
    render(<List variant="chat" items={chatItems} />)
    const img = screen.getByAltText('홍길동 아바타')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/avatars/hong.png')
  })

  test('아이템 클릭 시 onItemClick이 해당 아이템과 함께 호출된다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<List variant="chat" items={chatItems} onItemClick={handleClick} />)
    await user.click(screen.getByText('홍길동'))

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith(chatItems[0])
  })
})

// ─── Post variant ─────────────────────────────────────────────

describe('List 컴포넌트 - post variant', () => {
  test('모든 게시글 아이템의 title, detail이 렌더링된다', () => {
    render(<List variant="post" items={postItems} />)

    expect(screen.getByText('React TDD 정리')).toBeInTheDocument()
    expect(screen.getByText('오늘 TDD를 공부했습니다...')).toBeInTheDocument()
    expect(screen.getByText('Vitest 입문')).toBeInTheDocument()
  })

  test('작성자 이름과 timestamp가 하단 좌측에 렌더링된다', () => {
    render(<List variant="post" items={postItems} />)

    expect(screen.getByText('이영희')).toBeInTheDocument()
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
  })

  test('작성자 avatar가 있으면 하단에 작은 이미지로 렌더링된다', () => {
    render(<List variant="post" items={postItems} />)
    const img = screen.getByAltText('이영희 아바타')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/avatars/lee.png')
    expect(img).toHaveClass('list-item__author-avatar')
  })

  test('thumbnail이 있으면 이미지가 렌더링된다', () => {
    render(<List variant="post" items={postItems} />)
    const img = screen.getByAltText('React TDD 정리 썸네일')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/thumbnails/react.png')
  })

  test('thumbnail이 없으면 이미지가 렌더링되지 않는다', () => {
    render(<List variant="post" items={postItems} />)
    expect(screen.queryByAltText('Vitest 입문 썸네일')).not.toBeInTheDocument()
  })

  test('likes와 comments가 하단 우측에 표시된다', () => {
    render(<List variant="post" items={postItems} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  test('tag가 있으면 모든 태그가 표시된다', () => {
    render(<List variant="post" items={postItems} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TDD')).toBeInTheDocument()
  })

  test('아이템 클릭 시 onItemClick이 해당 아이템과 함께 호출된다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<List variant="post" items={postItems} onItemClick={handleClick} />)
    await user.click(screen.getByText('React TDD 정리'))

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith(postItems[0])
  })
})
