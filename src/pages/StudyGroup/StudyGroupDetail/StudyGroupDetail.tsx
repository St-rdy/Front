import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStudyGroupDetail } from '../../../hooks/useStudyGroup'
import './StudyGroupDetail.css'

export default function StudyGroupDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useStudyGroupDetail(
    id !== undefined ? Number(id) : undefined
  )
  const [liked, setLiked] = useState(false)

  return (
    <div className="sg-detail-page">
      {/* 고정 뒤로가기 버튼 */}
      <button className="sg-detail-back" onClick={() => navigate(-1)}>
        <img src="/Header/back_arrow.svg" alt="뒤로" />
      </button>

      {isLoading && (
        <>
          <div className="sg-detail-hero sg-detail-hero--skeleton" />
          <p className="sg-detail-state">불러오는 중...</p>
        </>
      )}
      {isError && (
        <>
          <div className="sg-detail-hero sg-detail-hero--skeleton" />
          <p className="sg-detail-state">데이터를 불러오지 못했습니다.</p>
        </>
      )}

      {data && (
        <>
          {/* 히어로 이미지 */}
          <div className="sg-detail-hero">
            {data.group.thumbnail ? (
              <img
                src={data.group.thumbnail}
                alt={data.group.title}
                className="sg-detail-hero__img"
              />
            ) : (
              <div className="sg-detail-hero__fallback">
                <span className="sg-detail-hero__emoji">📚</span>
              </div>
            )}
          </div>

          {/* 본문 — 이미지 위로 슬라이드 업 */}
          <div className="sg-detail-body">
            {/* 배지 */}
            <div className="sg-detail-badges">
              <span className="sg-detail-badge sg-detail-badge--category">
                {data.group.category}
              </span>
              <span
                className={`sg-detail-badge sg-detail-badge--mode sg-detail-badge--${data.group.mode}`}
              >
                {data.group.mode === 'online' ? '온라인' : '오프라인'}
              </span>
            </div>

            {/* 타이틀 */}
            <div className="sg-detail-title-block">
              <h1 className="sg-detail-title">{data.group.title}</h1>
              <p className="sg-detail-meta">
                {data.group.memberCount}/{data.group.maxMemberCount}명 참여 중
              </p>
            </div>

            {/* 정보 카드 */}
            <div className="sg-detail-info">
              <div className="sg-detail-info__row">
                <span className="sg-detail-info__icon">📅</span>
                <div className="sg-detail-info__texts">
                  <span className="sg-detail-info__label">기간</span>
                  <span className="sg-detail-info__value">
                    {data.group.startDate} ~ {data.group.endDate}
                  </span>
                </div>
              </div>
              {data.group.location && (
                <div className="sg-detail-info__row">
                  <span className="sg-detail-info__icon">📍</span>
                  <div className="sg-detail-info__texts">
                    <span className="sg-detail-info__label">장소</span>
                    <span className="sg-detail-info__value">
                      {data.group.location}
                    </span>
                  </div>
                </div>
              )}
              <div className="sg-detail-info__row">
                <span className="sg-detail-info__icon">🎯</span>
                <div className="sg-detail-info__texts">
                  <span className="sg-detail-info__label">목표</span>
                  <span className="sg-detail-info__value">
                    {data.group.goal}
                  </span>
                </div>
              </div>
            </div>

            {/* 그룹 소개 */}
            <div className="sg-detail-section">
              <h2 className="sg-detail-section__title">그룹 소개</h2>
              <p className="sg-detail-description">{data.group.description}</p>
            </div>

            {/* 태그 */}
            {data.group.tags.length > 0 && (
              <div className="sg-detail-tags">
                {data.group.tags.map(tag => (
                  <span key={tag} className="sg-detail-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 그룹장 */}
            <div className="sg-detail-host">
              <div className="sg-detail-host__avatar">
                {data.group.hostAvatar ? (
                  <img src={data.group.hostAvatar} alt={data.group.hostName} />
                ) : (
                  <span className="sg-detail-host__initial">
                    {data.group.hostName.charAt(0)}
                  </span>
                )}
              </div>
              <div className="sg-detail-host__info">
                <span className="sg-detail-host__label">그룹장</span>
                <span className="sg-detail-host__name">
                  {data.group.hostName}
                </span>
              </div>
            </div>
          </div>

          {/* 하단 버튼 바 */}
          <div className="sg-detail-footer">
            <button
              className={`sg-detail-like${liked ? ' sg-detail-like--active' : ''}`}
              onClick={() => setLiked(prev => !prev)}
            >
              {liked ? '❤️' : '🤍'}
            </button>
            <button className="sg-detail-inquiry">문의하기</button>
            <button
              className="sg-detail-apply"
              onClick={() => navigate(`/studygroup/${id}/apply`)}
            >
              가입 신청하기
            </button>
          </div>
        </>
      )}
    </div>
  )
}
