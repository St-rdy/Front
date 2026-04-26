import React from 'react'
import SocialLoginButton from '../../../components/SocialLoginButton/SocialLoginButton'
import './LoginPage.css'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  function handleClick(props: string) {
    if (props === 'kakao') {
      console.log('카카오 로그인')
    }
    if (props === 'naver') {
      console.log('네이버 로그인')
    }
    if (props === 'google') {
      console.log('구글 로그인')
    }
    navigate('/auth/signup')
  }
  return (
    <div className="login-container">
      <div>
        <div className="login-title-container">
          <div className="login-title">
            <span className="login-title-highlight">공부</span>를 시작할 준비가
            되셨나요?
          </div>
          <div className="login-sub-title">나만의 스터디 여정을 시작하세요</div>
        </div>
        <img
          src="/Auth/Login/login_image.svg"
          alt="공부 이미지"
          className="login-image"
        />
      </div>
      <div className="login-button-container">
        <SocialLoginButton
          variant="kakao"
          onClick={() => handleClick('kakao')}
        />
        <SocialLoginButton
          variant="naver"
          onClick={() => handleClick('naver')}
        />
        <SocialLoginButton
          variant="google"
          onClick={() => handleClick('google')}
        />
      </div>
    </div>
  )
}
