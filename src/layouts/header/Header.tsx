import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NotificationPanel from '../../components/NotificationPanel/NotificationPanel'
import { useNotifications } from '../../hooks/useNotification'
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
} from '../../utils/recentSearch'
import './Header.css'

// url 경로에 따른 헤더 메뉴 이름
// 헤더는 하단 탭이 있는 6개 화면에서만 렌더링됩니다.
const TITLES: Record<string, string> = {
  '/': 'Stardy',
  '/community': '커뮤니티',
  '/studygroup': '스터디그룹',
  '/chat': '채팅',
  '/user': '내정보',
  '/study': '학습관리',
}

const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSearching, setIsSearching] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const { data } = useNotifications()
  const hasUnread = (data?.unread_count ?? 0) > 0

  function openSearch() {
    setRecentSearches(getRecentSearches())
    setIsSearching(true)
  }

  function closeSearch() {
    setIsSearching(false)
    setSearchText('')
  }

  // 검색 실행: 최근 검색어에 남기고 커뮤니티 검색 결과로 이동합니다.
  function runSearch(keyword: string) {
    const trimmed = keyword.trim()
    if (!trimmed) return

    addRecentSearch(trimmed)
    setRecentSearches(getRecentSearches())
    closeSearch()
    navigate(`/community?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <header className="header-container">
      <div className="header-flex">
        {isSearching ? (
          /* 검색 */
          <div className="search-mode">
            <button className="icon-back" onClick={closeSearch}>
              <img src="/Header/back_arrow.svg" alt="닫기" />
            </button>

            <div className="search-input-wrapper">
              {!searchText && (
                <img
                  src="/Header/search.svg"
                  alt="검색"
                  className="inner-search"
                />
              )}
              <input
                type="text"
                className={`search-input ${searchText ? 'active' : ''}`}
                placeholder="검색어를 입력해주세요"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') runSearch(searchText)
                }}
                autoFocus
              />
              {searchText && (
                <>
                  <button
                    className="clear-btn"
                    onClick={() => setSearchText('')}
                    aria-label="검색어 지우기"
                  >
                    <img src="/Header/search_close.svg" alt="검색닫기" />
                  </button>
                  <button
                    className="search-submit"
                    onClick={() => runSearch(searchText)}
                    aria-label="검색"
                  >
                    <img src="/Header/search.svg" alt="검색" />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* 일반 */
          <>
            <div className="header-title">
              {/* 메뉴 제목 출력 */}
              {location.pathname === '/' && (
                <img src="/Header/stardy_logo.png" alt="logo" />
              )}
              <h2>{TITLES[location.pathname] ?? 'Stardy'}</h2>
            </div>
            <div className="header-option">
              <button
                className="search"
                onClick={openSearch}
                aria-label="검색 열기"
              >
                <img src="/Header/search.svg" alt="검색" />
              </button>
              <button
                className="alert"
                onClick={() => setIsNotifOpen(prev => !prev)}
                aria-label="알림 열기"
              >
                {hasUnread ? (
                  <img src="/Header/alert_on.svg" alt="알림있음" />
                ) : (
                  <img src="/Header/alert.svg" alt="알림" />
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* 최근 검색어 */}
      {isSearching && (
        <div className="search-panel">
          <div className="search-panel__head">
            <h3 className="search-panel__title">최근 검색어</h3>
            {recentSearches.length > 0 && (
              <button
                className="search-panel__clear"
                onClick={() => {
                  clearRecentSearches()
                  setRecentSearches([])
                }}
              >
                전체 삭제
              </button>
            )}
          </div>
          {recentSearches.length === 0 ? (
            <p className="search-panel__empty">최근 검색 기록이 없어요</p>
          ) : (
            <div className="search-panel__chips">
              {recentSearches.map(keyword => (
                <button
                  key={keyword}
                  className="search-panel__chip"
                  onClick={() => runSearch(keyword)}
                >
                  {keyword}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isNotifOpen && (
        <>
          <div
            className="notification-backdrop"
            data-testid="notification-backdrop"
            onClick={() => setIsNotifOpen(false)}
          />
          <NotificationPanel />
        </>
      )}
    </header>
  )
}

export default Header
