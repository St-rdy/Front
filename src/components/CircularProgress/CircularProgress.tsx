import React from 'react'
import type { CircularProgressProps } from './CircularProgress.types'
import './CircularProgress.css'

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  label,
  detail,
  color,
  size = 80,
  strokeWidth = 7,
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percentage / 100)

  return (
    <div className="circular-progress">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 배경 트랙 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* 진행 게이지 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        {/* 중앙 퍼센트 텍스트 */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="circular-progress__percent"
        >
          {percentage}%
        </text>
      </svg>
      <span className="circular-progress__label">{label}</span>
      <span className="circular-progress__detail">{detail}</span>
    </div>
  )
}

export default CircularProgress
