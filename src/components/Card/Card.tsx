import React from 'react'
import type { CardProps } from './Card.types'
import './Card.css'

export const Card: React.FC<CardProps> = props => {
  const {
    // 조건 추가
    title,
    date,
    imageUrl,
    isBookmark = false,
    onClick,
    onOptionClick,
    onHeartClick,
  } = props

  const displayImage = imageUrl || '/Card/image.svg'

  return (
    <div className="card-container" onClick={onClick}>
      {/* 상단 큰 이미지 */}
      <div className="card-image-wrapper">
        <img src={displayImage} alt={title} className="card-image" />
      </div>

      {/*  인포 */}
      <div className="card-info">
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          {/* 오른쪽 아이콘 */}ㅣ
          <div className="card-icon-group">
            {isBookmark ? (
              /* 북마크 페이지일 때: 하트 노출 */
              <button
                className="card-icon-btn"
                onClick={e => {
                  e.stopPropagation()
                  onHeartClick?.()
                }}
              >
                <img src="/Card/card_heart.svg" alt="좋아요" />
              </button>
            ) : (
              /* 기본 페이지일 때: 옵션 노출 */
              <button
                className="card-icon-btn"
                onClick={e => {
                  e.stopPropagation()
                  onOptionClick?.()
                }}
              >
                <img src="/Card/card_option.svg" alt="옵션" />
              </button>
            )}
          </div>
        </div>
        {/* 제목 아래 날짜 */}
        <div className="card-footer">
          <span className="card-date">{date}</span>
        </div>
      </div>
    </div>
  )
}
