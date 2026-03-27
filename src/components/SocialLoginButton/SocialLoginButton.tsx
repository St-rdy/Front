import React from 'react'
import type { SocialLoginButtonProps } from './SocialLoginButton.types'
import './SocialLoginButton.css'

const variantConfig = {
  kakao: {
    className: 'social-btn-kakao',
    icon: '/Auth/Login/kakao_logo.svg',
    label: '카카오 로그인',
  },
  naver: {
    className: 'social-btn-naver',
    icon: '/Auth/Login/naver_logo.svg',
    label: '네이버 로그인',
  },
  google: {
    className: 'social-btn-google',
    icon: '/Auth/Login/google_logo.svg',
    label: '구글 로그인',
  },
}

export default function SocialLoginButton({
  variant,
  onClick,
}: SocialLoginButtonProps) {
  const { className, icon, label } = variantConfig[variant]
  return (
    <>
      <button className={`social-login-button ${className}`} onClick={onClick}>
        <img
          src={icon}
          alt={`${variant} 아이콘`}
          className="social-login-icon"
        />
        <span>{label}</span>
      </button>
    </>
  )
}
