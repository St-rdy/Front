import { http, HttpResponse } from 'msw'
import type { CommunityPostDetailResponse } from '../../pages/Community/CommunityDetail/CommunityDetail.types'

// mock 데이터
const mockPostDetails: Record<number, CommunityPostDetailResponse> = {
  1: {
    post: {
      id: 1,
      title: '공부 루틴을 꾸준히 유지하는 팁 공유해요',
      content:
        '요즘 공부를 시작할 때는 의욕이 넘치는데, 며칠 지나면 흐트러지는 경우가 많네요.\n여러분은 어떤 방식으로 공부 루틴을 유지하고 계신가요?\n시간 관리 방법이나, 작업 습관 같은 것도 좋으니 공유 부탁드려요 ㅜㅜ',
      date: '2026.01.07',
      authorName: '엄박봉',
      comments: 123,
      likes: 63,
      category: '공부 인증',
      commentList: [
        {
          id: 1,
          authorName: '엄박봉',
          content: '보상 심리를 키우시는 건 어떠세요?',
          date: '2시간 전',
        },
        {
          id: 2,
          authorName: '엄박봉',
          content: '열심히 해보세요!',
          date: '3시간 전',
        },
      ],
    },
  },
}

// mock 데이터 요청 보내는 handler
export const communityDetailHandlers = [
  http.get('/api/community/post/:id', ({ params }) => {
    const id = Number(params.id)
    const detail = mockPostDetails[id]
    if (!detail) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    return HttpResponse.json(detail)
  }),
]
