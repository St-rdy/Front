import React from 'react'
import type { ButtonProps } from './'
import styles from './Button.module.css'

const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  color = 'primary',
  size = 'medium',
  state = 'active',
  children,
  ...props
}) => {
  const isDisabled = state === 'inactive' || state === 'loading'

  // 솔리드/아웃라인에 따른 다른 로딩바
  const loadingSrc =
    variant === 'solid'
      ? '/Button/solid_loading.svg'
      : '/Button/outline_loading.svg'

  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[color]} ${styles[size]} ${styles[state]}`}
      disabled={isDisabled}
      {...props}
    >
      {state === 'loading' ? (
        <img src={loadingSrc} alt="loading" className={styles.spinner} />
      ) : (
        children
      )}
    </button>
  )
}
export default Button
