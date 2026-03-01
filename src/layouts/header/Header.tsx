import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './Header.css'

const Header: React.FC = () => {
  const location = useLocation()
  const [isSearching, setIsSearching] = useState(false)
  const [searchText, setSearchText] = useState('')

  // url 경로에 따른 헤더 메뉴 이름 변경
  const titles: Record<string, string> = {
    '/': 'Stardy',
    '/community': '커뮤니티',
    '/studygroup': '스터디그룹',
    '/chat': '채팅',
    '/user': '내정보',
  }

  return (
    <header className="header-container">
      <div className="header-flex">
        {isSearching ? (
          /* 검색 */
          <div className="search-mode">
            <button className="icon-back" onClick={() => setIsSearching(false)}>
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
                autoFocus
              />
              {searchText && (
                <>
                  <button
                    className="clear-btn"
                    onClick={() => setSearchText('')}
                  >
                    <img src="/Header/search_close.svg" alt="검색닫기" />
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
              <h2>{titles[location.pathname] || '없음'}</h2>
            </div>
            <div className="header-option">
              <button className="search" onClick={() => setIsSearching(true)}>
                <img src="/Header/search.svg" alt="검색" />
              </button>
              <button className="alert">
                <img src="/Header/alert.svg" alt="알림" />
                {/* <img src="/Header/alert_on.svg" alt="알림있음" /> */}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
