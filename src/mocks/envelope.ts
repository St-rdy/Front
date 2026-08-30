import { HttpResponse } from 'msw'

// 목 응답을 백엔드 공통 엔벨로프 형식으로 감싸는 헬퍼
export function ok<T>(
  data: T,
  { status = 200, code = 'SUCCESS', message = '요청이 성공했습니다.' } = {}
) {
  return HttpResponse.json({ status, code, message, data }, { status })
}

export function fail(status: number, code: string, message: string) {
  return HttpResponse.json({ status, code, message, data: null }, { status })
}
