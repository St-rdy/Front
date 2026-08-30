import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  clearToken,
  setToken,
  setUnauthorizedHandler,
  getToken,
} from '../api/token'
import type { AuthUser } from '../types/auth'

interface AuthState {
  user: AuthUser | null
  // 소셜 로그인은 끝났지만 아직 프로필(이름/닉네임)을 등록하지 않은 상태
  needsProfile: boolean

  signIn: (accessToken: string, user: AuthUser | null) => void
  completeProfile: (user: AuthUser) => void
  signOut: () => void
  // 로그인 여부: 토큰과 프로필이 모두 있어야 인증 완료로 봅니다.
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      needsProfile: false,

      signIn: (accessToken, user) => {
        setToken(accessToken)
        set({ user, needsProfile: user === null })
      },

      completeProfile: user => set({ user, needsProfile: false }),

      signOut: () => {
        clearToken()
        set({ user: null, needsProfile: false })
      },

      isAuthenticated: () => getToken() !== null && get().user !== null,
    }),
    {
      name: 'stardy.auth',
      // 토큰은 token.ts가 따로 관리하므로 사용자 정보만 저장합니다.
      partialize: state => ({
        user: state.user,
        needsProfile: state.needsProfile,
      }),
    }
  )
)

// 401 응답을 받으면 로그인 상태를 비웁니다.
setUnauthorizedHandler(() => {
  useAuthStore.setState({ user: null, needsProfile: false })
})

// 컴포넌트에서 쓰는 로그인 여부 훅.
// user를 구독하므로 로그인/로그아웃 시 화면이 다시 그려집니다.
export function useIsAuthenticated(): boolean {
  const user = useAuthStore(state => state.user)
  return user !== null && getToken() !== null
}
