import { useQuery } from '@tanstack/react-query'
import { fetchStudyGroups, fetchStudyGroupDetail } from '../api/studyGroup'

export const STUDY_GROUP_QUERY_KEYS = {
  groups: (category?: string) =>
    ['studygroup', 'groups', category ?? '전체'] as const,
  groupDetail: (id: number | undefined) =>
    ['studygroup', 'groups', id] as const,
}

export function useStudyGroups(category?: string) {
  return useQuery({
    queryKey: STUDY_GROUP_QUERY_KEYS.groups(category),
    queryFn: () => fetchStudyGroups(category),
  })
}

export function useStudyGroupDetail(id: number | undefined) {
  return useQuery({
    queryKey: STUDY_GROUP_QUERY_KEYS.groupDetail(id),
    queryFn: () => fetchStudyGroupDetail(id!),
    enabled: id !== undefined,
  })
}
