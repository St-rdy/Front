import { useState } from 'react'
import FilterBar from '../../components/FilterBar/FilterBar'
import { useCommunityPosts } from '../../hooks/useCommunity'
import type { CommunityPost } from './community.types'
import './Community.css'

const CATEGORIES = ['전체', '취업 준비', '공부 인증', '스터디 그룹']

function PostCard({ post }: { post: CommunityPost }) {
  return (
    <div className="community-card">
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
  const { data, isLoading, isError } = useCommunityPosts(selectedCategory)

  return (
    <div className="community-page">
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
            <p className="community-state">게시글이 없습니다.</p>
          ) : (
            data.posts.map((post: CommunityPost) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      )}

      <button className="community-fab">
        <img src="/Community/edit.svg" alt="글쓰기" />
      </button>
    </div>
  )
}
