import type { InputHTMLAttributes } from 'react'

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  // 기본 props
  label?: string
  error?: string

  // 오른쪽 액션 버튼 (중복 확인)
  rightAction?: {
    label: string
    onClick: () => void
    loading?: boolean
  }

  // 상태관련 props
  isInvalid?: boolean
  isRequired?: boolean

  // 스타일 관련 props
  variant?: 'outline' | 'filled' | 'flushed' | 'unstyled'
  size?: 'sm' | 'md' | 'lg'
}
