import apiClient from './client'
import type {
  StudyGroupListResponse,
  StudyGroupDetailResponse,
  StudyGroupCreateForm,
  StudyGroupApplyForm,
} from '../pages/StudyGroup/studyGroup.types'

export async function fetchStudyGroups(
  categories?: string[]
): Promise<StudyGroupListResponse> {
  const { data } = await apiClient.get<StudyGroupListResponse>(
    '/studygroup/groups',
    {
      params:
        categories && categories.length > 0
          ? { cats: categories.join(',') }
          : undefined,
    }
  )
  return data
}

export async function fetchStudyGroupDetail(
  id: number
): Promise<StudyGroupDetailResponse> {
  const { data } = await apiClient.get<StudyGroupDetailResponse>(
    `/studygroup/groups/${id}`
  )
  return data
}

export async function createStudyGroup(
  form: StudyGroupCreateForm
): Promise<void> {
  await apiClient.post('/studygroup/groups', form)
}

export async function applyStudyGroup(
  id: number,
  form: StudyGroupApplyForm
): Promise<void> {
  await apiClient.post(`/studygroup/groups/${id}/apply`, form)
}
