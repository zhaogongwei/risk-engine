import request from '@/utils/request';
const _baseApi = '/merchant-admin'
//查询灰名单列表
export async function queryGreyList(params) {
  return request(`${_baseApi}/report/greyList`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//禁用、启用
export async function isForbid(params) {
  return request(`${_baseApi}/report/updateGrey`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//拉黑
export async function pullBlack(params) {
  return request(`${_baseApi}/report/greyInBlack`, {
    method: 'POST',
    body: {
      ...params
    }
  })
}