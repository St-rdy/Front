import { useNavigate } from 'react-router-dom'
import { CircularProgress } from '../../components/CircularProgress'
import { useUserProfile } from '../../hooks/useUser'
import { useLogout } from '../../hooks/useAuth'
import './User.css'

// 프로필 아래 바로가기 3종 (디자인: 북마크 / 참여 스터디 / 학습관리)
const SHORTCUTS = [
  { key: 'bookmarks', label: '북마크', emoji: '🔖', path: '/user/bookmarks' },
  { key: 'studies', label: '참여 스터디', emoji: '📕', path: '/user/studies' },
  { key: 'study', label: '학습관리', emoji: '✏️', path: '/study' },
] as const

const STAT_CONFIG = [
  { key: 'level' as const, label: '레벨', color: '#0CC76D' },
  { key: 'todayStudy' as const, label: '오늘의 학습', color: '#5B74A8' },
  { key: 'weeklyGoal' as const, label: '주간 목표', color: '#9B7FD4' },
]

// 목록으로 이동하는 메뉴
const MENUS = [
  { label: '내가 쓴 게시물', path: '/user/posts' },
  { label: '내가 쓴 댓글', path: '/user/comments' },
]

// 팔로워 수를 3.1만 형태로 축약합니다.
function formatCount(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1).replace(/\.0$/, '')}만`
  }
  return count.toLocaleString('ko-KR')
}

export default function User() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useUserProfile()
  const logout = useLogout()

  function handleLogout() {
    logout.mutate(undefined, {
      onSettled: () => navigate('/auth/login', { replace: true }),
    })
  }

  if (isLoading) {
    return <p className="user-state">불러오는 중...</p>
  }

  if (isError || !data) {
    return <p className="user-state">데이터를 불러오지 못했습니다.</p>
  }

  return (
    <div className="user-page">
      {/* 프로필 카드 */}
      <section className="user-profile">
        {data.avatar ? (
          <img src={data.avatar} alt={data.nickname} className="user-avatar" />
        ) : (
          <div className="user-avatar user-avatar--fallback" />
        )}
        <div className="user-profile__info">
          <p className="user-profile__nickname">{data.nickname}</p>
          <div className="user-profile__counts">
            <span>게시물 {data.postCount}</span>
            <span>팔로워 {formatCount(data.followerCount)}</span>
            <span>팔로잉 {formatCount(data.followingCount)}</span>
          </div>
        </div>
      </section>

      {/* 바로가기 */}
      <section className="user-shortcuts">
        {SHORTCUTS.map(shortcut => (
          <button
            key={shortcut.key}
            className="user-shortcut"
            onClick={() => navigate(shortcut.path)}
          >
            <span className="user-shortcut__emoji">{shortcut.emoji}</span>
            <span className="user-shortcut__label">{shortcut.label}</span>
          </button>
        ))}
      </section>

      {/* 학습 통계 */}
      <section className="user-stats">
        {STAT_CONFIG.map(({ key, label, color }) => (
          <CircularProgress
            key={key}
            percentage={data.stats[key].percentage}
            label={label}
            detail={data.stats[key].detail}
            color={color}
          />
        ))}
      </section>

      {/* 메뉴 */}
      <section className="user-menus">
        {MENUS.map(menu => (
          <button
            key={menu.path}
            className="user-menu"
            onClick={() => navigate(menu.path)}
          >
            <span>{menu.label}</span>
            <span className="user-menu__arrow">›</span>
          </button>
        ))}
        <button
          className="user-menu user-menu--logout"
          onClick={handleLogout}
          disabled={logout.isPending}
        >
          <span>{logout.isPending ? '로그아웃 중...' : '로그아웃'}</span>
        </button>
      </section>
    </div>
  )
}
