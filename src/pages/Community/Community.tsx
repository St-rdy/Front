import { useState } from 'react'
import FilterBar from '../../components/FilterBar/FilterBar'
import { useCommunityPosts } from '../../hooks/useCommunity'
import type { CommunityPost } from './community.types'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './Community.css'

const CATEGORIES = ['전체', '취업 준비', '공부 인증', '스터디 그룹']

function PostCard({ post }: { post: CommunityPost }) {
  const navigate = useNavigate()

  // 게시글 클릭 시 상세 페이지로 이동
  const handlePostClick = () => {
    navigate(`/community/${post.id}`)
  }

  return (
    <div className="community-card" onClick={handlePostClick}>
      <p className="community-card__title">{post.title}</p>
      <p className="community-card__content">{post.content}</p>
      <p className="community-card__date">{post.date}</p>
      <div className="community-card__footer">
        <div className="community-card__author">
          {post.authorAvatar ? (
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="community-card__avatar"
            />
          ) : (
            <div className="community-card__avatar-fallback" />
          )}
          <span className="community-card__author-name">{post.authorName}</span>
        </div>
        <div className="community-card__stats">
          <span className="community-card__stat">
            <img src="/List/Chat.svg" alt="댓글" />
            {post.comments}
          </span>
          <span className="community-card__stat">
            <img src="/List/Heart.svg" alt="좋아요" />
            {post.likes}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [searchParams, setSearchParams] = useSearchParams()
  // 헤더 검색에서 넘어온 검색어
  const keyword = searchParams.get('q') ?? ''
  const { data, isLoading, isError } = useCommunityPosts(
    selectedCategory,
    keyword
  )

  const navigate = useNavigate()

  // 검색 결과 화면에서 검색어만 지웁니다.
  function clearKeyword() {
    searchParams.delete('q')
    setSearchParams(searchParams, { replace: true })
  }

  const handleWriteClick = () => {
    navigate('/community/write')
  }

  return (
    <div className="community-page">
      {keyword && (
        <div className="community-search-bar">
          <span className="community-search-bar__text">
            <b>{keyword}</b> 검색 결과
          </span>
          <button
            className="community-search-bar__clear"
            onClick={clearKeyword}
          >
            검색 해제
          </button>
        </div>
      )}

      <FilterBar
        categories={CATEGORIES}
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />

      {isLoading && <p className="community-state">불러오는 중...</p>}
      {isError && (
        <p className="community-state">데이터를 불러오지 못했습니다.</p>
      )}

      {data && (
        <div className="community-list">
          {data.posts.length === 0 ? (
            <p className="community-state">
              {keyword
                ? `'${keyword}'에 대한 검색 결과가 없습니다.`
                : '게시글이 없습니다.'}
            </p>
          ) : (
            data.posts.map((post: CommunityPost) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      )}

      <button className="community-fab" onClick={handleWriteClick}>
        <img src="/Community/edit.svg" alt="글쓰기" />
      </button>
    </div>
  )
}
