import { http, HttpResponse } from 'msw'
import type {
  StudyGroupListResponse,
  StudyGroupDetailResponse,
} from '../../pages/StudyGroup/studyGroup.types'

export const mockStudyGroups: StudyGroupListResponse = {
  groups: [
    {
      id: 1,
      title: 'AI 프로젝트를 만들어보자!',
      description:
        'AI 기술을 활용해 함께 프로젝트를 진행할 팀원을 모집합니다. 기초부터 차근차근 진행해요.',
      category: 'AI/개발',
      mode: 'online',
      tags: ['AI', '개발', '파이썬'],
      categoryTags: ['온라인 스터디', '단기 스터디'],
      memberCount: 2,
      maxMemberCount: 5,
      startDate: '2026.02.01',
      endDate: '2026.04.30',
    },
    {
      id: 2,
      title: '영어 회화 스터디 같이해요',
      description:
        '매일 30분씩 영어 회화를 연습하는 스터디입니다. 초급자도 환영해요!',
      category: '언어학습',
      mode: 'offline',
      tags: ['영어', '회화', '언어'],
      categoryTags: ['오프라인 스터디', '서울', '단기 스터디'],
      memberCount: 3,
      maxMemberCount: 6,
      startDate: '2026.02.10',
      endDate: '2026.05.10',
      location: '서울 강남구',
    },
    {
      id: 3,
      title: '코딩 테스트 대비 알고리즘 스터디',
      description:
        '취업 준비를 위한 알고리즘 문제 풀이 스터디. 매주 3문제씩 풀고 리뷰해요.',
      category: '취업준비',
      mode: 'online',
      tags: ['코딩테스트', '알고리즘', '취업'],
      categoryTags: ['온라인 스터디', '면접 준비', '경기'],
      memberCount: 4,
      maxMemberCount: 8,
      startDate: '2026.01.15',
      endDate: '2026.03.15',
    },
  ],
}

export const mockStudyGroupDetails: Record<number, StudyGroupDetailResponse> = {
  1: {
    group: {
      ...mockStudyGroups.groups[0],
      hostName: '엄박봉',
      goal: 'AI 프로젝트 완성 및 포트폴리오 제작',
    },
  },
  2: {
    group: {
      ...mockStudyGroups.groups[1],
      hostName: '김철수',
      goal: '영어 회화 실력 향상 및 OPIC 시험 준비',
    },
  },
  3: {
    group: {
      ...mockStudyGroups.groups[2],
      hostName: '이영희',
      goal: '코딩 테스트 합격 및 취업 성공',
    },
  },
}

export const studyGroupHandlers = [
  http.get('/api/studygroup/groups', ({ request }) => {
    const url = new URL(request.url)
    const cats = url.searchParams.get('cats')
    const selectedCats = cats ? cats.split(',').filter(Boolean) : []

    const filtered =
      selectedCats.length === 0
        ? mockStudyGroups.groups
        : mockStudyGroups.groups.filter(g =>
            g.categoryTags?.some(tag => selectedCats.includes(tag))
          )
    return HttpResponse.json({ groups: filtered })
  }),

  http.get('/api/studygroup/groups/:id', ({ params }) => {
    const id = Number(params.id)
    const detail = mockStudyGroupDetails[id]
    if (!detail) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    return HttpResponse.json(detail)
  }),

  http.post('/api/studygroup/groups', () => {
    return HttpResponse.json({ success: true }, { status: 201 })
  }),

  http.post('/api/studygroup/groups/:id/apply', () => {
    return HttpResponse.json({ success: true }, { status: 201 })
  }),
]
