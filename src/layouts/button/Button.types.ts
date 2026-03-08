import React from 'react'

export type ButtonVariant = 'solid' | 'outline'
export type ButtonColor = 'primary' | 'secondary'
export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonState = 'active' | 'inactive' | 'pressed' | 'loading'
// 버튼어트리뷰트에서 상속 받았음
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  color?: ButtonColor
  size?: ButtonSize
  state?: ButtonState
}
