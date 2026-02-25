// Input.tsx

// forwardRef를 사용하여 부모 컴포넌트에서 자식 컴포넌트의 ref에 접근할 수 있도록 함
import { forwardRef } from 'react'
import type { InputProps } from './Input.types'
import './Input.css'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label, // label로 입력 필드에 대한 설명
      error, // 에러가 발생 했을 때 표시할 메세지
      rightAction, // 오른쪽 중복 확인 버튼
      isInvalid = false, // 입력값이 유효한가
      isRequired = false, // 필수 입력 여부
      variant = 'outline', // 스타일
      size = 'md', // 사이즈
      className = '', // 추가 클래스 이름
      ...rest // 나머지 input 속성
    },
    ref // 부모 컴포넌트에서 전달 받은 ref
  ) => {
    // 입력 필드의 클래스 이름을 상태에 따라 동적으로 생성하기 위해 생성
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
        <div className={`input-container ${className}`}>
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
