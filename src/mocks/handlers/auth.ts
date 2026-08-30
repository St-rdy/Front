import { http } from 'msw'
import { ok, fail } from '../envelope'
import type { AuthUser, SocialProvider } from '../../types/auth'

// 이미 사용 중인 닉네임 (중복확인 데모용)
const TAKEN_NICKNAMES = ['엄박봉', 'stardy', 'admin']

// 목 서버가 기억하는 현재 계정.
// 회원가입을 마치기 전에는 null이라 소셜 로그인 시 신규 가입 흐름으로 보냅니다.
let currentUser: AuthUser | null = null
let nextUserId = 1

// 테스트에서 계정 상태를 초기화할 때 사용합니다.
export function resetAuthMock(user: AuthUser | null = null) {
  currentUser = user
  nextUserId = user ? user.id + 1 : 1
}

export function getAuthMockUser() {
  return currentUser
}

export const authHandlers = [
  // 소셜 로그인
  http.post('/api/v1/auth/social-login', async ({ request }) => {
    const body = (await request.json()) as { provider?: SocialProvider }
    const provider = body?.provider ?? 'kakao'

    // 이미 프로필이 등록된 계정이면 바로 로그인, 아니면 회원가입 단계로 보냅니다.
    if (currentUser) {
      return ok({
        accessToken: `mock-access-token-${provider}`,
        isNewUser: false,
        user: { ...currentUser, provider },
      })
    }

    return ok({
      accessToken: `mock-access-token-${provider}`,
      isNewUser: true,
      user: null,
    })
  }),

  // 닉네임 중복 확인
  http.get('/api/v1/auth/nickname-check', ({ request }) => {
    const nickname = new URL(request.url).searchParams.get('nickname') ?? ''

    if (nickname.trim() === '') {
      return ok({ available: false, message: '닉네임을 입력해주세요.' })
    }
    if (TAKEN_NICKNAMES.includes(nickname)) {
      return ok({ available: false, message: '이미 사용 중인 닉네임이에요.' })
    }
    return ok({ available: true, message: '사용할 수 있는 닉네임이에요.' })
  }),

  // 프로필 등록 (회원가입 완료)
  http.post('/api/v1/auth/signup', async ({ request }) => {
    const body = (await request.json()) as { name?: string; nickname?: string }

    if (!body?.name?.trim() || !body?.nickname?.trim()) {
      return fail(400, 'INVALID_PROFILE', '이름과 닉네임을 모두 입력해주세요.')
    }

    currentUser = {
      id: nextUserId++,
      name: body.name,
      nickname: body.nickname,
      provider: 'kakao',
    }
    return ok(currentUser, { status: 201, code: 'CREATED' })
  }),

  // 내 계정 조회
  http.get('/api/v1/auth/me', ({ request }) => {
    if (!request.headers.get('Authorization')) {
      return fail(401, 'UNAUTHORIZED', '로그인이 필요합니다.')
    }
    if (!currentUser) {
      return fail(404, 'USER_NOT_FOUND', '가입 정보를 찾을 수 없습니다.')
    }
    return ok(currentUser)
  }),

  // 로그아웃 (계정 자체는 목 서버에 남겨 재로그인 흐름을 확인할 수 있게 합니다)
  http.post('/api/v1/auth/logout', () => ok({ success: true })),
]
