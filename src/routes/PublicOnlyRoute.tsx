import { Navigate, Outlet } from 'react-router-dom'
import { useIsAuthenticated } from '../stores/authStore'

// 로그인한 사용자가 온보딩/로그인 화면으로 되돌아가지 않게 막습니다.
export default function PublicOnlyRoute() {
  const isAuthenticated = useIsAuthenticated()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
