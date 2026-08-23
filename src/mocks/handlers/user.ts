import { http } from 'msw'
import { ok, fail } from '../envelope'
import { getAuthMockUser } from './auth'
import type {
  BookmarkItem,
  JoinedStudy,
  MyComment,
  MyPost,
  UserProfile,
} from '../../types/user'

function seedPosts(): MyPost[] {
  return [
    {
      id: 1,
      title: '공부 루틴을 꾸준히 유지하는 팁 공유해요',
      date: '2026.01.11',
    },
    { id: 2, title: '혼자 공부할 때 집중력 유지하는 방법', date: '2026.01.11' },
    { id: 3, title: '취업 준비 같이 하실 분! 🔥', date: '2026.01.11' },
    { id: 4, title: '스터디 인증 4일차', date: '2026.01.10' },
    { id: 5, title: '기출문제 정리 공유합니다', date: '2026.01.09' },
    { id: 6, title: '오늘의 학습 기록', date: '2026.01.08' },
  ]
}

function seedComments(): MyComment[] {
  return [
    { id: 1, postId: 1, content: '안녕하세요 반가워요', date: '2026.01.13' },
    { id: 2, postId: 1, content: '저도 같은 고민이었어요', date: '2026.01.16' },
    { id: 3, postId: 2, content: '좋은 팁 감사합니다!', date: '2026.01.19' },
    { id: 4, postId: 3, content: '참여하고 싶어요', date: '2026.01.18' },
    { id: 5, postId: 3, content: '응원합니다', date: '2026.01.18' },
  ]
}

function seedBookmarks(): BookmarkItem[] {
  return [
    {
      id: 1,
      postId: 1,
      title: '공부 루틴을 꾸준히 유지하는 팁 공유해요',
      date: '2026.01.07',
    },
    {
      id: 2,
      postId: 2,
      title: '혼자 공부할 때 집중력 유지하는 방법',
      date: '2026.01.07',
    },
    {
      id: 3,
      postId: 3,
      title: '취업 준비 같이 하실 분! 🔥',
      date: '2026.01.07',
    },
  ]
}

function seedStudies(): JoinedStudy[] {
  return [
    {
      id: 1,
      title: 'AI 프로젝트를 만들어보자!',
      description: 'AI 기술을 활용해 함께 프로젝트를 진행할 팀원을 모집합니다.',
      tags: ['온라인', '개발'],
      memberCount: 2,
      hostName: '엄박봉',
    },
    {
      id: 3,
      title: '코딩 테스트 대비 알고리즘 스터디',
      description: '매주 3문제씩 풀고 리뷰하는 취업 준비 스터디입니다.',
      tags: ['온라인', '취업'],
      memberCount: 4,
      hostName: '이영희',
    },
  ]
}

let myPosts = seedPosts()
let myComments = seedComments()
let bookmarks = seedBookmarks()
let joinedStudies = seedStudies()

export function resetUserMock(): void {
  myPosts = seedPosts()
  myComments = seedComments()
  bookmarks = seedBookmarks()
  joinedStudies = seedStudies()
}

function buildProfile(): UserProfile {
  const account = getAuthMockUser()
  return {
    id: account?.id ?? 1,
    name: account?.name ?? '엄박봉',
    nickname: account?.nickname ?? '엄박봉',
    postCount: myPosts.length,
    followerCount: 31000,
    followingCount: 300,
    stats: {
      level: { percentage: 70, detail: '8Lv : 1400EXP' },
      todayStudy: { percentage: 60, detail: '3시간 / 5시간' },
      weeklyGoal: { percentage: 72, detail: '18시간 / 25시간' },
    },
  }
}

export const userHandlers = [
  http.get('/api/v1/users/me/profile', ({ request }) => {
    if (!request.headers.get('Authorization')) {
      return fail(401, 'UNAUTHORIZED', '로그인이 필요합니다.')
    }
    return ok(buildProfile())
  }),

  http.get('/api/v1/users/me/posts', () => ok(myPosts)),

  http.delete('/api/v1/users/me/posts/:id', ({ params }) => {
    const id = Number(params.id)
    const idx = myPosts.findIndex(p => p.id === id)
    if (idx === -1) {
      return fail(404, 'POST_NOT_FOUND', '게시물을 찾을 수 없습니다.')
    }
    myPosts.splice(idx, 1)
    return ok({ success: true })
  }),

  http.get('/api/v1/users/me/comments', () => ok(myComments)),

  http.get('/api/v1/users/me/bookmarks', () => ok(bookmarks)),

  http.delete('/api/v1/users/me/bookmarks/:id', ({ params }) => {
    const id = Number(params.id)
    const idx = bookmarks.findIndex(b => b.id === id)
    if (idx !== -1) bookmarks.splice(idx, 1)
    return ok({ success: true })
  }),

  http.get('/api/v1/users/me/studies', () => ok(joinedStudies)),
]
