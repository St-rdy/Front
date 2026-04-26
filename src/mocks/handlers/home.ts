import { http, HttpResponse } from 'msw'
import type { HomeSummaryResponse } from '../../types/home'

const mockHomeSummary: HomeSummaryResponse = {
  user: {
    name: '엄박봉',
  },
  stats: {
    level: { percentage: 70, detail: '8Lv : 1400EXP' },
    todayStudy: { percentage: 60, detail: '3시간 / 5시간' },
    weeklyGoal: { percentage: 72, detail: '18시간 / 25시간' },
  },
  schedules: [
    { id: 1, title: '영어 공부', time: '08:00' },
    { id: 2, title: '국어 공부', time: '10:00' },
  ],
  popularCommunity: [
    {
      id: 1,
      title: '취업 준비 같이 하실 분! 🔥',
      description:
        '함께 취업 준비하면서 동기부여 받고 싶으신 분들 모여주세요! 매일 인증하고 서로 응원해요.',
      comments: 123,
      timeAgo: '2시간 전',
    },
  ],
  myStudyGroups: [
    {
      id: 1,
      title: '2025 공무원 시험 준비',
      description:
        '함께 공무원 시험 준비하면서 학습 자료 공유하고 서로 격려해요! 주 3회 온라인 스터디 진행 중입니다.',
    },
  ],
}

export const homeHandlers = [
  http.get('/api/home/summary', () => {
    return HttpResponse.json(mockHomeSummary)
  }),
]
