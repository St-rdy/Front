import apiClient from './client'
import type { ApiEnvelope } from './types'
import type {
  AuthUser,
  NicknameCheckResponse,
  SignUpForm,
  SocialLoginResponse,
  SocialProvider,
} from '../types/auth'

// 소셜 로그인 (실서비스에서는 provider별 OAuth 콜백 코드가 함께 전달됩니다)
export async function socialLogin(
  provider: SocialProvider
): Promise<SocialLoginResponse> {
  const { data } = await apiClient.post<ApiEnvelope<SocialLoginResponse>>(
    '/auth/social-login',
    { provider }
  )
  return data.data
}

// 닉네임 중복 확인
export async function checkNickname(
  nickname: string
): Promise<NicknameCheckResponse> {
  const { data } = await apiClient.get<ApiEnvelope<NicknameCheckResponse>>(
    '/auth/nickname-check',
    { params: { nickname } }
  )
  return data.data
}

// 프로필 등록 (회원가입 마무리)
export async function signUp(form: SignUpForm): Promise<AuthUser> {
  const { data } = await apiClient.post<ApiEnvelope<AuthUser>>(
    '/auth/signup',
    form
  )
  return data.data
}

// 내 정보 조회
export async function fetchMe(): Promise<AuthUser> {
  const { data } = await apiClient.get<ApiEnvelope<AuthUser>>('/auth/me')
  return data.data
}

// 로그아웃
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}
