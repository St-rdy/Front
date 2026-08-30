import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../../components/Modal'
import {
  useBookmarks,
  useDeleteMyPost,
  useJoinedStudies,
  useMyComments,
  useMyPosts,
  useRemoveBookmark,
} from '../../hooks/useUser'
import './UserCollections.css'

// 4개 하위 화면이 공유하는 껍데기 (뒤로가기 헤더 + 총 개수 + 상태 표시)
function CollectionLayout({
  title,
  count,
  isLoading,
  isError,
  isEmpty,
  emptyMessage,
  children,
}: {
  title: string
  count?: number
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  emptyMessage: string
  children: ReactNode
}) {
  const navigate = useNavigate()

  return (
    <div className="uc-page">
      <div className="uc-header">
        <button className="uc-header__back" onClick={() => navigate(-1)}>
          <img src="/Header/back_arrow.svg" alt="뒤로" />
        </button>
        <h2 className="uc-header__title">{title}</h2>
        <div className="uc-header__placeholder" />
      </div>

      {isLoading && <p className="uc-state">불러오는 중...</p>}
      {isError && <p className="uc-state">데이터를 불러오지 못했습니다.</p>}

      {!isLoading && !isError && (
        <>
          <div className="uc-summary">
            <span className="uc-summary__count">총 {count ?? 0}개</span>
            <span className="uc-summary__sort">최신순</span>
          </div>

          {isEmpty ? (
            <div className="uc-empty">
              <p className="uc-empty__emoji">🗂️</p>
              <p className="uc-empty__text">{emptyMessage}</p>
            </div>
          ) : (
            children
          )}
        </>
      )}
    </div>
  )
}

// 내가 쓴 게시물 — 카드 그리드 + 삭제 확인 모달
export function UserPosts() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useMyPosts()
  const deletePost = useDeleteMyPost()
  const [targetId, setTargetId] = useState<number | null>(null)

  function confirmDelete() {
    if (targetId === null) return
    deletePost.mutate(targetId, {
      onSettled: () => setTargetId(null),
    })
  }

  return (
    <CollectionLayout
      title="내가 쓴 게시물"
      count={data?.length}
      isLoading={isLoading}
      isError={isError}
      isEmpty={(data?.length ?? 0) === 0}
      emptyMessage="아직 게시물이 없어요"
    >
      <div className="uc-grid">
        {data?.map(post => (
          <article key={post.id} className="uc-card">
            <button
              className="uc-card__thumb"
              onClick={() => navigate(`/community/${post.id}`)}
              aria-label={`${post.title} 열기`}
            >
              {post.thumbnail ? (
                <img src={post.thumbnail} alt={post.title} />
              ) : (
                <span className="uc-card__thumb-fallback">📄</span>
              )}
            </button>
            <div className="uc-card__meta">
              <div>
                <p className="uc-card__title">{post.title}</p>
                <p className="uc-card__date">{post.date}</p>
              </div>
              <button
                className="uc-card__option"
                onClick={() => setTargetId(post.id)}
                aria-label={`${post.title} 삭제`}
              >
                <img src="/Card/card_option.svg" alt="옵션" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <Modal
        isOpen={targetId !== null}
        onClose={() => setTargetId(null)}
        title="해당 게시물을 삭제하시겠습니까?"
        content="삭제한 게시물은 되돌릴 수 없어요."
        buttons={[
          {
            label: '취소',
            onClick: () => setTargetId(null),
            variant: 'secondary',
          },
          {
            label: deletePost.isPending ? '삭제 중...' : '삭제',
            onClick: confirmDelete,
            variant: 'primary',
            disabled: deletePost.isPending,
          },
        ]}
      />
    </CollectionLayout>
  )
}

// 내가 쓴 댓글
export function UserComments() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useMyComments()

  return (
    <CollectionLayout
      title="내가 쓴 댓글"
      count={data?.length}
      isLoading={isLoading}
      isError={isError}
      isEmpty={(data?.length ?? 0) === 0}
      emptyMessage="아직 작성한 댓글이 없어요"
    >
      <ul className="uc-list">
        {data?.map(comment => (
          <li key={comment.id}>
            <button
              className="uc-row"
              onClick={() => navigate(`/community/${comment.postId}`)}
            >
              <span className="uc-row__thumb">💬</span>
              <span className="uc-row__body">
                <span className="uc-row__title">{comment.content}</span>
                <span className="uc-row__date">{comment.date}</span>
              </span>
              <span className="uc-row__arrow">›</span>
            </button>
          </li>
        ))}
      </ul>
    </CollectionLayout>
  )
}

// 북마크
export function UserBookmarks() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useBookmarks()
  const removeBookmark = useRemoveBookmark()

  return (
    <CollectionLayout
      title="북마크"
      count={data?.length}
      isLoading={isLoading}
      isError={isError}
      isEmpty={(data?.length ?? 0) === 0}
      emptyMessage="아직 저장한 글이 없어요"
    >
      <div className="uc-grid">
        {data?.map(item => (
          <article key={item.id} className="uc-card">
            <button
              className="uc-card__thumb"
              onClick={() => navigate(`/community/${item.postId}`)}
              aria-label={`${item.title} 열기`}
            >
              {item.thumbnail ? (
                <img src={item.thumbnail} alt={item.title} />
              ) : (
                <span className="uc-card__thumb-fallback">📄</span>
              )}
            </button>
            <div className="uc-card__meta">
              <div>
                <p className="uc-card__title">{item.title}</p>
                <p className="uc-card__date">{item.date}</p>
              </div>
              <button
                className="uc-card__heart"
                onClick={() => removeBookmark.mutate(item.id)}
                aria-label={`${item.title} 북마크 해제`}
              >
                <img src="/List/Heart.svg" alt="북마크 해제" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </CollectionLayout>
  )
}

// 참여 스터디
export function UserStudies() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useJoinedStudies()

  return (
    <CollectionLayout
      title="참여 스터디"
      count={data?.length}
      isLoading={isLoading}
      isError={isError}
      isEmpty={(data?.length ?? 0) === 0}
      emptyMessage="아직 참여 중인 스터디가 없어요"
    >
      <ul className="uc-list">
        {data?.map(study => (
          <li key={study.id}>
            <button
              className="uc-study"
              onClick={() => navigate(`/studygroup/${study.id}`)}
            >
              <span className="uc-study__title">{study.title}</span>
              <span className="uc-study__tags">
                {study.tags.map(tag => (
                  <span key={tag} className="uc-study__tag">
                    {tag}
                  </span>
                ))}
              </span>
              <span className="uc-study__desc">{study.description}</span>
              <span className="uc-study__meta">
                {study.hostName} · {study.memberCount}명 참여 중
              </span>
            </button>
          </li>
        ))}
      </ul>
    </CollectionLayout>
  )
}
