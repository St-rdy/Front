import { http } from 'msw'
import { ok, fail } from '../envelope'
import { communityDb, seedPosts } from '../db/community'
import type {
  CommunityPost,
  CommunityPostsResponse,
  CommunityWriteRequest,
} from '../../pages/Community/community.types'

// 목록에 필요한 필드만 남깁니다. (commentList 제외)
function toListItem(post: (typeof communityDb.posts)[number]): CommunityPost {
  const { commentList: _commentList, ...rest } = post
  void _commentList
  return rest
}

// 테스트에서 참조하는 시드 데이터
export const mockPosts: CommunityPostsResponse = {
  posts: seedPosts.map(toListItem),
}

// 커뮤니티 핸들러
export const communityHandlers = [
  // 목록 조회: 카테고리 필터 + 검색어(q)
  http.get('/api/v1/community/posts', ({ request }) => {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const keyword = url.searchParams.get('q')?.trim().toLowerCase()

    let filtered = communityDb.posts
    if (category && category !== '전체') {
      filtered = filtered.filter(p => p.category === category)
    }
    if (keyword) {
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(keyword) ||
          p.content.toLowerCase().includes(keyword)
      )
    }

    return ok({ posts: filtered.map(toListItem) })
  }),

  // 글 작성
  http.post('/api/v1/community/posts', async ({ request }) => {
    const body = (await request.json()) as CommunityWriteRequest

    if (!body?.title?.trim() || !body?.content?.trim()) {
      return fail(400, 'INVALID_POST', '제목과 내용을 모두 입력해주세요.')
    }

    const now = new Date()
    const created = {
      id: communityDb.nextPostId++,
      title: body.title,
      content: body.content,
      category: body.category || '전체',
      date: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`,
      authorName: '엄박봉',
      comments: 0,
      likes: 0,
      liked: false,
      commentList: [],
    }

    // 최신 글이 목록 맨 위에 오도록 앞에 붙입니다.
    communityDb.posts.unshift(created)
    return ok(toListItem(created), { status: 201, code: 'CREATED' })
  }),
]
