import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  useSchedules,
  useAddSchedule,
  useDeleteSchedule,
  useGoals,
  useAddGoal,
  useStudyStats,
} from '../../hooks/useStudyManagement'
import { useTimer } from '../../hooks/useTimer'
import { formatDate, formatTime } from './studyManagement.types'
import type { ScheduleItem, GoalItem } from './studyManagement.types'
import './StudyManagement.css'

type Tab = 'schedule' | 'timer' | 'stats' | 'goals'

const TABS: { id: Tab; label: string }[] = [
  { id: 'schedule', label: '일정' },
  { id: 'timer', label: '타이머' },
  { id: 'stats', label: '학습통계' },
  { id: 'goals', label: '목표달성' },
]

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function getWeekDays(referenceDate: string) {
  const ref = new Date(referenceDate + 'T00:00:00')
  const dayOfWeek = ref.getDay()
  const sunday = new Date(ref)
  sunday.setDate(ref.getDate() - dayOfWeek)
  const todayStr = formatDate(new Date())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday)
    d.setDate(sunday.getDate() + i)
    const date = formatDate(d)
    return {
      date,
      label: DAY_LABELS[i],
      num: d.getDate(),
      isToday: date === todayStr,
    }
  })
}

// ── 일정 추가 모달 ──────────────────────────────────────────────────
function AddScheduleModal({
  selectedDate,
  onClose,
}: {
  selectedDate: string
  onClose: () => void
}) {
  const [subject, setSubject] = useState('')
  const [time, setTime] = useState('')
  const { mutate, isPending } = useAddSchedule()

  function handleSubmit() {
    if (!subject.trim() || !time) return
    mutate(
      { subject: subject.trim(), date: selectedDate, time },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-sheet" onClick={e => e.stopPropagation()}>
        <p className="sm-sheet__title">일정 추가</p>
        <input
          className="sm-input"
          placeholder="과목명 (예: 영어 공부)"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <input
          className="sm-input"
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
        />
        <div className="sm-sheet__actions">
          <button className="sm-btn-cancel" onClick={onClose}>
            취소
          </button>
          <button
            className="sm-btn-confirm"
            onClick={handleSubmit}
            disabled={!subject.trim() || !time || isPending}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  )
}

// ── 일정 탭 ────────────────────────────────────────────────────────
function ScheduleTab({
  selectedDate,
  onDateChange,
}: {
  selectedDate: string
  onDateChange: (d: string) => void
}) {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const weekDays = getWeekDays(selectedDate)
  const { data: schedules, isLoading, isError } = useSchedules(selectedDate)
  const { mutate: deleteSchedule } = useDeleteSchedule()

  return (
    <>
      {/* 주간 스트립 */}
      <div className="sm-week-strip">
        <button
          className="sm-week-strip__cal"
          aria-label="캘린더 열기"
          onClick={() => navigate(`/study/calendar?date=${selectedDate}`)}
        >
          📅
        </button>
        <div className="sm-week-strip__days">
          {weekDays.map(d => (
            <button
              key={d.date}
              className={`sm-week-strip__day${d.isToday ? ' sm-week-strip__day--today' : ''}${d.date === selectedDate ? ' sm-week-strip__day--selected' : ''}`}
              onClick={() => onDateChange(d.date)}
            >
              <span className="sm-week-strip__day-label">{d.label}</span>
              <span className="sm-week-strip__day-num">{d.num}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 일정 목록 */}
      <div className="sm-schedule-section">
        <p className="sm-schedule-date">{selectedDate}</p>
        {isLoading && <p className="sm-state">불러오는 중...</p>}
        {isError && <p className="sm-state">데이터를 불러오지 못했습니다.</p>}
        {schedules && schedules.length === 0 && (
          <div className="sm-empty">
            <p className="sm-empty__emoji">📋</p>
            <p className="sm-empty__title">이 날은 일정이 없어요</p>
            <p className="sm-empty__sub">아래 + 버튼으로 일정을 추가해보세요</p>
          </div>
        )}
        {schedules?.map((s: ScheduleItem) => (
          <div key={s.id} className="sm-schedule-card">
            <span className="sm-schedule-card__bar" />
            <span className="sm-schedule-card__subject">{s.subject}</span>
            <span className="sm-schedule-card__time">{s.time}</span>
            <button
              className="sm-schedule-card__delete"
              aria-label={`${s.subject} 삭제`}
              onClick={() => deleteSchedule(s.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        className="sm-fab"
        aria-label="일정 추가"
        onClick={() => setShowModal(true)}
      >
        +
      </button>

      {showModal && (
        <AddScheduleModal
          selectedDate={selectedDate}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

// ── 타이머 탭 ──────────────────────────────────────────────────────
function TimerTab({ scheduleSubjects }: { scheduleSubjects: string[] }) {
  const { elapsed, isRunning, subject, start, pause, reset } = useTimer()
  const [selectedSubject, setSelectedSubject] = useState(
    scheduleSubjects[0] ?? ''
  )

  return (
    <div className="sm-timer-section">
      <div className="sm-timer-ring">
        <p className="sm-timer-display">{formatTime(elapsed)}</p>
        <p className="sm-timer-subject-label">
          {subject || '과목을 선택하세요'}
        </p>
      </div>

      {!isRunning && (
        <div className="sm-timer-select-wrap">
          <select
            className="sm-timer-selector"
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            aria-label="공부 과목 선택"
          >
            <option value="">과목 선택</option>
            {scheduleSubjects.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="기타">기타</option>
          </select>
        </div>
      )}

      <div className="sm-timer-controls">
        {!isRunning ? (
          <button
            className="sm-timer-btn sm-timer-btn--start"
            onClick={() => start(selectedSubject || '기타')}
            disabled={!selectedSubject}
          >
            START
          </button>
        ) : (
          <>
            <button
              className="sm-timer-btn sm-timer-btn--pause"
              onClick={pause}
            >
              일시정지
            </button>
            <button
              className="sm-timer-btn sm-timer-btn--start"
              style={{ flex: 1 }}
              onClick={reset}
            >
              STOP
            </button>
          </>
        )}
        <button className="sm-timer-btn sm-timer-btn--reset" onClick={reset}>
          초기화
        </button>
      </div>
    </div>
  )
}

// ── 학습통계 탭 ────────────────────────────────────────────────────
function StatsTab() {
  const { data: stats, isLoading, isError } = useStudyStats()

  if (isLoading) return <p className="sm-state">불러오는 중...</p>
  if (isError || !stats)
    return <p className="sm-state">데이터를 불러오지 못했습니다.</p>

  return (
    <div className="sm-stats-section">
      <div className="sm-stat-card">
        <div className="sm-stat-card__icon sm-stat-card__icon--green">📊</div>
        <div className="sm-stat-card__content">
          <span className="sm-stat-card__label">일간 학습률</span>
          <span className="sm-stat-card__value">
            {stats.dailyRate}
            <span className="sm-stat-card__unit">%</span>
          </span>
        </div>
      </div>
      <div className="sm-stat-card">
        <div className="sm-stat-card__icon sm-stat-card__icon--blue">📈</div>
        <div className="sm-stat-card__content">
          <span className="sm-stat-card__label">주간 학습률</span>
          <span className="sm-stat-card__value">
            {stats.weeklyRate}
            <span className="sm-stat-card__unit">%</span>
          </span>
        </div>
      </div>
      <div className="sm-stat-card">
        <div className="sm-stat-card__icon sm-stat-card__icon--orange">🔥</div>
        <div className="sm-stat-card__content">
          <span className="sm-stat-card__label">연속 공부 일수</span>
          <span className="sm-stat-card__value">
            {stats.streakDays}
            <span className="sm-stat-card__unit">일</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ── 목표추가 모달 ──────────────────────────────────────────────────
function AddGoalModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [hours, setHours] = useState('')
  const { mutate, isPending } = useAddGoal()

  function handleSubmit() {
    if (!title.trim() || !startDate || !endDate || !hours) return
    mutate(
      {
        title: title.trim(),
        startDate,
        endDate,
        targetMinutes: Number(hours) * 60,
      },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-sheet" onClick={e => e.stopPropagation()}>
        <p className="sm-sheet__title">목표 추가</p>
        <input
          className="sm-input"
          placeholder="목표 제목 (예: 영어 단어 1시간)"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className="sm-input"
          type="date"
          placeholder="시작일"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          aria-label="시작일"
        />
        <input
          className="sm-input"
          type="date"
          placeholder="종료일"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          aria-label="종료일"
        />
        <input
          className="sm-input"
          type="number"
          placeholder="목표 시간 (시간 단위, 예: 1)"
          value={hours}
          onChange={e => setHours(e.target.value)}
          min="0"
        />
        <div className="sm-sheet__actions">
          <button className="sm-btn-cancel" onClick={onClose}>
            취소
          </button>
          <button
            className="sm-btn-confirm"
            onClick={handleSubmit}
            disabled={
              !title.trim() || !startDate || !endDate || !hours || isPending
            }
          >
            추가
          </button>
        </div>
      </div>
    </div>
  )
}

// ── 목표달성 탭 ────────────────────────────────────────────────────
function GoalsTab() {
  const [showModal, setShowModal] = useState(false)
  const { data: goals, isLoading, isError } = useGoals()

  if (isLoading) return <p className="sm-state">불러오는 중...</p>
  if (isError) return <p className="sm-state">데이터를 불러오지 못했습니다.</p>

  const rate = (g: GoalItem) =>
    g.targetMinutes === 0
      ? 0
      : Math.min(100, Math.round((g.currentMinutes / g.targetMinutes) * 100))

  return (
    <>
      <div className="sm-goals-section">
        {(!goals || goals.length === 0) && (
          <div className="sm-empty">
            <p className="sm-empty__emoji">🎯</p>
            <p className="sm-empty__title">목표를 추가해보세요</p>
            <p className="sm-empty__sub">아래 + 버튼으로 목표를 설정하세요</p>
          </div>
        )}
        {goals?.map((g: GoalItem) => (
          <div key={g.id} className="sm-goal-card">
            <div className="sm-goal-card__header">
              <span className="sm-goal-card__title">{g.title}</span>
              <span className="sm-goal-card__period">
                {g.startDate} ~ {g.endDate}
              </span>
            </div>
            <div className="sm-goal-card__progress-bar">
              <div
                className="sm-goal-card__progress-fill"
                style={{ width: `${rate(g)}%` }}
              />
            </div>
            <div className="sm-goal-card__footer">
              <span className="sm-goal-card__rate">{rate(g)}%</span>
              <span className="sm-goal-card__time">
                {Math.floor(g.currentMinutes / 60)}h /{' '}
                {Math.floor(g.targetMinutes / 60)}h
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        className="sm-fab"
        aria-label="목표 추가"
        onClick={() => setShowModal(true)}
      >
        +
      </button>

      {showModal && <AddGoalModal onClose={() => setShowModal(false)} />}
    </>
  )
}

// ── 메인 페이지 ────────────────────────────────────────────────────
export default function StudyManagement() {
  const [searchParams] = useSearchParams()
  const initialDate = searchParams.get('date') ?? formatDate(new Date())
  const [activeTab, setActiveTab] = useState<Tab>('schedule')
  const [selectedDate, setSelectedDate] = useState(initialDate)

  // 타이머 탭에서 과목 선택을 위해 오늘 일정 과목 목록 미리 로드
  const { data: todaySchedules } = useSchedules(selectedDate)
  const subjects = [...new Set(todaySchedules?.map(s => s.subject) ?? [])]

  return (
    <div className="sm-page">
      <div className="sm-tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`sm-tab${activeTab === tab.id ? ' sm-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'schedule' && (
        <ScheduleTab
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      )}
      {activeTab === 'timer' && <TimerTab scheduleSubjects={subjects} />}
      {activeTab === 'stats' && <StatsTab />}
      {activeTab === 'goals' && <GoalsTab />}
    </div>
  )
}
