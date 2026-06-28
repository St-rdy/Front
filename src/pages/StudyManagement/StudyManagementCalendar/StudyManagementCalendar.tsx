import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { formatDate } from '../studyManagement.types'
import './StudyManagementCalendar.css'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function getMonthGrid(year: number, month: number): Array<string | null> {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<string | null> = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(formatDate(new Date(year, month, d)))
  }
  return cells
}

export default function StudyManagementCalendar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paramDate = searchParams.get('date')

  const initialDate = paramDate ?? formatDate(new Date())
  const [selectedDate, setSelectedDate] = useState(initialDate)

  const init = new Date(initialDate + 'T00:00:00')
  const [viewYear, setViewYear] = useState(init.getFullYear())
  const [viewMonth, setViewMonth] = useState(init.getMonth())

  const todayStr = formatDate(new Date())
  const cells = getMonthGrid(viewYear, viewMonth)

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear(y => y - 1)
      setViewMonth(11)
    } else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear(y => y + 1)
      setViewMonth(0)
    } else setViewMonth(m => m + 1)
  }
  function confirm(date?: string) {
    const target = date ?? selectedDate
    navigate(`/study?date=${target}`, { replace: true })
  }

  return (
    <div className="smc-page">
      <div className="smc-header">
        <button
          className="smc-header__close"
          aria-label="닫기"
          onClick={() => navigate(-1)}
        >
          ✕
        </button>
        <span className="smc-header__title">날짜 선택</span>
        <span style={{ width: 38 }} />
      </div>

      <div className="smc-month-nav">
        <button
          className="smc-month-nav__btn"
          aria-label="이전 달"
          onClick={prevMonth}
        >
          ‹
        </button>
        <span className="smc-month-nav__label">
          {viewYear}년 {viewMonth + 1}월
        </span>
        <button
          className="smc-month-nav__btn"
          aria-label="다음 달"
          onClick={nextMonth}
        >
          ›
        </button>
      </div>

      <div className="smc-weekday-header">
        {WEEKDAYS.map(d => (
          <span key={d} className="smc-weekday">
            {d}
          </span>
        ))}
      </div>

      <div className="smc-grid">
        {cells.map((date, i) => {
          if (!date)
            return <div key={`e-${i}`} className="smc-day smc-day--empty" />
          const dayOfWeek = i % 7
          const isSelected = date === selectedDate
          const isToday = date === todayStr
          const cls = [
            'smc-day',
            isSelected ? 'smc-day--selected' : '',
            isToday ? 'smc-day--today' : '',
            dayOfWeek === 0 ? 'smc-day--sun' : '',
            dayOfWeek === 6 ? 'smc-day--sat' : '',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={date}
              className={cls}
              onClick={() => {
                setSelectedDate(date)
                confirm(date)
              }}
            >
              <span className="smc-day__num">
                {parseInt(date.slice(8), 10)}
              </span>
            </button>
          )
        })}
      </div>

      <div className="smc-footer">
        <button className="smc-confirm-btn" onClick={() => confirm()}>
          {selectedDate} 확인
        </button>
      </div>
    </div>
  )
}
