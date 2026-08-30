import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  applyStudyGroup,
  createStudyGroup,
  fetchStudyGroupDetail,
  fetchStudyGroups,
} from '../api/studyGroup'
import type { StudyGroupApplyForm } from '../pages/StudyGroup/studyGroup.types'

export const STUDY_GROUP_QUERY_KEYS = {
  all: ['studygroup'] as const,
  groups: (cats: string[]) => ['studygroup', 'groups', cats.join(',')] as const,
  groupDetail: (id: number | undefined) =>
    ['studygroup', 'groupDetail', id] as const,
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

// 스터디 그룹 생성 → 목록 캐시를 비워 새 그룹이 바로 보이게 합니다.
export function useCreateStudyGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createStudyGroup,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: STUDY_GROUP_QUERY_KEYS.all }),
  })
}

// 스터디 그룹 신청
export function useApplyStudyGroup(id: number | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: StudyGroupApplyForm) => applyStudyGroup(id!, form),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: STUDY_GROUP_QUERY_KEYS.groupDetail(id),
      }),
  })
}
