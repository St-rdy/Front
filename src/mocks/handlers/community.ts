import { http, HttpResponse } from 'msw'
import type { CommunityPostsResponse } from '../../pages/Community/community.types'

export const mockPosts: CommunityPostsResponse = {
  posts: [
    {
      id: 1,
      title: '공부 루틴을 꾸준히 유지하는 팁 공유해요',
      content:
        '요즘 공부를 시작할 때는 의욕이 넘치는데, 며칠 지나면 흐트러지는 경우가 많네요. 여러분은 어떤 방식으로 공부 루틴을 유지하고 계신가요? 시간 관리 방법이나 작은 습관...',
      date: '2026.01.07',
      authorName: '엄박봉',
      comments: 123,
      likes: 63,
      category: '공부 인증',
    },
    {
      id: 2,
      title: '혼자 공부할 때 집중력 유지하는 방법 있을...',
      content:
        '스터디 그룹이 없을 때 혼자 공부하면 자꾸 집중이 흐트러지는 것 같아요. 짧게라도 집중할 수 있는 방법이나 환경 세팅 팁이 있다면 알려주세요!',
      date: '2026.01.07',
      authorName: '엄박봉',
      comments: 123,
      likes: 63,
      category: '전체',
    },
    {
      id: 3,
      title: '취업 준비 같이 하실 분! 🔥',
      content:
        '함께 취업 준비하면서 동기부여 받고 싶으신 분들 모여주세요! 매일 인증하고 서로 응원해요.',
      date: '2026.01.07',
      authorName: '엄박봉',
      comments: 123,
      likes: 63,
      category: '취업 준비',
    },
  ],
}

// 커뮤니티 핸들러
export const communityHandlers = [
  // http get을 받았을 때 MSW가 요청을 가로챔
  http.get('/api/community/posts', ({ request }) => {
    const url = new URL(request.url) // 요청 url (http://localhost:5173/api/community/posts?category=취업준비)
    const category = url.searchParams.get('category') // url 내부에서 category를 찾음
    // 카테고리가 없거나, 카테고리가 전체이면 모든 데이터를 제공해주고, 아니라면 filter를 통해 해당하는 카테고리만 보여주게 함
    const filtered =
      !category || category === '전체'
        ? mockPosts.posts
        : mockPosts.posts.filter(p => p.category === category)

    return HttpResponse.json({ posts: filtered }) // 게시글 목록을 반환
  }),
]
