import apiClient from './client'
import type { ApiEnvelope } from './types'
import type {
  StudyGroupListResponse,
  StudyGroupDetailResponse,
  StudyGroupCreateForm,
  StudyGroupApplyForm,
  StudyGroup,
} from '../pages/StudyGroup/studyGroup.types'

export async function fetchStudyGroups(
  categories?: string[]
): Promise<StudyGroupListResponse> {
  const { data } = await apiClient.get<ApiEnvelope<StudyGroupListResponse>>(
    '/studygroup/groups',
    {
      params:
        categories && categories.length > 0
          ? { cats: categories.join(',') }
          : undefined,
    }
  )
  return data.data
}

export async function fetchStudyGroupDetail(
  id: number
): Promise<StudyGroupDetailResponse> {
  const { data } = await apiClient.get<ApiEnvelope<StudyGroupDetailResponse>>(
    `/studygroup/groups/${id}`
  )
  return data.data
}

export async function createStudyGroup(
  form: StudyGroupCreateForm
): Promise<StudyGroup> {
  const { data } = await apiClient.post<ApiEnvelope<StudyGroup>>(
    '/studygroup/groups',
    form
  )
  return data.data
}

export async function applyStudyGroup(
  id: number,
  form: StudyGroupApplyForm
): Promise<{ success: boolean }> {
  const { data } = await apiClient.post<ApiEnvelope<{ success: boolean }>>(
    `/studygroup/groups/${id}/apply`,
    form
  )
  return data.data
}
