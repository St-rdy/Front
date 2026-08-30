// 온보딩을 이미 본 적이 있는지 기억합니다.
// 디자인상 온보딩은 "가장 처음 접속시 나오는 화면"이라, 처음 방문에만 보여줍니다.

const SEEN_KEY = 'stardy.onboardingSeen'

export function hasSeenOnboarding(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === 'true'
  } catch {
    return false
  }
}

export function markOnboardingSeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, 'true')
  } catch {
    // 무시
  }
}
