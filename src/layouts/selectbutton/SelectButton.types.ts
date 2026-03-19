import React from 'react'

export type SelectButtonVariant = 'solid' | 'outline'
export type SelectButtonColor = 'primary' | 'secondary'
export type SelectButtonSize = 'small' | 'medium' | 'large'
export type SelectButtonState = 'active' | 'inactive'

export interface SelectButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: SelectButtonVariant
  color?: SelectButtonColor
  btnsize?: SelectButtonSize
  state?: SelectButtonState
  type?: 'checkbox' | 'radio'
}
