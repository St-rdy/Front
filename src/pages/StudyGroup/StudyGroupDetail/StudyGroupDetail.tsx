import { useParams, useNavigate } from 'react-router-dom'
import { useStudyGroupDetail } from '../../../hooks/useStudyGroup'
import './StudyGroupDetail.css'

export default function StudyGroupDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useStudyGroupDetail(
    id !== undefined ? Number(id) : undefined
  )

  return (
    <div className="sg-detail-page">
      <div className="sg-detail-header">
        <button className="sg-detail-header__back" onClick={() => navigate(-1)}>
          <img src="/Header/back_arrow.svg" alt="뒤로" />
        </button>
        <h2 className="sg-detail-header__title">스터디 그룹</h2>
        <div className="sg-detail-header__placeholder" />
      </div>

      {isLoading && <p className="sg-detail-state">불러오는 중...</p>}
      {isError && (
        <p className="sg-detail-state">데이터를 불러오지 못했습니다.</p>
      )}

      {data && (
        <>
          <div className="sg-detail-thumbnail">
            {data.group.thumbnail ? (
              <img src={data.group.thumbnail} alt={data.group.title} />
            ) : (
              <div className="sg-detail-thumbnail__fallback" />
            )}
          </div>

          <div className="sg-detail-body">
            <div className="sg-detail-badges">
              <span className="sg-detail-badge">{data.group.category}</span>
              <span
                className={`sg-detail-mode sg-detail-mode--${data.group.mode}`}
              >
                {data.group.mode === 'online' ? '온라인' : '오프라인'}
              </span>
            </div>

            <h1 className="sg-detail-title">{data.group.title}</h1>
            <p className="sg-detail-description">{data.group.description}</p>

            <div className="sg-detail-info">
              <div className="sg-detail-info__row">
                <span className="sg-detail-info__label">📅 기간</span>
                <span className="sg-detail-info__value">
                  {data.group.startDate} ~ {data.group.endDate}
                </span>
              </div>
              {data.group.location && (
                <div className="sg-detail-info__row">
                  <span className="sg-detail-info__label">📍 장소</span>
                  <span className="sg-detail-info__value">
                    {data.group.location}
                  </span>
                </div>
              )}
              <div className="sg-detail-info__row">
                <span className="sg-detail-info__label">👥 인원</span>
                <span className="sg-detail-info__value">
                  {data.group.memberCount}/{data.group.maxMemberCount}명
                </span>
              </div>
              <div className="sg-detail-info__row">
                <span className="sg-detail-info__label">🎯 목표</span>
                <span className="sg-detail-info__value">{data.group.goal}</span>
              </div>
            </div>

            <div className="sg-detail-tags">
              {data.group.tags.map(tag => (
                <span key={tag} className="sg-detail-tag">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="sg-detail-host">
              {data.group.hostAvatar ? (
                <img
                  src={data.group.hostAvatar}
                  alt={data.group.hostName}
                  className="sg-detail-host__avatar"
                />
              ) : (
                <div className="sg-detail-host__avatar-fallback" />
              )}
              <span className="sg-detail-host__name">
                {data.group.hostName}
              </span>
            </div>
          </div>

          <div className="sg-detail-footer">
            <button
              className="sg-detail-apply"
              onClick={() => navigate(`/studygroup/${id}/apply`)}
            >
              참여 신청하기
            </button>
          </div>
        </>
      )}
    </div>
  )
}
