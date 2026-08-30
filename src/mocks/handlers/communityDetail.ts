import { http } from 'msw'
import { ok, fail } from '../envelope'
import { communityDb, findPost, seedPosts } from '../db/community'
import type { CommunityPostDetailResponse } from '../../pages/Community/CommunityDetail/CommunityDetail.types'

// 테스트에서 참조하는 시드 데이터
export const mockPostDetails: Record<number, CommunityPostDetailResponse> =
  Object.fromEntries(seedPosts.map(post => [post.id, { post }]))

export const communityDetailHandlers = [
  // 상세 조회
  http.get('/api/v1/community/posts/:id', ({ params }) => {
    const post = findPost(Number(params.id))
    if (!post) {
      return fail(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }
    return ok({ post })
  }),

  // 댓글 작성
  http.post(
    '/api/v1/community/posts/:id/comments',
    async ({ params, request }) => {
      const post = findPost(Number(params.id))
      if (!post) {
        return fail(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
      }

      const body = (await request.json()) as { content?: string }
      if (!body?.content?.trim()) {
        return fail(400, 'EMPTY_COMMENT', '댓글 내용을 입력해주세요.')
      }

      const comment = {
        id: communityDb.nextCommentId++,
        authorName: '엄박봉',
        content: body.content.trim(),
        date: '방금 전',
      }
      post.commentList.push(comment)
      post.comments += 1

      return ok(comment, { status: 201, code: 'CREATED' })
    }
  ),

  // 좋아요 토글
  http.post('/api/v1/community/posts/:id/like', ({ params }) => {
    const post = findPost(Number(params.id))
    if (!post) {
      return fail(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }

    post.liked = !post.liked
    post.likes += post.liked ? 1 : -1

    return ok({ liked: post.liked, likes: post.likes })
  }),
]
