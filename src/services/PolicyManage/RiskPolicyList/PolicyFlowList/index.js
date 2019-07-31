import request from '@/utils/request';
const _baseApi = '/aems'
//查询策略流列表信息
export async function queryPolicyFlowList(params) {
  return request(`${_baseApi}/admin/asset/list`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//策略流启用/禁用
export async function isForbid(params) {
  return request(`${_baseApi}/admin/asset/detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}