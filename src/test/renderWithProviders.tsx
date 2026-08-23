import type { ReactElement, ReactNode } from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

interface Options {
  // 시작 경로 (예: '/community/1')
  route?: string
  // 라우트 파라미터가 필요한 화면에서 매칭할 패턴 (예: '/community/:id')
  path?: string
  // 이동 결과를 확인하기 위한 추가 라우트
  extraRoutes?: ReactNode
}

// 테스트용 렌더 헬퍼
// 모든 화면이 React Query + Router에 의존하므로 한곳에서 감싸줍니다.
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', path, extraRoutes }: Options = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const tree =
    path || extraRoutes ? (
      <Routes>
        <Route path={path ?? '/'} element={ui} />
        {extraRoutes}
      </Routes>
    ) : (
      ui
    )

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{tree}</MemoryRouter>
    </QueryClientProvider>
  )
}
