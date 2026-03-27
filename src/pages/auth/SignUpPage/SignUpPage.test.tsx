import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import SignUpPage from './SignUpPage'

const mockNavigate = vi.fn()

// navigate 함수를 모킹하여 테스트에서 사용할 수 있도록 수정
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}))

const renderSignUpPage = () => {
  return render(
    <MemoryRouter>
      <SignUpPage />
    </MemoryRouter>
  )
}

describe('회원가입페이지 테스트', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  describe('랜더링 테스트', () => {
    it('제목이 랜더링 되어야 한다.', () => {
      renderSignUpPage()
      expect(screen.getByText('처음이신가요?')).toBeInTheDocument()
    })
    it('부제목이 랜더링 되어야 한다.', () => {
      renderSignUpPage()
      expect(
        screen.getByText(
          '스터디와 커뮤니티에서 사용할 이름과 닉네임을 알려주세요'
        )
      ).toBeInTheDocument()
    })
    it('이름 input이 랜더링 되어야 한다.', () => {
      renderSignUpPage()
      expect(
        screen.getByPlaceholderText('이름을 입력해주세요.')
      ).toBeInTheDocument()
    })
    it('닉네임 input이 랜더링 되어야 한다.', () => {
      renderSignUpPage()
      expect(
        screen.getByPlaceholderText('닉네임을 입력해주세요.')
      ).toBeInTheDocument()
    })
    it('입력했어요 버튼이 랜더링 되어야 한다.', () => {
      renderSignUpPage()
      expect(screen.getByText('입력했어요')).toBeInTheDocument()
    })
  })

  describe('닉네임 유효성 검사', () => {
    it('닉네임 미입력 상태에서 중복확인 클릭 시 에러 메시지가 표시된다', async () => {
      const user = userEvent.setup()
      renderSignUpPage()
      await user.click(screen.getByRole('button', { name: '중복확인' }))
      expect(screen.getByText('닉네임을 입력해주세요.')).toBeInTheDocument()
    })

    it('닉네임 3자 미만 입력 후 중복확인 클릭 시 에러 메시지가 표시된다', async () => {
      const user = userEvent.setup()
      renderSignUpPage()
      await user.type(
        screen.getByPlaceholderText('닉네임을 입력해주세요.'),
        'ab'
      )
      await user.click(screen.getByRole('button', { name: '중복확인' }))
      expect(
        screen.getByText('닉네임은 3자 이상이어야 합니다.')
      ).toBeInTheDocument()
    })

    it('닉네임 20자 초과 입력 후 중복확인 클릭 시 에러 메시지가 표시된다', async () => {
      const user = userEvent.setup()
      renderSignUpPage()
      await user.type(
        screen.getByPlaceholderText('닉네임을 입력해주세요.'),
        'a'.repeat(21)
      )
      await user.click(screen.getByRole('button', { name: '중복확인' }))
      expect(
        screen.getByText('닉네임은 20자 미만이어야 합니다.')
      ).toBeInTheDocument()
    })

    it('유효한 닉네임 입력 후 중복확인 클릭 시 에러 메시지가 사라진다', async () => {
      const user = userEvent.setup()
      renderSignUpPage()
      await user.type(
        screen.getByPlaceholderText('닉네임을 입력해주세요.'),
        'validNick'
      )
      await user.click(screen.getByRole('button', { name: '중복확인' }))
      expect(
        screen.queryByText('닉네임을 입력해주세요.')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText('닉네임은 3자 이상이어야 합니다.')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText('닉네임은 20자 미만이어야 합니다.')
      ).not.toBeInTheDocument()
    })
  })

  describe('제출 버튼 활성화 조건', () => {
    it('이름만 입력 시 제출 버튼이 비활성화된다', async () => {
      const user = userEvent.setup()
      renderSignUpPage()
      await user.type(
        screen.getByPlaceholderText('이름을 입력해주세요.'),
        '홍길동'
      )
      expect(screen.getByRole('button', { name: '입력했어요' })).toBeDisabled()
    })

    it('닉네임만 입력 시 제출 버튼이 비활성화된다', async () => {
      const user = userEvent.setup()
      renderSignUpPage()
      await user.type(
        screen.getByPlaceholderText('닉네임을 입력해주세요.'),
        'validNick'
      )
      expect(screen.getByRole('button', { name: '입력했어요' })).toBeDisabled()
    })

    it('이름과 닉네임 입력 후 중복확인을 안 하면 제출 버튼이 비활성화된다', async () => {
      const user = userEvent.setup()
      renderSignUpPage()
      await user.type(
        screen.getByPlaceholderText('이름을 입력해주세요.'),
        '홍길동'
      )
      await user.type(
        screen.getByPlaceholderText('닉네임을 입력해주세요.'),
        'validNick'
      )
      expect(screen.getByRole('button', { name: '입력했어요' })).toBeDisabled()
    })

    it('이름, 닉네임 입력 후 중복확인 완료 시 제출 버튼이 활성화된다', async () => {
      const user = userEvent.setup()
      renderSignUpPage()
      await user.type(
        screen.getByPlaceholderText('이름을 입력해주세요.'),
        '홍길동'
      )
      await user.type(
        screen.getByPlaceholderText('닉네임을 입력해주세요.'),
        'validNick'
      )
      await user.click(screen.getByRole('button', { name: '중복확인' }))
      expect(
        screen.getByRole('button', { name: '입력했어요' })
      ).not.toBeDisabled()
    })
  })

  describe('페이지 이동', () => {
    it('제출 버튼 클릭 시 완료 페이지로 이동한다', async () => {
      const user = userEvent.setup()
      renderSignUpPage()
      await user.type(
        screen.getByPlaceholderText('이름을 입력해주세요.'),
        '홍길동'
      )
      await user.type(
        screen.getByPlaceholderText('닉네임을 입력해주세요.'),
        'validNick'
      )
      await user.click(screen.getByRole('button', { name: '중복확인' }))
      await user.click(screen.getByRole('button', { name: '입력했어요' }))
      expect(mockNavigate).toHaveBeenCalledWith('/auth/signup-complete')
    })

    it('중복확인을 안 한 상태에서 제출 버튼 클릭 시 페이지 이동이 되지 않는다', async () => {
      const user = userEvent.setup()
      renderSignUpPage()
      await user.type(
        screen.getByPlaceholderText('이름을 입력해주세요.'),
        '홍길동'
      )
      await user.type(
        screen.getByPlaceholderText('닉네임을 입력해주세요.'),
        'validNick'
      )
      await user.click(screen.getByRole('button', { name: '입력했어요' }))
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
})
