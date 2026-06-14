import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { StudyGroupCreateForm } from '../studyGroup.types'
import './StudyGroupCreate.css'

const CATEGORIES = ['취업 준비', '공부 인증', '스터디 그룹', '언어학습']
const TOTAL_STEPS = 3

const initialForm: StudyGroupCreateForm = {
  title: '',
  description: '',
  category: '',
  mode: 'online',
  tags: [],
  maxMemberCount: 5,
  startDate: '',
  endDate: '',
  goal: '',
  location: '',
}

export default function StudyGroupCreate() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<StudyGroupCreateForm>(initialForm)
  const [tagInput, setTagInput] = useState('')

  function handleNext() {
    if (step < TOTAL_STEPS) setStep(prev => prev + 1)
  }

  function handleBack() {
    if (step > 1) setStep(prev => prev - 1)
    else navigate(-1)
  }

  function handleSubmit() {
    // TODO: API 연동
    navigate('/studygroup')
  }

  function addTag() {
    const trimmed = tagInput.trim()
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, trimmed] }))
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  return (
    <div className="sg-create-page">
      <div className="sg-create-header">
        <button className="sg-create-header__back" onClick={handleBack}>
          <img src="/Header/back_arrow.svg" alt="뒤로" />
        </button>
        <h2 className="sg-create-header__title">스터디 그룹 만들기</h2>
        <div className="sg-create-header__placeholder" />
      </div>

      {/* 진행 단계 표시 */}
      <div className="sg-create-progress">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`sg-create-progress__dot${i + 1 <= step ? ' sg-create-progress__dot--active' : ''}`}
          />
        ))}
      </div>

      <div className="sg-create-body">
        {/* Step 1: 카테고리 & 방식 */}
        {step === 1 && (
          <div className="sg-create-step">
            <h3 className="sg-create-step__title">어떤 스터디인가요?</h3>

            <p className="sg-create-step__label">카테고리</p>
            <div className="sg-create-categories">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`sg-create-category${form.category === cat ? ' sg-create-category--active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, category: cat }))}
                >
                  {cat}
                </button>
              ))}
            </div>

            <p className="sg-create-step__label">방식</p>
            <div className="sg-create-mode">
              <button
                className={`sg-create-mode__btn${form.mode === 'online' ? ' sg-create-mode__btn--active' : ''}`}
                onClick={() => setForm(prev => ({ ...prev, mode: 'online' }))}
              >
                온라인
              </button>
              <button
                className={`sg-create-mode__btn${form.mode === 'offline' ? ' sg-create-mode__btn--active' : ''}`}
                onClick={() => setForm(prev => ({ ...prev, mode: 'offline' }))}
              >
                오프라인
              </button>
            </div>

            {form.mode === 'offline' && (
              <>
                <p className="sg-create-step__label">장소</p>
                <input
                  className="sg-create-input"
                  placeholder="장소를 입력하세요"
                  value={form.location ?? ''}
                  onChange={e =>
                    setForm(prev => ({ ...prev, location: e.target.value }))
                  }
                />
              </>
            )}
          </div>
        )}

        {/* Step 2: 제목 & 소개 & 태그 */}
        {step === 2 && (
          <div className="sg-create-step">
            <h3 className="sg-create-step__title">스터디를 소개해주세요</h3>

            <p className="sg-create-step__label">제목</p>
            <input
              className="sg-create-input"
              placeholder="스터디 제목을 입력하세요"
              value={form.title}
              onChange={e =>
                setForm(prev => ({ ...prev, title: e.target.value }))
              }
            />

            <p className="sg-create-step__label">소개</p>
            <textarea
              className="sg-create-textarea"
              placeholder="스터디를 소개해주세요"
              value={form.description}
              onChange={e =>
                setForm(prev => ({ ...prev, description: e.target.value }))
              }
            />

            <p className="sg-create-step__label">목표</p>
            <input
              className="sg-create-input"
              placeholder="스터디 목표를 입력하세요"
              value={form.goal}
              onChange={e =>
                setForm(prev => ({ ...prev, goal: e.target.value }))
              }
            />

            <p className="sg-create-step__label">태그</p>
            <div className="sg-create-tag-input">
              <input
                className="sg-create-input"
                placeholder="태그를 입력하고 추가하세요"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag()}
              />
              <button className="sg-create-tag-input__add" onClick={addTag}>
                추가
              </button>
            </div>
            <div className="sg-create-tags">
              {form.tags.map(tag => (
                <span key={tag} className="sg-create-tag">
                  #{tag}
                  <button
                    className="sg-create-tag__remove"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: 기간 & 인원 */}
        {step === 3 && (
          <div className="sg-create-step">
            <h3 className="sg-create-step__title">
              기간과 인원을 설정해주세요
            </h3>

            <p className="sg-create-step__label">시작일</p>
            <input
              className="sg-create-input"
              type="date"
              value={form.startDate}
              onChange={e =>
                setForm(prev => ({ ...prev, startDate: e.target.value }))
              }
            />

            <p className="sg-create-step__label">종료일</p>
            <input
              className="sg-create-input"
              type="date"
              value={form.endDate}
              onChange={e =>
                setForm(prev => ({ ...prev, endDate: e.target.value }))
              }
            />

            <p className="sg-create-step__label">최대 인원</p>
            <input
              className="sg-create-input"
              type="number"
              min={2}
              max={20}
              value={form.maxMemberCount}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  maxMemberCount: Number(e.target.value),
                }))
              }
            />
          </div>
        )}
      </div>

      <div className="sg-create-footer">
        {step < TOTAL_STEPS ? (
          <button className="sg-create-next" onClick={handleNext}>
            다음
          </button>
        ) : (
          <button className="sg-create-next" onClick={handleSubmit}>
            완료
          </button>
        )}
      </div>
    </div>
  )
}
