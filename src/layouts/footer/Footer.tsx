import { useLocation, useNavigate } from 'react-router-dom'
import './Footer.css'

// 하단 탭 정의 (디자인 순서: 커뮤니티 - 스터디그룹 - 홈 - 채팅 - 내정보)
const TABS = [
  { path: '/community', label: '커뮤니티', icon: 'community' },
  { path: '/studygroup', label: '스터디그룹', icon: 'study_group' },
  { path: '/', label: '홈', icon: 'home' },
  { path: '/chat', label: '채팅', icon: 'chat' },
  { path: '/user', label: '내정보', icon: 'user' },
] as const

// 현재 경로가 어떤 탭에 속하는지 판단합니다.
// 상세 화면(/community/3 등)에서도 해당 탭이 활성으로 보이도록 접두사로 비교합니다.
function getActivePath(pathname: string): string {
  if (pathname === '/') return '/'
  const matched = TABS.filter(tab => tab.path !== '/').find(
    tab => pathname === tab.path || pathname.startsWith(`${tab.path}/`)
  )
  // 학습관리(/study)는 하단 탭이 없어 어떤 탭도 활성이 아닙니다.
  return matched?.path ?? ''
}

export default function Footer() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activePath = getActivePath(pathname)

  return (
    <div className="footer-container">
      <nav className="footer-nav">
        {TABS.map(tab => {
          const isActive = activePath === tab.path
          return (
            <button
              key={tab.path}
              className={`footer-item${isActive ? ' footer-item--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => navigate(tab.path)}
            >
              <img
                src={`/Footer/${tab.icon}${isActive ? '_fill' : ''}.svg`}
                alt={tab.label}
              />
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
