import request from '@/utils/request';
const _baseApi = '/merchant-admin'
//查询风控策略列表信息
export async function queryPolicyList(params) {
  return request(`${_baseApi}/strategy/selectStrategyPage`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//查询策略类型
export async function queryPolicyType(params) {
  return request(`${_baseApi}/strategy/selectStrategyTypes`, {
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