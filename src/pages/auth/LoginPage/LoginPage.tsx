import React from 'react'
import SocialLoginButton from '../../../components/SocialLoginButton/SocialLoginButton'

export default function LoginPage() {
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
  }
  return (
    <>
      <SocialLoginButton variant="kakao" onClick={() => handleClick('kakao')} />
      <SocialLoginButton variant="naver" onClick={() => handleClick('naver')} />
      <SocialLoginButton
        variant="google"
        onClick={() => handleClick('google')}
      />
    </>
  )
}
