// 인증 도메인 타입

export type SocialProvider = 'kakao' | 'naver' | 'google'

export interface AuthUser {
  id: number
  name: string
  nickname: string
  avatar?: string
  provider: SocialProvider
}

// 소셜 로그인 응답
// isNewUser가 true면 프로필(이름/닉네임)을 아직 등록하지 않은 계정입니다.
export interface SocialLoginResponse {
  accessToken: string
  isNewUser: boolean
  user: AuthUser | null
}

export interface SignUpForm {
  name: string
  nickname: string
}

export interface NicknameCheckResponse {
  available: boolean
  message: string
}
