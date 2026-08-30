import { useMutation, useQueryClient } from '@tanstack/react-query'
import { checkNickname, logout, signUp, socialLogin } from '../api/auth'
import { useAuthStore } from '../stores/authStore'

// 소셜 로그인 → 토큰 저장까지 처리합니다.
// 결과의 isNewUser로 회원가입 화면으로 보낼지 홈으로 보낼지 결정합니다.
export function useSocialLogin() {
  const signIn = useAuthStore(state => state.signIn)

  return useMutation({
    mutationFn: socialLogin,
    onSuccess: result => {
      signIn(result.accessToken, result.user)
    },
  })
}

// 닉네임 중복 확인
export function useCheckNickname() {
  return useMutation({
    mutationFn: checkNickname,
  })
}

// 프로필 등록 (회원가입 완료)
export function useSignUp() {
  const completeProfile = useAuthStore(state => state.completeProfile)

  return useMutation({
    mutationFn: signUp,
    onSuccess: user => {
      completeProfile(user)
    },
  })
}

// 로그아웃 → 토큰/사용자 정보와 캐시를 모두 비웁니다.
export function useLogout() {
  const signOut = useAuthStore(state => state.signOut)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    // 서버 호출이 실패해도 클라이언트 세션은 정리합니다.
    onSettled: () => {
      signOut()
      queryClient.clear()
    },
  })
}
