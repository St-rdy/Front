import React from 'react'
import type { ModalProps } from './Modal.types'
import './Modal.css'

export const Modal: React.FC<ModalProps> = ({
  isOpen, // 모달이 열려 있는가
  onClose, // 모달을 닫는 함수
  title, // 모달 제목
  content, // 모달 내용
  image, // 모달 이미지
  buttons, // 모달 버튼
  className = '', // 추가적인 클래스 이름
  variant = 'center', // 모달 스타일 변형
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
          className={`modal-content ${className} modal-${variant}`}
          onClick={e => e.stopPropagation()}
        >
          {/* 이미지 */}
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
