import React from 'react'
import { useState } from 'react'
import './Footer.css'

export default function Footer() {
  const [active, setActive] = useState('home')

  return (
    <>
      <div className="footer-container">
        <nav className="footer-nav">
          <button
            className="footer-item"
            onClick={() => setActive('community')}
          >
            {active === 'community' ? (
              <img src="/Footer/community_fill.svg" alt="커뮤니티" />
            ) : (
              <img src="/Footer/community.svg" alt="커뮤니티" />
            )}
            커뮤니티
          </button>
          <button
            className="footer-item"
            onClick={() => setActive('study_group')}
          >
            {active === 'study_group' ? (
              <img src="/Footer/study_group_fill.svg" alt="스터디그룹" />
            ) : (
              <img src="/Footer/study_group.svg" alt="스터디그룹" />
            )}
            스터디그룹
          </button>
          <button className="footer-item" onClick={() => setActive('home')}>
            {active === 'home' ? (
              <img src="/Footer/home_fill.svg" alt="홈" />
            ) : (
              <img src="/Footer/home.svg" alt="홈" />
            )}
            홈
          </button>
          <button className="footer-item" onClick={() => setActive('chat')}>
            {active === 'chat' ? (
              <img src="/Footer/chat_fill.svg" alt="채팅" />
            ) : (
              <img src="/Footer/chat.svg" alt="채팅" />
            )}
            채팅
          </button>
          <button className="footer-item" onClick={() => setActive('user')}>
            {active === 'user' ? (
              <img src="/Footer/user_fill.svg" alt="내정보" />
            ) : (
              <img src="/Footer/user.svg" alt="내정보" />
            )}
            내정보
          </button>
        </nav>
      </div>
    </>
  )
}
