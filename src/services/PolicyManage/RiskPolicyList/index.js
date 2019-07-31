import request from '@/utils/request';
const _baseApi = '/aems'
//查询风控策略列表信息
export async function queryPolicyList(params) {
  return request(`${_baseApi}/admin/asset/list`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//新增风控策略
export async function addPolicy(params) {
  return request(`${_baseApi}/admin/asset/detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//编辑风控策略
export async function editPolicy(params) {
  return request(`${_baseApi}/admin/asset/risk_detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}