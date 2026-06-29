import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { STUDY_CATEGORIES } from '../studyGroup.categories'
import './StudyGroupCategory.css'

export default function StudyGroupCategory() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialCats = searchParams.get('cats')?.split(',').filter(Boolean) ?? []
  const [selected, setSelected] = useState<string[]>(initialCats)

  function toggleCategory(cat: string) {
    setSelected(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  function handleConfirm() {
    if (selected.length > 0) {
      navigate(`/studygroup?cats=${selected.join(',')}`, { replace: true })
    } else {
      navigate('/studygroup', { replace: true })
    }
  }

  return (
    <div className="sg-cat-page">
      <div className="sg-cat-header">
        <button
          className="sg-cat-header__close"
          onClick={() => navigate(-1)}
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      <div className="sg-cat-content">
        <h1 className="sg-cat-title">
          <span className="sg-cat-title--highlight">스터디</span>의 카테고리를{' '}
          정해주세요
        </h1>

        {STUDY_CATEGORIES.map(group => (
          <div key={group.section} className="sg-cat-section">
            <h2 className="sg-cat-section__title">{group.section}</h2>
            <div className="sg-cat-tags">
              {group.items.map(item => (
                <button
                  key={item}
                  className={`sg-cat-tag${selected.includes(item) ? ' sg-cat-tag--selected' : ''}`}
                  onClick={() => toggleCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sg-cat-footer">
        <button className="sg-cat-confirm" onClick={handleConfirm}>
          {selected.length > 0 ? `${selected.length}개 선택됨 · ` : ''}정했어요
        </button>
      </div>
    </div>
  )
}
