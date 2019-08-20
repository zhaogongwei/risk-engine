import request from '@/utils/request';
const _baseApi = '/merchant-admin'
//查询策略流列表信息
export async function queryPolicyFlowList(params) {
  return request(`${_baseApi}/strategyFlow/selectStrategyFlowPage`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//策略流启用/禁用
export async function isForbid(params) {
  return request(`${_baseApi}/strategyFlow/update/${params.flowId}/${params.status}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}