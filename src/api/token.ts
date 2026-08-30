// 액세스 토큰 저장소
// authStore와 axios 인터셉터가 함께 사용합니다.
// (store -> client -> store 순환 참조를 막기 위해 별도 모듈로 분리)

const TOKEN_KEY = 'stardy.accessToken'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    // 프라이빗 모드 등 localStorage 접근이 막힌 환경
    return null
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // 저장 실패해도 메모리 상태(zustand)는 유지되므로 세션은 이어집니다.
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // 무시
  }
}

// 401 응답을 받았을 때 실행할 콜백 (authStore가 등록)
let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler
}

export function notifyUnauthorized(): void {
  unauthorizedHandler?.()
}
