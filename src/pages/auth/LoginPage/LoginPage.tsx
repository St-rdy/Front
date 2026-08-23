import SocialLoginButton from '../../../components/SocialLoginButton/SocialLoginButton'
import './LoginPage.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSocialLogin } from '../../../hooks/useAuth'
import type { SocialProvider } from '../../../types/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useSocialLogin()

  // 보호된 화면에서 튕겨온 경우 원래 가려던 곳으로 돌려보냅니다.
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  function handleClick(provider: SocialProvider) {
    login.mutate(provider, {
      onSuccess: result => {
        // 프로필이 없는 신규 계정이면 회원가입 화면으로
        navigate(result.isNewUser ? '/auth/signup' : from, { replace: true })
      },
    })
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
        {login.isError && (
          <p className="login-error" role="alert">
            로그인에 실패했어요. 잠시 후 다시 시도해주세요.
          </p>
        )}
        <SocialLoginButton
          variant="kakao"
          onClick={() => handleClick('kakao')}
          disabled={login.isPending}
        />
        <SocialLoginButton
          variant="naver"
          onClick={() => handleClick('naver')}
          disabled={login.isPending}
        />
        <SocialLoginButton
          variant="google"
          onClick={() => handleClick('google')}
          disabled={login.isPending}
        />
      </div>
    </div>
  )
}
