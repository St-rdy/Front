# 학습관리 (StudyManagement) 구현 정리

## 구현 화면
- 메인 페이지 (`/study`): 일정·타이머·학습통계·목표달성 4개 탭
- 캘린더 (`/study/calendar`): 전체화면 월간 캘린더

## 구현 기능

### 일정 탭
- 주간 날짜 스트립 (현재 주 일~토, 날짜 선택 가능)
- 캘린더 아이콘 → `/study/calendar` 이동
- 선택 날짜의 일정 카드 리스트 (과목명 + 시간)
- 일정 카드 X 버튼으로 삭제
- FAB(+) → 바텀시트 일정 추가 모달 (과목명 + 시간 입력)

### 타이머 탭
- 실시간 HH:MM:SS 타이머 (tabular-nums)
- 과목 선택 드롭다운 (오늘 일정 기반 자동 목록)
- START / 일시정지 / 초기화 버튼
- **localStorage 영속**: 타이머 실행 중 페이지 이탈 후 복귀해도 경과 시간 복원
  - key: `sm_timer` → `{ subject, startedAt, accumulated }`

### 학습통계 탭
- 일간 학습률 카드 (% + 아이콘)
- 주간 학습률 카드
- 연속 공부 일수 카드

### 목표달성 탭
- 목표 카드 리스트 (제목 + 기간 + 진행률 바 + %)
- FAB(+) → 바텀시트 목표 추가 모달 (제목 + 시작일 + 종료일 + 목표 시간)

### 캘린더
- 월간 달력 (이전/다음 달 네비게이션)
- 날짜 클릭 → `/study?date=YYYY-MM-DD` 이동
- URL `?date=` 파라미터로 초기 월 설정

## 생성 파일

### 페이지
- `src/pages/StudyManagement/StudyManagement.tsx`
- `src/pages/StudyManagement/StudyManagement.css`
- `src/pages/StudyManagement/studyManagement.types.ts`
- `src/pages/StudyManagement/StudyManagementCalendar/StudyManagementCalendar.tsx`
- `src/pages/StudyManagement/StudyManagementCalendar/StudyManagementCalendar.css`

### API / 훅
- `src/api/studyManagement.ts`
- `src/hooks/useStudyManagement.ts`
- `src/hooks/useTimer.ts`

### 목 데이터
- `src/mocks/handlers/studyManagement.ts`

### 수정 파일
- `src/mocks/handlers/index.ts` (핸들러 등록)
- `src/App.tsx` (`/study`, `/study/calendar` 라우트 추가)

## 테스트 파일 및 케이스

### `src/hooks/useTimer.test.ts` (8개)
1. 초기 상태 검증
2. start() 호출 시 isRunning/subject 확인
3. 3초 후 elapsed 증가 확인
4. pause() 후 타이머 정지
5. reset() 후 초기화
6. start() 시 localStorage 저장
7. localStorage 복원 (10초 경과 재현)
8. pause() 후 localStorage 제거

### `src/pages/StudyManagement/StudyManagement.test.tsx` (17개)
- 탭 렌더링: 4개 탭 표시, 기본 활성 탭, 탭 전환 (5개)
- 일정 탭: 일정 표시, FAB 표시, 모달 열기/닫기, 빈 상태 (5개)
- 학습통계 탭: 카드 표시, 수치 표시 (2개)
- 목표달성 탭: 목표 표시, FAB 표시, 모달 열기, 진행률 75%/33% (5개)

### `src/pages/StudyManagement/StudyManagementCalendar/StudyManagementCalendar.test.tsx` (8개)
1. 현재 연도·월 표시
2. 요일 헤더 7개
3. 이전 달 이동
4. 다음 달 이동
5. 닫기 버튼 표시
6. 날짜 클릭 → /study 이동
7. URL date 파라미터 초기 월 설정
8. 확인 버튼 → /study 이동

**총 테스트 케이스: 33개** (useTimer: 8 + StudyManagement: 17 + Calendar: 8)

## 인프라 변경

| 항목 | 내용 |
|---|---|
| MSW 엔드포인트 | GET/POST/DELETE /api/study/schedules, GET/POST /api/study/goals, GET /api/study/stats |
| 라우트 추가 | `/study` (MainLayout), `/study/calendar` (전체화면) |
| localStorage | `sm_timer` 키 (타이머 영속) |

## 디자인 시스템

- CSS prefix: `sm-` (메인), `smc-` (캘린더)
- 카드: `border-radius: 16px`, `box-shadow: 0 1px 4px rgba(0,0,0,0.06)`
- 탭바: pill 형태, 활성 탭 `background: var(--color-primary)`
- 타이머: `font-size: 42px`, `font-variant-numeric: tabular-nums`
- 바텀시트: slide-up 애니메이션, dim 오버레이
