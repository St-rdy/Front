import { useState } from 'react'
import './StudyManagement.css'

type Tab = 'schedule' | 'timer' | 'stats' | 'goals'

const TABS: { id: Tab; label: string }[] = [
  { id: 'schedule', label: '일정' },
  { id: 'timer', label: '타이머' },
  { id: 'stats', label: '학습통계' },
  { id: 'goals', label: '목표달성' },
]

export default function StudyManagement() {
  const [activeTab, setActiveTab] = useState<Tab>('schedule')

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

      {activeTab === 'schedule' && <div data-testid="tab-schedule" />}
      {activeTab === 'timer' && <div data-testid="tab-timer" />}
      {activeTab === 'stats' && <div data-testid="tab-stats" />}
      {activeTab === 'goals' && <div data-testid="tab-goals" />}
    </div>
  )
}
