import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useCommunityPostDetail,
  useCreateComment,
  useToggleLike,
} from '../../../hooks/useCommunity'
import type { CommunityComment } from './CommunityDetail.types'
import './CommunityDetail.css'

function CommentItem({ comment }: { comment: CommunityComment }) {
  return (
    <div className="detail-comment">
      <div className="detail-comment__author">
        {comment.authorAvatar ? (
          <img
            src={comment.authorAvatar}
            alt={comment.authorName}
            className="detail-comment__avatar"
          />
        ) : (
          <div className="detail-comment__avatar-fallback" />
        )}
        <div>
          <p className="detail-comment__name">{comment.authorName}</p>
          <p className="detail-comment__date">{comment.date}</p>
        </div>
      </div>
      <p className="detail-comment__content">{comment.content}</p>
      <button className="detail-comment__reply">답글 달기</button>
    </div>
  )
}

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>()
  const postId = id !== undefined ? Number(id) : undefined
  const navigate = useNavigate()
  const { data, isLoading, isError } = useCommunityPostDetail(postId)

  const [commentText, setCommentText] = useState('')
  const createComment = useCreateComment(postId)
  const toggleLike = useToggleLike(postId)

  function handleCommentSubmit() {
    const content = commentText.trim()
    if (!content || createComment.isPending) return

    createComment.mutate(content, {
      onSuccess: () => setCommentText(''),
    })
  }

  return (
    <>
      <div className="detail-page">
        <div className="detail-header">
          <button className="detail-header__back" onClick={() => navigate(-1)}>
            <img src="/Header/back_arrow.svg" alt="뒤로" />
          </button>
          <h2 className="detail-header__title">
            {data?.post.category ?? '게시글'}
          </h2>
          <button className="detail-header__options">
            <img src="/Card/card_option.svg" alt="옵션" />
          </button>
        </div>

        {isLoading && <p className="detail-state">불러오는 중...</p>}
        {isError && (
          <p className="detail-state">데이터를 불러오지 못했습니다.</p>
        )}

        {data && (
          <>
            <div className="detail-post">
              <div className="detail-post__author">
                {data.post.authorAvatar ? (
                  <img
                    src={data.post.authorAvatar}
                    alt={data.post.authorName}
                    className="detail-post__avatar"
                  />
                ) : (
                  <div className="detail-post__avatar-fallback" />
                )}
                <div>
                  <p className="detail-post__author-name">
                    {data.post.authorName}
                  </p>
                  <p className="detail-post__date">{data.post.date}</p>
                </div>
              </div>
              <h1 className="detail-post__title">{data.post.title}</h1>
              <p className="detail-post__content">{data.post.content}</p>
              <div className="detail-post__stats">
                <button
                  className={`detail-post__stat detail-post__stat--like${
                    data.post.liked ? ' detail-post__stat--liked' : ''
                  }`}
                  onClick={() => toggleLike.mutate()}
                  disabled={toggleLike.isPending}
                  aria-pressed={data.post.liked ?? false}
                  aria-label="좋아요"
                >
                  <img src="/List/Heart.svg" alt="좋아요" />
                  {data.post.likes}
                </button>
                <span className="detail-post__stat">
                  <img src="/List/Chat.svg" alt="댓글" />
                  {data.post.comments}
                </span>
              </div>
            </div>

            <div className="detail-comments">
              {data.post.commentList.length === 0 ? (
                <p className="detail-comments__empty">
                  아직 댓글이 없어요. 첫 댓글을 남겨보세요!
                </p>
              ) : (
                data.post.commentList.map(comment => (
                  <CommentItem key={comment.id} comment={comment} />
                ))
              )}
            </div>
          </>
        )}

        <div className="detail-comment-input">
          <input
            type="text"
            className="detail-comment-input__field"
            placeholder="댓글을 작성하세요"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleCommentSubmit()
            }}
          />
          <button
            className="detail-comment-input__send"
            onClick={handleCommentSubmit}
            disabled={!commentText.trim() || createComment.isPending}
            aria-label="댓글 등록"
          >
            →
          </button>
        </div>
      </div>
    </>
  )
}
