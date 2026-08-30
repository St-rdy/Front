import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useApplyStudyGroup,
  useStudyGroupDetail,
} from '../../../hooks/useStudyGroup'
import './StudyGroupApply.css'

export default function StudyGroupApply() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useStudyGroupDetail(
    id !== undefined ? Number(id) : undefined
  )
  const [motivation, setMotivation] = useState('')
  const [contact, setContact] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isDone, setIsDone] = useState(false)

  const apply = useApplyStudyGroup(id !== undefined ? Number(id) : undefined)

  function handleSubmit() {
    if (!motivation.trim() || apply.isPending) return
    setSubmitError('')

    apply.mutate(
      { motivation: motivation.trim(), contact: contact.trim() || undefined },
      {
        onSuccess: () => setIsDone(true),
        onError: () =>
          setSubmitError('신청에 실패했어요. 잠시 후 다시 시도해주세요.'),
      }
    )
  }

  // 신청이 접수되면 결과 화면을 보여줍니다.
  if (isDone) {
    return (
      <div className="sg-apply-page sg-apply-page--done">
        <div className="sg-apply-done">
          <p className="sg-apply-done__emoji">🎉</p>
          <h2 className="sg-apply-done__title">신청이 접수되었어요</h2>
          <p className="sg-apply-done__sub">
            스터디장이 확인하면 알림으로 알려드릴게요.
          </p>
          <button
            className="sg-apply-submit"
            onClick={() => navigate('/studygroup', { replace: true })}
          >
            스터디 목록으로
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="sg-apply-page">
      <div className="sg-apply-header">
        <button className="sg-apply-header__back" onClick={() => navigate(-1)}>
          <img src="/Header/back_arrow.svg" alt="뒤로" />
        </button>
        <h2 className="sg-apply-header__title">스터디 신청</h2>
        <div className="sg-apply-header__placeholder" />
      </div>

      {isLoading && <p className="sg-apply-state">불러오는 중...</p>}
      {isError && (
        <p className="sg-apply-state">데이터를 불러오지 못했습니다.</p>
      )}

      {data && (
        <div className="sg-apply-group-card">
          <div className="sg-apply-group-card__badges">
            <span className="sg-apply-group-card__category">
              {data.group.category}
            </span>
            <span
              className={`sg-apply-group-card__mode sg-apply-group-card__mode--${data.group.mode}`}
            >
              {data.group.mode === 'online' ? '온라인' : '오프라인'}
            </span>
          </div>
          <p className="sg-apply-group-card__title">{data.group.title}</p>
          <div className="sg-apply-group-card__meta">
            <span>
              👥 {data.group.memberCount}/{data.group.maxMemberCount}명
            </span>
            <span>
              📅 {data.group.startDate} ~ {data.group.endDate}
            </span>
          </div>
        </div>
      )}

      <div className="sg-apply-form">
        <div className="sg-apply-form__field">
          <label className="sg-apply-form__label">
            지원 동기 <span className="sg-apply-form__required">*</span>
          </label>
          <textarea
            className="sg-apply-form__textarea"
            placeholder="이 스터디에 지원하는 이유를 작성해주세요"
            value={motivation}
            onChange={e => setMotivation(e.target.value)}
          />
        </div>
        <div className="sg-apply-form__field">
          <label className="sg-apply-form__label">연락처 (선택)</label>
          <input
            className="sg-apply-form__input"
            placeholder="연락 가능한 이메일 또는 전화번호"
            value={contact}
            onChange={e => setContact(e.target.value)}
          />
        </div>
      </div>

      <div className="sg-apply-footer">
        {submitError && (
          <p className="sg-apply-error" role="alert">
            {submitError}
          </p>
        )}
        <button
          className="sg-apply-submit"
          onClick={handleSubmit}
          disabled={!motivation.trim() || apply.isPending}
        >
          {apply.isPending ? '신청 중...' : '신청 완료'}
        </button>
      </div>
    </div>
  )
}
