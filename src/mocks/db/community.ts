import type { CommunityPostDetail } from '../../pages/Community/CommunityDetail/CommunityDetail.types'

// 커뮤니티 목 데이터 저장소
// 글 작성 / 댓글 작성 / 좋아요가 실제로 반영되도록 메모리에 상태를 들고 있습니다.

export const seedPosts: CommunityPostDetail[] = [
  {
    id: 1,
    title: '공부 루틴을 꾸준히 유지하는 팁 공유해요',
    content:
      '요즘 공부를 시작할 때는 의욕이 넘치는데, 며칠 지나면 흐트러지는 경우가 많네요. 여러분은 어떤 방식으로 공부 루틴을 유지하고 계신가요? 시간 관리 방법이나 작은 습관...',
    date: '2026.01.07',
    authorName: '엄박봉',
    comments: 123,
    likes: 63,
    liked: false,
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
  {
    id: 2,
    title: '혼자 공부할 때 집중력 유지하는 방법 있을...',
    content:
      '스터디 그룹이 없을 때 혼자 공부하면 자꾸 집중이 흐트러지는 것 같아요. 짧게라도 집중할 수 있는 방법이나 환경 세팅 팁이 있다면 알려주세요!',
    date: '2026.01.07',
    authorName: '엄박봉',
    comments: 123,
    likes: 63,
    liked: false,
    category: '전체',
    commentList: [],
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
    liked: false,
    category: '취업 준비',
    commentList: [],
  },
]

// 깊은 복사로 시드를 만들어야 테스트 간에 상태가 새지 않습니다.
function cloneSeed(): CommunityPostDetail[] {
  return seedPosts.map(post => ({
    ...post,
    commentList: post.commentList.map(comment => ({ ...comment })),
  }))
}

export const communityDb = {
  posts: cloneSeed(),
  nextPostId: 100,
  nextCommentId: 100,
}

export function resetCommunityDb(): void {
  communityDb.posts = cloneSeed()
  communityDb.nextPostId = 100
  communityDb.nextCommentId = 100
}

export function findPost(id: number): CommunityPostDetail | undefined {
  return communityDb.posts.find(post => post.id === id)
}
