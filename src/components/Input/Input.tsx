import { forwardRef } from 'react'
import type { InputProps } from './Input.types'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      rightAction,
      isInvalid = false,
      isRequired = false,
      variant = 'outline',
      size = 'md',
      className = '',
      ...rest
    },
    ref
  ) => {
    const inputClassName = [
      'input',
      `input-${variant}`,
      `input-${size}`,
      isInvalid ? 'input-invalid' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')
    return (
      <>
        {/* 전체 버튼 클래스 */}
        <div className={className}>
          {label && <label>{label}</label>}
          <div className="input-wrapper">
            <input
              ref={ref}
              //   상태에 따라 input 클래스의 스타일을 적용
              className={inputClassName}
              required={isRequired}
              aria-invalid={isInvalid}
              {...rest}
            />
            {rightAction && (
              <button
                type="button"
                className="input-action-button"
                onClick={rightAction.onClick}
                disabled={rightAction.loading}
              ></button>
            )}
            {error && <p className="input-error">{error}</p>}
          </div>
        </div>
      </>
    )
  }
)
