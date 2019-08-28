import request from '@/utils/request';
const _baseApi = '/merchant-admin'
//查询黑名单列表
export async function queryBlackList(params) {
  return request(`${_baseApi}/report/blackList`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//禁用、启用
export async function isForbid(params) {
  return request(`${_baseApi}/report/updateBlack`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//新增
export async function addBlackName(params) {
  return request(`${_baseApi}/report/insertBlack`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}