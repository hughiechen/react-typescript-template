import { request } from '@/utils/network'

export interface GetCenterListReq {
  studyid?: string
  src?: string
  name?: string
  page?: number
  limit?: number
}

export interface Center {
  id: string
  seq: number
  code: string
  name: string
  alias: string
  provinceCode: string
  cityCode: string
  areaCode: string
}

export interface GetCenterListRes {
  data: Center[]
  total: number
}

export const getCenterList = async (query: GetCenterListReq) => {
  return request<GetCenterListRes>({
    url: '/sites',
    method: 'GET',
    query,
  })
}
