import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import Home from './Home'

// 각 테스트마다 새 QueryClient 생성 (캐시 오염 방지, 재시도 비활성화)
function renderHome() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}

// ─── 로딩 상태 ────────────────────────────────────────────────────
describe('Home 페이지 - 로딩 상태', () => {
  it('데이터를 불러오는 동안 로딩 메시지를 보여준다', () => {
    renderHome()
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument()
  })
})

// ─── 성공 상태 ────────────────────────────────────────────────────
describe('Home 페이지 - 성공 상태', () => {
  it('API 응답 후 사용자 이름이 표시된다', async () => {
    renderHome()
    expect(await screen.findByText('안녕하세요! 엄박봉님')).toBeInTheDocument()
  })

  it('통계 레이블 3개(레벨, 오늘의 학습, 주간 목표)가 표시된다', async () => {
    renderHome()
    expect(await screen.findByText('레벨')).toBeInTheDocument()
    expect(screen.getByText('오늘의 학습')).toBeInTheDocument()
    expect(screen.getByText('주간 목표')).toBeInTheDocument()
  })

  it('통계 상세 정보가 올바르게 표시된다', async () => {
    renderHome()
    expect(await screen.findByText('8Lv : 1400EXP')).toBeInTheDocument()
    expect(screen.getByText('3시간 / 5시간')).toBeInTheDocument()
    expect(screen.getByText('18시간 / 25시간')).toBeInTheDocument()
  })

  it('오늘의 일정 아이템이 렌더링된다', async () => {
    renderHome()
    expect(await screen.findByText('영어 공부')).toBeInTheDocument()
    expect(screen.getByText('국어 공부')).toBeInTheDocument()
  })

  it('일정 시간이 올바르게 표시된다', async () => {
    renderHome()
    expect(await screen.findByText('08:00')).toBeInTheDocument()
    expect(screen.getByText('10:00')).toBeInTheDocument()
  })

  it('인기 커뮤니티 게시글 제목이 표시된다', async () => {
    renderHome()
    expect(
      await screen.findByText('취업 준비 같이 하실 분! 🔥')
    ).toBeInTheDocument()
  })

  it('내 스터디 그룹 제목이 표시된다', async () => {
    renderHome()
    expect(await screen.findByText('2025 공무원 시험 준비')).toBeInTheDocument()
  })

  it('공부하러 가기 버튼이 표시된다', async () => {
    renderHome()
    expect(await screen.findByText('공부하러 가기')).toBeInTheDocument()
  })

  it('일정 추가 버튼이 표시된다', async () => {
    renderHome()
    expect(await screen.findByText('+ 일정 추가')).toBeInTheDocument()
  })
})

// ─── 에러 상태 ────────────────────────────────────────────────────
describe('Home 페이지 - 에러 상태', () => {
  it('API 실패 시 에러 메시지를 보여준다', async () => {
    // 이 테스트에서만 핸들러를 에러 응답으로 오버라이드
    server.use(
      http.get('/api/home/summary', () => {
        return HttpResponse.error()
      })
    )

    renderHome()

    await waitFor(() => {
      expect(
        screen.getByText('데이터를 불러오지 못했습니다.')
      ).toBeInTheDocument()
    })
  })
})
