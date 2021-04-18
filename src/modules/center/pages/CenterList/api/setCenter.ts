import { request } from '@/utils/network'

export interface SetCenterParams {
  id: string
}

export interface SetCenterBody {
  studyid?: string
  code: string
  name: string
  alias?: string
  /** 后期会删掉 */
  seq: number
  provinceCode: string
  cityCode: string
  areaCode: string
}

export const setCenter = async (params: SetCenterParams, body: SetCenterBody) => {
  return request<void>({
    url: '/sites/{id}',
    method: 'PATCH',
    params,
    body,
  })
}
