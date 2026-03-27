export type SocialVariant = 'kakao' | 'naver' | 'google'

export interface SocialLoginButtonProps {
  variant: SocialVariant
  onClick: () => void
}
