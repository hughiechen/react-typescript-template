import { request } from '@/utils/network'

export interface CreateCenterReq {
  studyid?: string
  code: string
  name: string
  alias?: string
  provinceCode: string
  cityCode: string
  areaCode: string
}

export const createCenter = async (body: CreateCenterReq) => {
  return request<void>({
    url: '/sites',
    method: 'POST',
    body,
  })
}
