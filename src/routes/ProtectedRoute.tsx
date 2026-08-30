import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore, useIsAuthenticated } from '../stores/authStore'
import { hasSeenOnboarding } from '../utils/onboarding'

// 로그인이 필요한 화면을 감싸는 라우트 가드
// - 소셜 로그인만 끝나고 프로필이 없으면 회원가입으로
// - 아예 로그인 전이면 첫 방문은 온보딩, 재방문은 로그인으로
export default function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated()
  const needsProfile = useAuthStore(state => state.needsProfile)
  const location = useLocation()

  if (isAuthenticated) {
    return <Outlet />
  }

  if (needsProfile) {
    return <Navigate to="/auth/signup" replace />
  }

  const target = hasSeenOnboarding() ? '/auth/login' : '/auth/onboarding'
  // 로그인 후 원래 가려던 곳으로 돌려보내기 위해 위치를 남겨둡니다.
  return <Navigate to={target} replace state={{ from: location.pathname }} />
}
