import axios from 'axios'
import { clearToken, getToken, notifyUnauthorized } from './token'

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청마다 저장된 액세스 토큰을 Authorization 헤더에 실어 보냅니다.
apiClient.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401이면 토큰을 버리고 로그인 상태를 초기화합니다.
// (ProtectedRoute가 다음 렌더에서 온보딩으로 돌려보냅니다)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401) {
      clearToken()
      notifyUnauthorized()
    }
    return Promise.reject(error)
  }
)

export default apiClient
