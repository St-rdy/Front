import { useQuery } from '@tanstack/react-query'
import { fetchStudyGroups, fetchStudyGroupDetail } from '../api/studyGroup'

export const STUDY_GROUP_QUERY_KEYS = {
  groups: (cats: string[]) => ['studygroup', 'groups', cats.join(',')] as const,
  groupDetail: (id: number | undefined) =>
    ['studygroup', 'groups', id] as const,
}

export function useStudyGroups(categories: string[] = []) {
  return useQuery({
    queryKey: STUDY_GROUP_QUERY_KEYS.groups(categories),
    queryFn: () => fetchStudyGroups(categories),
  })
}

export function useStudyGroupDetail(id: number | undefined) {
  return useQuery({
    queryKey: STUDY_GROUP_QUERY_KEYS.groupDetail(id),
    queryFn: () => fetchStudyGroupDetail(id!),
    enabled: id !== undefined,
  })
}
