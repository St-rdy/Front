# Stardy Front

**Stardy**는 함께 공부할 사람을 찾고, 스터디를 운영하고, 학습 기록을 남기는 **모바일 웹 서비스**입니다.
이 저장소는 Stardy의 **프론트엔드**로, React 19 + TypeScript + Vite 기반 SPA입니다.

백엔드 없이도 전체 화면과 사용자 흐름을 확인할 수 있도록 **MSW로 API를 모킹**해 두었습니다.
`npm install && npm run dev` 만으로 온보딩 → 로그인 → 회원가입 → 글쓰기 → 스터디 신청까지 실제로 클릭해볼 수 있습니다.

- 디자인: [Figma - Stardy](https://www.figma.com/design/Z72xaC3fm3831Ev3u1MCx0/Stardy?node-id=287-84)
- 화면별 동작·유저플로우 상세 문서: [`STARDY-GUIDE.html`](./STARDY-GUIDE.html) (브라우저로 열어서 확인)

---

## 주요 기능

| 영역 | 내용 |
| --- | --- |
| 인증 | 온보딩, 소셜 로그인(카카오/네이버/구글 목업), 닉네임 중복 확인이 있는 회원가입, 가입 완료, 로그아웃 |
| 홈 | 오늘의 학습 요약, 진행 중인 스터디, 추천 커뮤니티 글, 각 카드에서 상세 화면으로 이동 |
| 커뮤니티 | 카테고리 필터·검색, 글 목록/상세, 글쓰기, 좋아요, 댓글 작성 |
| 스터디 그룹 | 그룹 목록, 카테고리 필터, 그룹 생성, 그룹 상세, 지원 동기를 적는 참여 신청 |
| 학습관리 | 학습 통계, 타이머, 목표 등록, 일정 등록/삭제, 캘린더 |
| 채팅 | 참여 중인 채팅방 목록, 채팅방(말풍선·전송·자동 스크롤) |
| 내정보 | 프로필/레벨·학습 게이지, 내가 쓴 게시물(삭제), 내가 쓴 댓글, 북마크(해제), 참여 스터디 |
| 알림 | 헤더 종 아이콘 → 알림 패널, 개별 읽음 / 모두 읽음 |

---

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| 코어 | React 19, TypeScript 5.9, Vite 7 |
| 라우팅 | react-router-dom 7 |
| 서버 상태 | TanStack Query v5 |
| 클라이언트 상태 | zustand 5 (`persist`) |
| HTTP | axios (요청/응답 인터셉터) |
| API 목업 | MSW 2 (브라우저 worker + 테스트 server) |
| 테스트 | Vitest 4, Testing Library, jsdom |
| 코드 품질 | ESLint 9, Prettier 3, husky + lint-staged |
| CI | GitHub Actions (lint → format → 타입체크 → 테스트 → 빌드) |
| 스타일 | 순수 CSS + CSS 커스텀 프로퍼티 디자인 토큰 |

---

## 시작하기

### 요구 사항

- Node.js **22.21.1** (`.nvmrc` 기준, `nvm use` 권장)
- npm

### 설치 및 실행

```bash
npm install
npm run dev      # http://localhost:5173
```

개발 모드(`import.meta.env.DEV`)에서는 `src/main.tsx`가 MSW worker를 먼저 띄운 뒤 앱을 렌더링합니다.
따라서 **별도 백엔드 서버 없이** 모든 화면이 동작합니다.

### 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 (MSW 목업 API 포함) |
| `npm run build` | 타입 체크(`tsc -b`) 후 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm test` | Vitest watch 모드 |
| `npm run test:ui` | Vitest UI |
| `npm run test:coverage` | 커버리지 리포트 생성 |
| `npm run lint` / `lint:fix` | ESLint 검사 / 자동 수정 |
| `npm run format` / `format:check` | Prettier 포맷 / 검사 |

---

## 프로젝트 구조

```
src/
├── api/            # axios 인스턴스, 토큰 저장소, 도메인별 API 함수, 응답 규약 타입
├── components/     # 재사용 UI (Card, Input, List, Modal, FilterBar,
│                   #            CircularProgress, SocialLoginButton, NotificationPanel)
├── layouts/        # Header, Footer(하단 탭), Button, SelectButton
├── pages/          # 화면 단위 컴포넌트 (auth, Home, Community, StudyGroup,
│                   #                    StudyManagement, Chat, User)
├── routes/         # ProtectedRoute, PublicOnlyRoute
├── hooks/          # 도메인별 TanStack Query 훅 (useAuth, useCommunity, ...)
├── stores/         # zustand authStore
├── mocks/          # MSW handlers, 상태를 가진 목업 DB, 응답 래퍼
├── styles/         # reset / colors / typography / spacing 토큰
├── test/           # vitest setup, renderWithProviders
├── types/          # 공용 타입
└── utils/          # 타이머 계산, 온보딩 여부, 최근 검색어
```

각 컴포넌트/페이지는 `Xxx.tsx` + `Xxx.types.ts` + `Xxx.test.tsx` 를 같은 폴더에 두는 구조입니다.

---

## 라우팅

총 22개 라우트이며, 접근 권한에 따라 세 그룹으로 나뉩니다.

**로그인 전에만 접근 (`PublicOnlyRoute`)**

| 경로 | 화면 |
| --- | --- |
| `/auth/onboarding` | 온보딩 |
| `/auth/login` | 소셜 로그인 |

**토큰만 있으면 접근 (프로필 등록 단계)**

| 경로 | 화면 |
| --- | --- |
| `/auth/signup` | 이름·닉네임 등록 |
| `/auth/signup-complete` | 가입 완료 |

**로그인 필요 (`ProtectedRoute`)**

| 경로 | 화면 | 레이아웃 |
| --- | --- | --- |
| `/` | 홈 | 헤더 + 하단 탭 |
| `/community` | 커뮤니티 목록 | 헤더 + 하단 탭 |
| `/studygroup` | 스터디 그룹 목록 | 헤더 + 하단 탭 |
| `/chat` | 채팅방 목록 | 헤더 + 하단 탭 |
| `/user` | 내정보 | 헤더 + 하단 탭 |
| `/study` | 학습관리 | 헤더 + 하단 탭 |
| `/community/write` | 글쓰기 | 전체화면 |
| `/community/:id` | 글 상세 | 전체화면 |
| `/studygroup/create` | 스터디 생성 | 전체화면 |
| `/studygroup/category` | 카테고리 선택 | 전체화면 |
| `/studygroup/:id` | 스터디 상세 | 전체화면 |
| `/studygroup/:id/apply` | 스터디 신청 | 전체화면 |
| `/study/calendar` | 학습 캘린더 | 전체화면 |
| `/chat/:id` | 채팅방 | 전체화면 |
| `/user/posts` `/user/comments` `/user/bookmarks` `/user/studies` | 내 활동 모음 | 전체화면 |

---

## 인증 흐름

```
비로그인 접근
  └─ 온보딩을 본 적 없음 → /auth/onboarding
  └─ 온보딩을 본 적 있음 → /auth/login

/auth/login 에서 소셜 로그인
  └─ 신규 회원 → /auth/signup → /auth/signup-complete → /
  └─ 기존 회원 → /
```

- 액세스 토큰은 `localStorage`(`stardy.accessToken`)에 저장하고, `src/api/token.ts`가 단독으로 관리합니다.
  (`authStore ↔ apiClient` 순환 참조를 피하기 위한 분리입니다.)
- 사용자 프로필과 `needsProfile` 플래그는 zustand `persist`(`stardy.auth`)로 유지됩니다.
- **토큰 + 프로필이 모두 있어야** 로그인 완료로 간주합니다 (`isAuthenticated`).
- axios 응답 인터셉터가 **401을 받으면 토큰을 지우고** authStore에 등록된 핸들러를 호출해 로그아웃 처리합니다.

---

## API 규약

`baseURL`은 `/api/v1`이며, 모든 응답은 동일한 봉투(envelope) 형태입니다.

```ts
interface ApiEnvelope<T> {
  status: number
  code: string
  message: string
  data: T
}
```

API 함수는 `unwrap()`으로 `data`만 꺼내 반환하므로, 화면 코드는 봉투를 신경 쓰지 않습니다.
실제 백엔드 규약이 다르면 `src/api/types.ts`와 `src/mocks/envelope.ts` 두 파일만 수정하면 됩니다.

<details>
<summary>목업으로 구현된 엔드포인트 (31개)</summary>

```
POST   /api/v1/auth/social-login          GET    /api/v1/auth/nickname-check
POST   /api/v1/auth/signup                GET    /api/v1/auth/me
POST   /api/v1/auth/logout

GET    /api/v1/home/summary

GET    /api/v1/community/posts            POST   /api/v1/community/posts
GET    /api/v1/community/posts/:id        POST   /api/v1/community/posts/:id/like

GET    /api/v1/studygroup/groups          POST   /api/v1/studygroup/groups
GET    /api/v1/studygroup/groups/:id      POST   /api/v1/studygroup/groups/:id/apply

GET    /api/v1/study/stats                GET    /api/v1/study/goals
POST   /api/v1/study/goals                GET    /api/v1/study/schedules
POST   /api/v1/study/schedules            DELETE /api/v1/study/schedules/:id

GET    /api/v1/chat/rooms                 GET    /api/v1/chat/rooms/:id
POST   /api/v1/chat/rooms/:id/messages

GET    /api/v1/users/me/profile           GET    /api/v1/users/me/posts
DELETE /api/v1/users/me/posts/:id         GET    /api/v1/users/me/comments
GET    /api/v1/users/me/bookmarks         DELETE /api/v1/users/me/bookmarks/:id
GET    /api/v1/users/me/studies

GET    /api/v1/notifications              PATCH  /api/v1/notifications/:id/read
PATCH  /api/v1/notifications/read-all
```

</details>

### 목업(MSW)의 특징

- 핸들러는 도메인별로 `src/mocks/handlers/*.ts`에 나뉘어 있고 `handlers/index.ts`에서 합쳐집니다.
- **상태를 가집니다.** 글을 쓰면 목록에 남고, 스터디를 만들면 상세 조회가 되고, 북마크를 해제하면 개수가 줄어듭니다.
- 테스트 간섭을 막기 위해 도메인마다 `resetXxxMock()`을 두고, `resetAllMocks()`가 이를 모두 호출합니다.
  `src/test/setup.ts`의 `afterEach`에서 cleanup · 핸들러 초기화 · 목업 초기화 · `localStorage.clear()`를 수행합니다.

---

## 상태 관리

- **서버 상태**는 TanStack Query가 담당합니다. 도메인마다 `XXX_QUERY_KEYS` 객체로 키를 계층적으로 관리해
  (`['community', 'posts', category, keyword]`) 필요한 범위만 정확히 무효화합니다.
- **클라이언트 상태**는 zustand authStore 하나뿐입니다. 나머지 화면 상태는 지역 `useState`로 둡니다.

---

## 스타일

`src/styles/`의 CSS 커스텀 프로퍼티가 디자인 토큰 역할을 합니다.

- `colors.css` — Primary `#0CC76D`, Secondary, Gray 스케일, 의미 색상, 배경 색상
- `typography.css` — Figma 텍스트 스타일에 맞춘 크기(24 / 22 / 20 / 16 / 14 / 12), 굵기, `letter-spacing`
- `spacing.css` — 간격 스케일
- `reset.css` — 기본 스타일 초기화

---

## 테스트

```bash
npm test              # watch
npx vitest run        # 1회 실행
npm run test:coverage # 커버리지
```

- 테스트 파일 32개 / 테스트 294개 (전체 통과)
- 컴포넌트·페이지·라우트 가드·훅·유틸을 모두 다루며, API는 MSW로 실제 네트워크 계층에서 가로챕니다.
- `src/test/renderWithProviders.tsx`가 `QueryClientProvider` + `MemoryRouter`를 씌워주며,
  `route` / `path` / `extraRoutes` 옵션으로 이동 결과까지 검증할 수 있습니다.

---

## 코드 품질 & CI

- 커밋 시 husky + lint-staged가 변경된 파일에 ESLint·Prettier를 적용합니다.
- `main` / `develop` 대상 push·PR마다 GitHub Actions가
  **lint → format:check → 타입 체크 → 테스트(커버리지) → 빌드** 순으로 검증합니다.

---

## 남은 작업

- 게이미피케이션 화면 (Figma 8개 화면)
- 스터디 그룹 내부 화면 (그룹 홈 / 공지사항 / 그룹 커뮤니티)
- 실제 백엔드 연동 및 소셜 OAuth 실 연동, 이미지 업로드 API
