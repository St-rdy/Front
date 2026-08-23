import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './Footer'

// 현재 경로를 화면에 찍어 이동 결과를 검증합니다.
function LocationProbe() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

const renderFooter = (initialEntry = '/') => {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Footer />
      <LocationProbe />
      <Routes>
        <Route path="*" element={null} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Footer 테스트', () => {
  it('Footer 컴포넌트가 랜더링 되어야 한다.', () => {
    renderFooter()
    expect(screen.getByText('커뮤니티')).toBeInTheDocument()
  })

  it('Footer 컴포넌트에 5개의 버튼이 있어야 한다.', () => {
    renderFooter()
    expect(screen.getAllByRole('button')).toHaveLength(5)
  })

  it('내정보 버튼을 누르면 /user로 이동한다.', async () => {
    renderFooter()
    await userEvent.click(screen.getByText('내정보'))
    expect(screen.getByTestId('location')).toHaveTextContent('/user')
  })

  it('채팅 버튼을 누르면 /chat으로 이동한다.', async () => {
    renderFooter()
    await userEvent.click(screen.getByText('채팅'))
    expect(screen.getByTestId('location')).toHaveTextContent('/chat')
  })

  it('현재 경로에 해당하는 탭이 활성 아이콘으로 표시된다.', () => {
    renderFooter('/community')
    const communityIcon = screen.getByText('커뮤니티').querySelector('img')
    expect(communityIcon?.src).toContain('community_fill.svg')
  })

  it('상세 화면에서도 상위 탭이 활성으로 유지된다.', () => {
    renderFooter('/community/1')
    const communityIcon = screen.getByText('커뮤니티').querySelector('img')
    expect(communityIcon?.src).toContain('community_fill.svg')
  })

  it('새로고침처럼 홈이 아닌 경로로 진입해도 홈이 활성이 아니다.', () => {
    renderFooter('/studygroup')
    const homeIcon = screen.getByText('홈').querySelector('img')
    expect(homeIcon?.src).toContain('home.svg')
    expect(homeIcon?.src).not.toContain('home_fill.svg')
  })
})
