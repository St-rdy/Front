import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStudyGroups } from '../../hooks/useStudyGroup'
import { DEFAULT_CHIPS } from './studyGroup.categories'
import type { StudyGroup } from './studyGroup.types'
import './StudyGroup.css'

function StudyGroupCard({ group }: { group: StudyGroup }) {
  const navigate = useNavigate()
  return (
    <div
      className="sg-card"
      onClick={() => navigate(`/studygroup/${group.id}`)}
    >
      <div className="sg-card__inner">
        <div className="sg-card__content">
          <div className="sg-card__badges">
            <span className="sg-card__category">{group.category}</span>
            <span className={`sg-card__mode sg-card__mode--${group.mode}`}>
              {group.mode === 'online' ? '온라인' : '오프라인'}
            </span>
          </div>
          <p className="sg-card__title">{group.title}</p>
          <p className="sg-card__description">{group.description}</p>
          <div className="sg-card__footer">
            <span className="sg-card__members">
              👥 {group.memberCount}/{group.maxMemberCount}명
            </span>
            <span className="sg-card__period">
              {group.startDate} ~ {group.endDate}
            </span>
          </div>
        </div>
        <span className="sg-card__arrow">›</span>
      </div>
    </div>
  )
}

export default function StudyGroupPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCats =
    searchParams.get('cats')?.split(',').filter(Boolean) ?? []
  const { data, isLoading, isError } = useStudyGroups(selectedCats)

  // 기본 칩 토글 (선택 추가/제거)
  function togglePresetChip(cat: string) {
    const next = selectedCats.includes(cat)
      ? selectedCats.filter(c => c !== cat)
      : [...selectedCats, cat]
    if (next.length > 0) {
      setSearchParams({ cats: next.join(',') })
    } else {
      setSearchParams({})
    }
  }

  // 추가된 카테고리 (전체 카테고리 페이지에서 선택, 기본 칩 외 항목) 제거
  function removeAddedChip(cat: string) {
    const next = selectedCats.filter(c => c !== cat)
    if (next.length > 0) {
      setSearchParams({ cats: next.join(',') })
    } else {
      setSearchParams({})
    }
  }

  // 기본 칩에 없는 추가 선택 카테고리
  const addedCats = selectedCats.filter(c => !DEFAULT_CHIPS.includes(c))

  const popularGroups = data?.groups.slice(0, 1) ?? []
  const recommendedGroups = data?.groups.slice(1) ?? []

  return (
    <div className="sg-page">
      {/* 카테고리 칩바 */}
      <div className="sg-chip-bar">
        <button
          className="sg-chip-bar__all"
          onClick={() =>
            navigate(
              `/studygroup/category${selectedCats.length > 0 ? `?cats=${selectedCats.join(',')}` : ''}`
            )
          }
        >
          ≡ 전체 카테고리
        </button>

        <span className="sg-chip-bar__divider" aria-hidden="true" />

        {/* 기본 카테고리 (토글 가능) */}
        {DEFAULT_CHIPS.map(cat => (
          <button
            key={cat}
            className={`sg-chip-bar__preset${selectedCats.includes(cat) ? ' sg-chip-bar__preset--active' : ''}`}
            onClick={() => togglePresetChip(cat)}
          >
            {cat}
          </button>
        ))}

        {/* 전체 카테고리 페이지에서 추가된 항목 (✕ 제거 가능) */}
        {addedCats.map(cat => (
          <button
            key={cat}
            className="sg-chip-bar__item"
            onClick={() => removeAddedChip(cat)}
          >
            {cat} <span className="sg-chip-bar__item-x">✕</span>
          </button>
        ))}
      </div>

      {/* 배너 */}
      <div className="sg-banner">
        <div className="sg-banner__text">
          <h2 className="sg-banner__title">함께 공부해요</h2>
          <p className="sg-banner__sub">나에게 맞는 스터디 그룹을 찾아보세요</p>
        </div>
        <button
          className="sg-banner__cta"
          onClick={() => navigate('/studygroup/create')}
        >
          + 만들기
        </button>
      </div>

      {isLoading && <p className="sg-state">불러오는 중...</p>}
      {isError && <p className="sg-state">데이터를 불러오지 못했습니다.</p>}

      {data && data.groups.length === 0 && (
        <div className="sg-empty">
          <p className="sg-empty__emoji">📚</p>
          <p className="sg-empty__title">
            {selectedCats.length > 0
              ? '해당 카테고리의 그룹이 없어요'
              : '아직 스터디 그룹이 없어요'}
          </p>
          <p className="sg-empty__sub">
            {selectedCats.length > 0
              ? '다른 카테고리를 선택해보세요'
              : '첫 번째 그룹을 직접 만들어보세요'}
          </p>
          {selectedCats.length === 0 && (
            <button
              className="sg-empty__cta"
              onClick={() => navigate('/studygroup/create')}
            >
              그룹 만들기
            </button>
          )}
        </div>
      )}

      {data &&
        data.groups.length > 0 &&
        (selectedCats.length > 0 ? (
          <div className="sg-section">
            <div className="sg-section__header">
              <h3 className="sg-section__title">
                검색 결과 {data.groups.length}개
              </h3>
            </div>
            {data.groups.map(group => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <>
            {popularGroups.length > 0 && (
              <div className="sg-section">
                <div className="sg-section__header">
                  <h3 className="sg-section__title">이번 주 인기 그룹 🔥</h3>
                </div>
                {popularGroups.map(group => (
                  <StudyGroupCard key={group.id} group={group} />
                ))}
              </div>
            )}
            {recommendedGroups.length > 0 && (
              <div className="sg-section">
                <div className="sg-section__header">
                  <h3 className="sg-section__title">추천 스터디 그룹</h3>
                </div>
                {recommendedGroups.map(group => (
                  <StudyGroupCard key={group.id} group={group} />
                ))}
              </div>
            )}
          </>
        ))}

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
