import React, { useId } from 'react'
import type { SelectButtonProps } from './SelectButton.types'
import styles from './SelectButton.module.css'

const SelectButton: React.FC<SelectButtonProps> = ({
  variant = 'solid',
  color = 'primary',
  btnsize = 'medium',
  state = 'active',
  type = 'checkbox',
  children,
  className,
  id,
  ...props
}) => {
  const generatedId = useId()
  const inputId = id || generatedId
  const isDisabled = state === 'inactive'

  return (
    <div className={styles.wrapper}>
      <input
        type={type}
        id={inputId}
        className={styles.hiddenInput}
        disabled={isDisabled}
        {...props} // 여기서 checked, onChange 등이 전달됨
      />
      <label
        htmlFor={inputId}
        className={`
          ${styles.selectBtn} 
          ${styles[variant]} 
          ${styles[color]} 
          ${styles[btnsize]} 
          ${className || ''}
        `}
      >
        {children}
      </label>
    </div>
  )
}

export default SelectButton
