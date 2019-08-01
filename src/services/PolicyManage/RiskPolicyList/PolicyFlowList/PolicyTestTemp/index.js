import request from '@/utils/request';
const _baseApi = '/aems'
//查询策略策略测试模板列表信息
export async function queryTestTempList(params) {
  return request(`${_baseApi}/admin/asset/list`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//新增测试模板
export async function addTestTemp(params) {
  return request(`${_baseApi}/admin/asset/detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//执行测试模板
export async function carryTestTemp(params) {
  return request(`${_baseApi}/admin/asset/detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}