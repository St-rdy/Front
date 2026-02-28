import React from 'react'
import type { ModalProps } from './Modal.types'
import './Modal.css'

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  image,
  buttons,
  className = '',
}) => {
  if (!isOpen) return null

  // 버튼이 1개인지 2개인지 확인
  const isSingleButton = buttons.length === 1

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="modal-overlay" onClick={onClose}>
        {/* 모달 컨텐츠 */}
        <div
          className={`modal-content ${className}`}
          onClick={e => e.stopPropagation()}
        >
          {/* 이미지 (선택적) */}
          {image && (
            <div className="modal-image">
              <img src={image} alt={title} />
            </div>
          )}

          {/* 제목 */}
          <h2 className="modal-title">{title}</h2>

          {/* 내용 */}
          <p className="modal-content-text">{content}</p>

          {/* 버튼 영역 */}
          <div
            className={`modal-buttons ${isSingleButton ? 'single' : 'double'}`}
          >
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`modal-button modal-button-${button.variant || 'secondary'}`}
                onClick={button.onClick}
                disabled={button.disabled}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
