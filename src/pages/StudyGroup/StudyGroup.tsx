import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FilterBar from '../../components/FilterBar/FilterBar'
import { useStudyGroups } from '../../hooks/useStudyGroup'
import type { StudyGroup } from './studyGroup.types'
import './StudyGroup.css'

const CATEGORIES = ['전체', '언어학습', '취업준비', 'AI/개발', '공부인증']

const CATEGORY_MAP: Record<string, string | undefined> = {
  전체: undefined,
  언어학습: '언어학습',
  취업준비: '취업준비',
  'AI/개발': 'AI/개발',
  공부인증: '공부인증',
}

function StudyGroupCard({ group }: { group: StudyGroup }) {
  const navigate = useNavigate()
  return (
    <div
      className="sg-card"
      onClick={() => navigate(`/studygroup/${group.id}`)}
    >
      <div className="sg-card__content">
        <div className="sg-card__top">
          <span className="sg-card__category">{group.category}</span>
          <span className={`sg-card__mode sg-card__mode--${group.mode}`}>
            {group.mode === 'online' ? '온라인' : '오프라인'}
          </span>
        </div>
        <p className="sg-card__title">{group.title}</p>
        <p className="sg-card__description">{group.description}</p>
        <div className="sg-card__bottom">
          <span className="sg-card__meta-item">
            👥 {group.memberCount}/{group.maxMemberCount}명
          </span>
          <span className="sg-card__meta-item">
            📅 {group.startDate} ~ {group.endDate}
          </span>
        </div>
      </div>
      {group.thumbnail ? (
        <img
          src={group.thumbnail}
          alt={group.title}
          className="sg-card__thumbnail"
        />
      ) : (
        <div className="sg-card__thumbnail-fallback" />
      )}
    </div>
  )
}

export default function StudyGroupPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const { data, isLoading, isError } = useStudyGroups(
    CATEGORY_MAP[selectedCategory]
  )

  return (
    <div className="sg-page">
      <FilterBar
        categories={CATEGORIES}
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />

      {isLoading && <p className="sg-state">불러오는 중...</p>}
      {isError && <p className="sg-state">데이터를 불러오지 못했습니다.</p>}

      {data && (
        <div className="sg-list">
          {data.groups.length === 0 ? (
            <p className="sg-state">스터디 그룹이 없습니다.</p>
          ) : (
            data.groups.map(group => (
              <StudyGroupCard key={group.id} group={group} />
            ))
          )}
        </div>
      )}

      <button
        className="sg-fab"
        onClick={() => navigate('/studygroup/create')}
        aria-label="스터디 그룹 만들기"
      >
        <img src="/Community/edit.svg" alt="스터디 그룹 만들기" />
      </button>
    </div>
  )
}
