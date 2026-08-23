// 최근 검색어 저장소 (디자인의 "최근 검색어" 영역)

const KEY = 'stardy.recentSearches'
const MAX = 8

export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === 'string')
      : []
  } catch {
    return []
  }
}

// 같은 검색어는 중복 없이 맨 앞으로 올리고, 최대 MAX개만 유지합니다.
export function addRecentSearch(keyword: string): string[] {
  const trimmed = keyword.trim()
  if (!trimmed) return getRecentSearches()

  const next = [
    trimmed,
    ...getRecentSearches().filter(k => k !== trimmed),
  ].slice(0, MAX)
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // 무시
  }
  return next
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // 무시
  }
}
