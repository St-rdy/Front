import React from 'react'
import { CircularProgress } from '../../components/CircularProgress'
import { useHomeSummary } from '../../hooks/useHome'
import './Home.css'

const STAT_CONFIG = [
  { key: 'level' as const, label: '레벨', color: '#0CC76D' },
  { key: 'todayStudy' as const, label: '오늘의 학습', color: '#5B74A8' },
  { key: 'weeklyGoal' as const, label: '주간 목표', color: '#9B7FD4' },
]

const Home: React.FC = () => {
  const { data, isLoading, isError } = useHomeSummary()

  if (isLoading) {
    return <div className="home-state">불러오는 중...</div>
  }

  if (isError || !data) {
    return <div className="home-state">데이터를 불러오지 못했습니다.</div>
  }

  return (
    <div className="home-page">
      {/* 인사 영역 */}
      <section>
        <h1 className="home-greeting__title">안녕하세요! {data.user.name}님</h1>
        <p className="home-greeting__subtitle">오늘도 열심히 공부해볼까요?</p>
      </section>

      {/* 통계 원형 게이지 */}
      <div className="home-stats-card">
        {STAT_CONFIG.map(({ key, label, color }) => (
          <CircularProgress
            key={key}
            percentage={data.stats[key].percentage}
            label={label}
            detail={data.stats[key].detail}
            color={color}
          />
        ))}
      </div>

      {/* 공부하러 가기 버튼 */}
      <button className="home-study-btn" onClick={() => {}}>
        <div className="home-study-btn__left">
          <img
            src="/Footer/study_group.svg"
            alt="공부"
            width={22}
            height={22}
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <span>공부하러 가기</span>
        </div>
        <span>›</span>
      </button>

      {/* 오늘의 일정 */}
      <section>
        <h2 className="home-section__title">오늘의 일정</h2>
        <div className="home-schedule-card">
          {data.schedules.map(item => (
            <div key={item.id} className="home-schedule-item">
              <div className="home-schedule-item__bar" />
              <span className="home-schedule-item__title">{item.title}</span>
              <span className="home-schedule-item__time">{item.time}</span>
            </div>
          ))}
          <button className="home-schedule-add">+ 일정 추가</button>
        </div>
      </section>

      {/* 인기 커뮤니티 */}
      <section>
        <h2 className="home-section__title">인기 커뮤니티</h2>
        {data.popularCommunity.map(post => (
          <div key={post.id} className="home-info-card">
            <div className="home-info-card__header">
              <div className="home-info-card__title-row">
                <img
                  src="/Footer/community.svg"
                  alt="커뮤니티"
                  className="home-info-card__icon"
                />
                <span className="home-info-card__title">{post.title}</span>
              </div>
              <span className="home-info-card__arrow">›</span>
            </div>
            <p className="home-info-card__desc">{post.description}</p>
            <div className="home-info-card__footer">
              <span className="home-info-card__footer-item">
                <img src="/List/Chat.svg" alt="댓글" width={13} height={13} />
                {post.comments}
              </span>
              <span>{post.timeAgo}</span>
            </div>
          </div>
        ))}
      </section>

      {/* 내 스터디 그룹 */}
      <section>
        <h2 className="home-section__title">내 스터디 그룹</h2>
        {data.myStudyGroups.map(group => (
          <div key={group.id} className="home-info-card">
            <div className="home-info-card__header">
              <div className="home-info-card__title-row">
                <img
                  src="/Footer/study_group.svg"
                  alt="스터디그룹"
                  className="home-info-card__icon"
                />
                <span className="home-info-card__title">{group.title}</span>
              </div>
              <span className="home-info-card__arrow">›</span>
            </div>
            <p className="home-info-card__desc">{group.description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Home
