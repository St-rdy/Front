// 백엔드 공통 응답 규약
// 모든 API는 /api/v1 하위에서 아래 엔벨로프로 응답합니다.
// (알림 API 스펙에서 확정된 형식을 전 도메인에 동일하게 적용)
export interface ApiEnvelope<T> {
  status: number
  code: string
  message: string
  data: T
}

// 엔벨로프에서 data만 꺼내는 헬퍼
export function unwrap<T>(envelope: ApiEnvelope<T>): T {
  return envelope.data
}
