import React from 'react'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CommunityWriteForm } from './CommunityWrite.types'
import './CommunityWrite.css'

// 카테고리 선택지 목록 (상수로 분리하여 컴포넌트 외부에 선언)
const CATEGORIES = ['취업 준비', '공부 인증', '스터디 그룹']

export default function CommunityWrite() {
  const navigate = useNavigate()

  // 파일 input 요소에 직접 접근하기 위한 ref
  // HTML 요소중 input element 타입의 DOM 요소를 참조
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 폼 전체 상태를 하나의 객체로 관리
  const [form, setForm] = useState<CommunityWriteForm>({
    title: '',
    category: '',
    content: '',
    images: [],
  })

  // 이미지 미리보기용 URL 목록 (File 객체가 아닌 화면 표시용 임시 URL)
  const [previews, setPreviews] = useState<string[]>([])

  // 카테고리 드롭다운 열림/닫힘 상태
  const [showCategories, setShowCategories] = useState(false)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    // target.files는 FileList 타입이기 때문에 Array.from을 통해 배열의 형태로 변환
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // 새로운 이미지가 추가됐을 경우 동작되는 부분입니다.
    // prev.images ?? [] -> 기존 이미지가 없으면 빈 배열로 대체
    // ...files -> 새로 선택한 파일들을 이어 붙임
    setForm(prev => ({
      ...prev,
      images: [...(prev.images ?? []), ...files],
    }))

    setPreviews(prev => [
      ...prev, // 기존 미리보기 URL 목록을 가져오고
      ...files.map(f => URL.createObjectURL(f)), // 새 파일마다, 임시 URL을 만들어 붙이는 형식
    ])
  }

  function handleSubmit() {
    navigate(-1)
  }

  return (
    <div className="write-page">
      {/* 헤더: 뒤로가기 / 제목 / 완료 버튼 */}
      <div className="write-header">
        <button className="write-header__back" onClick={() => navigate(-1)}>
          <img src="/Header/back_arrow.svg" alt="뒤로" />
        </button>
        <h2 className="write-header__title">글 작성</h2>
        <button className="write-header__done" onClick={handleSubmit}>
          완료
        </button>
      </div>

      <div className="write-body">
        {/* 제목 입력 */}
        <input
          className="write-title"
          type="text"
          placeholder="제목을 입력하세요"
          value={form.title}
          onChange={e =>
            setForm(prev => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />

        <div className="write-divider" />

        {/* 카테고리 선택 버튼 */}
        <button
          className="write-category"
          onClick={() => setShowCategories(prev => !prev)}
        >
          <span
            className={
              form.category
                ? 'write-category__selected'
                : 'write-category__placeholder'
            }
          >
            {form.category || '카테고리 선택하기'}
          </span>
          <img
            src="/Header/back_arrow.svg"
            alt="선택"
            className="write-category__arrow"
          />
        </button>

        {/* showCategories가 true일 때만 목록 렌더링 */}
        {showCategories && (
          <ul className="write-category-list">
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <button
                  className="write-category-list__item"
                  onClick={() => {
                    setForm(prev => ({
                      // ...prev : 나머지 필드는 유지, category만 선택한 값으로 교체
                      ...prev,
                      category: cat,
                    }))
                    setShowCategories(false)
                  }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="write-divider" />

        {/* 본문 입력 */}
        <textarea
          className="write-content"
          placeholder={
            '공부 중 겪었던 고민이나 경험을 공유해주세요.\n질문, 팁, 기록도 괜찮아요.'
          }
          value={form.content}
          onChange={e =>
            setForm(prev => ({
              // ...prev : 나머지 필드는 유지, content만 교체
              ...prev,
              content: e.target.value,
            }))
          }
        />

        <div className="write-divider" />

        {/* 사진 추가 영역 */}
        <div className="write-images">
          <p className="write-images__label">사진 추가하기</p>
          <div className="write-images__list">
            {/* 선택된 이미지 미리보기 */}
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`첨부 이미지 ${i + 1}`}
                className="write-images__preview"
              />
            ))}
            {/* + 버튼 클릭 시 숨겨진 file input을 열어 파일 선택 */}
            <button
              className="write-images__add"
              onClick={() => fileInputRef.current?.click()}
            >
              +
            </button>
          </div>
        </div>

        {/* 실제 파일 선택 input (화면에 숨김, ref로 접근) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleImageChange}
        />
      </div>
    </div>
  )
}
